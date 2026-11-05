import test from 'node:test';
import assert from 'node:assert/strict';
import { projects, categories, featured } from '../src/data/projects.ts';
import { profile } from '../src/data/profile.ts';
import { experience } from '../src/data/experience.ts';
import { renderDocument, escape } from '../src/components/render.ts';
test('public project collection has unique identities and valid category membership', () => {
  assert.equal(projects.length,16);
  assert.equal(new Set(projects.map(p=>p.name)).size,16);
  assert.equal(featured.length,6);
  for(const p of projects) {
    assert.ok(categories.some(c=>c.id===p.category));
    assert.ok(new URL(p.github).pathname.startsWith('/al8n/'));
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
