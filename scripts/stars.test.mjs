import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchStars } from '../public/stars.js';

const repository = (name, stars) => ({
  full_name: 'al8n/' + name, private: false, stargazers_count: stars,
});

test('account stars include every public repository across pages, including unlisted projects and zero counts', async t => {
  const pages = [];
  t.mock.method(globalThis, 'fetch', async url => {
    const page = Number(url.searchParams.get('page'));
    pages.push(page);
    return { ok: true, json: async () => page === 1
      ? Array.from({ length: 100 }, (_, index) => repository('repo-' + index, index))
      : [repository('account-only-project', 200)] };
  });
  const snapshot = await fetchStars();
  assert.deepEqual(pages, [1, 2]);
  assert.equal(snapshot.complete, true);
  assert.equal(Object.keys(snapshot.counts).length, 101);
  assert.equal(snapshot.counts['al8n/repo-0'], 0);
  assert.equal(Object.values(snapshot.counts).reduce((sum, value) => sum + value, 0), 5150);
});

test('a failed later page never returns a partial account total', async t => {
  t.mock.method(globalThis, 'fetch', async url => ({
    ok: url.searchParams.get('page') === '1',
    json: async () => Array.from({ length: 100 }, (_, index) => repository('repo-' + index, 1)),
  }));
  await assert.rejects(fetchStars(), /unavailable/);
});

test('private or foreign repositories are excluded and malformed public counts rejected', async t => {
  t.mock.method(globalThis, 'fetch', async () => ({
    ok: true, json: async () => [
      repository('public', 2), { ...repository('private', 1000), private: true },
      { full_name: 'someone/else', private: false, stargazers_count: 1000 },
    ],
  }));
  assert.deepEqual((await fetchStars()).counts, { 'al8n/public': 2 });
  globalThis.fetch = async () => ({ ok: true, json: async () => [repository('bad', -1)] });
  await assert.rejects(fetchStars(), /Invalid star count/);
});
