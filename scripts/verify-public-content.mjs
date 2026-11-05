import { readdir, readFile } from 'node:fs/promises';
import { extname, relative } from 'node:path';
import { execFileSync } from 'node:child_process';
const root=process.cwd();
const denylist=JSON.parse(process.env.PRIVATE_CONTENT_DENYLIST || '[]');
if(!Array.isArray(denylist) || denylist.some(s=>typeof s!=='string'||!s.trim())) throw Error('PRIVATE_CONTENT_DENYLIST must be a JSON array of nonempty strings.');
const normalize=s=>s.normalize('NFKC').replace(/[\u200B-\u200D\uFEFF]/g,'').toLocaleLowerCase('en-US');
const needles=denylist.map(normalize);
const extensions=new Set(['.html','.css','.js','.mjs','.ts','.astro','.json','.xml','.svg','.md','.txt','.yml','.yaml','.toml','.py']);
let checked=0;const violations=[];
async function walk(dir) {
  for(const entry of await readdir(dir,{withFileTypes:true})) {
    if(['node_modules','.git','.astro','tmp'].includes(entry.name)) continue;
    const path=`${dir}/${entry.name}`;
    if(entry.isDirectory()) {await walk(path);continue;}
    if(entry.isSymbolicLink()) {violations.push(`${relative(root,path)}: symlinks require explicit review`);continue;}
    if(/private[-_ ]?(cv|resume)|\.env(?:\.|$)|credentials/i.test(entry.name)) violations.push(`${relative(root,path)}: private-file naming`);
    let text;
    if(extname(path)==='.pdf') {
      try {text=execFileSync(process.env.PDF_PYTHON || 'python3',['-c','import sys,json;from pypdf import PdfReader;r=PdfReader(sys.argv[1]);print(json.dumps(dict(r.metadata or {})));print("\\n".join(p.extract_text() or "" for p in r.pages))',path],{encoding:'utf8',stdio:['ignore','pipe','pipe']});}
      catch {throw Error('PDF text and metadata inspection requires pypdf. Set PDF_PYTHON to an interpreter with pypdf installed.');}
    } else if(extensions.has(extname(path)) || ['.gitignore','.nojekyll','LICENSE'].includes(entry.name)) text=await readFile(path,'utf8');
    else continue;
    checked++;
    if(needles.some(n=>normalize(text).includes(n))) violations.push(`${relative(root,path)}: restricted content match`);
    if(/-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----/.test(text)) violations.push(`${relative(root,path)}: private key`);
  }
}
await walk(root);
let history='No local Git history exists.';
try {
 const revs=execFileSync('git',['rev-list','--all'],{encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim().split('\n').filter(Boolean);
 history=`Checked ${revs.length} Git revisions.`;
 for(const rev of revs) {
  const message=execFileSync('git',['show','-s','--format=%B',rev],{encoding:'utf8'});
  if(needles.some(n=>normalize(message).includes(n))) violations.push('Git history: restricted commit message');
  const files=execFileSync('git',['ls-tree','-r','--name-only',rev],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
  for(const file of files) {
   if(!extensions.has(extname(file))&&extname(file)!=='.pdf'&&!['.gitignore','.nojekyll','LICENSE'].includes(file.split('/').at(-1))) continue;
   const bytes=execFileSync('git',['show',`${rev}:${file}`],{maxBuffer:32*1024*1024});
   let text=bytes.toString('utf8');
   if(extname(file)==='.pdf') text=execFileSync(process.env.PDF_PYTHON||'python3',['-c','import sys,io;from pypdf import PdfReader;r=PdfReader(io.BytesIO(sys.stdin.buffer.read()));print(dict(r.metadata or {}));print("\\n".join(p.extract_text() or "" for p in r.pages))'],{input:bytes,encoding:'utf8'});
   if(needles.some(n=>normalize(text).includes(n))) violations.push(`Git history: restricted content in ${file}`);
  }
 }
} catch(error) {if(!/not a git repository|Command failed: git rev-list/.test(String(error))) throw error;}
if(violations.length) {console.error([...new Set(violations)].join('\n'));process.exit(1);}
if(!needles.length) {console.error(`Basic scan passed (${checked} files). Full confidentiality check NOT run: provide PRIVATE_CONTENT_DENYLIST privately.`);process.exit(2);}
console.log(`PASS: ${checked} source/build files plus PDF text and metadata; private denylist checked without logging its values. ${history}`);
