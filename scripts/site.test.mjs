import test from 'node:test';
import assert from 'node:assert/strict';
import { projects, categories, featured, spotlight } from '../src/data/projects.ts';
import { profile } from '../src/data/profile.ts';
import { experience } from '../src/data/experience.ts';
import { renderDocument, escape } from '../src/components/render.ts';
test('public project collection has unique identities and valid category membership', () => {
  assert.equal(projects.length,31);
  assert.equal(new Set(projects.map(p=>p.name)).size,31);
  assert.equal(featured.length,6);
  for(const p of projects) {
    assert.ok(categories.some(c=>c.id===p.category));
    if (p.github) assert.ok(new URL(p.github).pathname.startsWith('/al8n/'));
    else assert.equal(p.name,'pql');
  }
});
test('public role identity and overlapping dates are preserved', () => {
  assert.equal(experience[0].company,'Confidential Financial Technology Company');
  assert.equal(experience[0].start,'Jan 2026');
  assert.equal(experience.find(e=>e.company==='Status').start,'Nov 2022');
  assert.equal(experience.find(e=>e.company==='Polar Sync').end,'Sep 2023');
});
test('generated content is escaped, and SEO never uses employment data', () => {
  assert.equal(escape('<script>"&'), '&lt;script&gt;&quot;&amp;');
  for(const route of ['/', '/projects/', '/cv/', '/404.html']) {
    const html = renderDocument(route);
    const ld=JSON.parse(html.match(/application\/ld\+json">(.*?)<\/script>/s)[1]);
    assert.equal(ld.name,profile.name);
    assert.ok(!('worksFor' in ld));
    assert.ok(!html.includes('77 million'));
  }
});

test('Discord categories retain their projects and each project has its own card', () => {
  const expected = {
    cache: ['stretto','caches-rs'], codec: ['buffo','varing'], 'file-io': ['fs4','fmmap','memmapix'],
    'data-structures': ['emailaddr','hostaddr','iradix','smol-bytes','skl'],
    parsing: ['tokora','smear','memspan','cronp','pql'], 'distributed-systems': ['memberlist','serf'],
    async: ['agnostic'], networking: ['hick','hardware-address','iprfc','iprobe','getifs','peekable'],
    utilities: ['among','atomic-time','wg','whichdisk'], storage: ['skipdb'],
  };
  assert.deepEqual(categories.map(c=>c.id),Object.keys(expected));
  const html=renderDocument('/projects/');
  assert.equal((html.match(/class="collection-card/g)||[]).length,projects.length);
  for(const [category,names] of Object.entries(expected)) assert.deepEqual(projects.filter(p=>p.category===category).map(p=>p.name),names);
  const privateCard=html.match(/<article[^>]*data-project="pql".*?<\/article>/s)[0];
  assert.ok(privateCard.includes('Source not public'));
  assert.ok(!privateCard.includes('href='));
  assert.equal(projects.find(p=>p.name==='pql').github,undefined);
});
test('homepage gives the four priority projects independent spotlight cards', () => {
  assert.deepEqual(spotlight.map(p=>p.name),['tokora','smear','memberlist','serf']);
  const html=renderDocument('/');
  assert.deepEqual([...html.matchAll(/class="featured-card[^>]*data-project="([^"]+)"/g)].map(m=>m[1]),spotlight.map(p=>p.name));
  assert.ok(!html.includes('class="project-row"'));
});
