import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { profile, skills } from '../src/data/profile.ts';
import { experience } from '../src/data/experience.ts';
import { projects } from '../src/data/projects.ts';
const pages = ['index.html', 'projects/index.html', 'cv/index.html', '404.html'];
let checked = 0;
for (const page of pages) {
  const html = await readFile(`dist/${page}`, 'utf8');
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${page}: exactly one h1`);
  for (const expected of ['<title>', 'name="description"', 'lang="en"', 'id="main"', 'Skip to content', 'og:image:alt']) assert.ok(html.includes(expected), `${page}: missing ${expected}`);
  assert.ok(!/TODO|PLACEHOLDER|lorem ipsum/i.test(html), `${page}: unfinished content`);
  if (page !== '404.html') assert.ok(html.includes('rel="canonical"'));
  for (const match of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)) {
    const url = match[1];
    if (!url.startsWith('/')) continue;
    const path = resolve('dist', '.' + (url.endsWith('/') ? url + 'index.html' : url));
    await access(path).catch(() => { throw Error(`${page}: broken internal link ${url}`); });
    checked++;
  }
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size, ids.length, `${page}: duplicate IDs`);
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), `${page}: missing anchor ${match[1]}`);
  for (const block of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) JSON.parse(block[1]);
}
const all = await readFile('dist/projects/index.html','utf8');
for (const project of projects) {
  assert.ok(all.includes(`data-project="${project.name}"`), `Missing project card ${project.name}`);
  if (project.github) assert.ok(all.includes(`href="${project.github}"`), `Missing source ${project.name}`);
}
const expectedHash=createHash('sha256').update(JSON.stringify({profile,skills,experience},null,2)).digest('hex');
assert.equal((await readFile('dist/resume-data.sha256','utf8')).trim(),expectedHash,'Resume data changed: run npm run resume before building.');
const pdf = await readFile('dist/resume.pdf');
assert.ok(pdf.subarray(0,5).toString() === '%PDF-');
const og = await readFile('dist/social-preview.png');
assert.ok(og.readUInt32BE(16)===1200 && og.readUInt32BE(20)===630,'Social image dimensions');
await access('dist/.nojekyll');
console.log(`PASS: 4 pages, ${projects.length} projects, ${checked} internal references, anchors, JSON-LD, PDF, and social preview.`);
