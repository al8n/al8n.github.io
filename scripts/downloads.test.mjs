import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCrateStats, readCachedStats, fetchCrateStats } from '../public/downloads.js';

test('download counts preserve zero and reject malformed data instead of inventing totals', () => {
  assert.deepEqual(parseCrateStats([{id:'tokora',downloads:0}]),{tokora:{total:0}});
  for (const crate of [{downloads:1,recent_downloads:1},{id:'x',downloads:-1,recent_downloads:1},{id:'x',downloads:'1'}]) {
    assert.throws(()=>parseCrateStats([crate]));
  }
});

test('fresh cache is distinguished from stale, corrupt, future-dated, and blocked storage', () => {
  const now=1800000000000;
  const storage = value=>({getItem:()=>JSON.stringify(value)});
  const snapshot = {checkedAt:now-1000,stats:{tokora:{total:42,recent:12}}};
  assert.equal(readCachedStats(storage(snapshot),now).fresh,true);
  assert.equal(readCachedStats(storage({...snapshot,checkedAt:now-600001}),now).fresh,false);
  assert.equal(readCachedStats(storage({...snapshot,checkedAt:now+1}),now),null);
  assert.equal(readCachedStats(storage({...snapshot,stats:{tokora:{total:'bad',recent:0}}}),now),null);
  assert.equal(readCachedStats({getItem:()=>{throw Error('blocked');}},now),null);
});

test('account API pagination is serial and paced, and a failed page never becomes a partial snapshot', async t => {
  const times=[];
  t.mock.method(globalThis,'fetch',async url=>{
    times.push(Date.now());
    const page=Number(new URL(url).searchParams.get('page'));
    assert.equal(new URL(url).searchParams.get('user_id'),'119762');
    return {ok:true,json:async()=>({meta:{total:101},crates:[{id:page===1?'tokora':'smear',downloads:page,recent_downloads:page}]})};
  });
  const snapshot=await fetchCrateStats();
  assert.equal(snapshot.stats.smear.total,2);
  assert.equal(snapshot.stats.tokora.total,1);
  assert.ok(times[1]-times[0]>=1000);
  globalThis.fetch=async url=>({ok:new URL(url).searchParams.get('page')==='1',json:async()=>({meta:{total:101},crates:[]})});
  await assert.rejects(fetchCrateStats(),/unavailable/);
});
