import { projects } from '../src/data/projects.ts';
const urls=[...new Set(projects.flatMap(p=>[...(p.github?[p.github]:[]),...(p.crate?[`https://crates.io/crates/${p.crate}`]:[])]))];
let failed=0;
// Sequential requests avoid overwhelming public services. Network failures remain unverified.
for(const url of urls) {
 try {
  const r=await fetch(url,{headers:{'User-Agent':'al8n-public-portfolio-link-check'},signal:AbortSignal.timeout(12000)});
  if(!r.ok) {failed++;console.error(`${r.status} ${url}`);} else console.log(`OK ${url}`);
 } catch {failed++;console.error(`UNVERIFIED ${url}`);}
}
if(failed) {console.error(`${failed} links require a network-enabled recheck.`);process.exit(1);}
