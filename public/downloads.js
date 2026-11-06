const cacheKey = 'al-crate-downloads-v1';
const cacheLifetime = 10 * 60 * 1000;
const userId = 119762; // Public crates.io account: al8n.

export function parseCrateStats(crates) {
  if (!Array.isArray(crates)) throw new Error('Invalid crates.io response');
  return Object.fromEntries(crates.map(crate => {
    if (typeof crate?.id !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(crate.id) || !Number.isSafeInteger(crate.downloads) || crate.downloads < 0) {
      throw new Error('Invalid crates.io download counts');
    }
    return [crate.id, { total: crate.downloads }];
  }));
}

export async function fetchCrateStats(userAgent) {
  const stats = Object.create(null);
  let pages = 1;
  let crateCount = 0;
  for (let page = 1; page <= pages; page++) {
    // One account listing instead of one request per card; respect the API's 1 request/second limit.
    if (page > 1) await new Promise(resolve => setTimeout(resolve, 1100));
    const response = await fetch(`https://crates.io/api/v1/crates?user_id=${userId}&per_page=100&page=${page}`, {
      headers: userAgent ? { 'User-Agent': userAgent } : undefined,
      credentials: 'omit', referrerPolicy: 'strict-origin-when-cross-origin', signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) throw new Error('Crates.io statistics unavailable');
    const data = await response.json();
    if (!Number.isSafeInteger(data.meta?.total) || data.meta.total < 0) throw new Error('Invalid crates.io pagination');
    if (page === 1) {
      crateCount = data.meta.total;
      pages = Math.ceil(crateCount / 100);
    }
    Object.assign(stats, parseCrateStats(data.crates));
  }
  if (Object.keys(stats).length !== crateCount) throw new Error('Incomplete crates.io account listing');
  return { checkedAt: Date.now(), stats, crateCount };
}

export function readCachedStats(storage, now = Date.now()) {
  try {
    const cached = JSON.parse(storage.getItem(cacheKey));
    if (!cached || !Number.isSafeInteger(cached.checkedAt) || cached.checkedAt > now || !cached.stats) return null;
    const stats = parseCrateStats(Object.entries(cached.stats).map(([id, value]) => ({
      id, downloads: value?.total,
    })));
    return { checkedAt: cached.checkedAt, stats, crateCount: cached.crateCount === Object.keys(stats).length ? cached.crateCount : undefined, fresh: now - cached.checkedAt < cacheLifetime };
  } catch { return null; }
}

let pendingStats;
async function showDownloads() {
  const cards = [...document.querySelectorAll('[data-crate]')];
  const totals = [...document.querySelectorAll('[data-account-downloads]')];
  if (!cards.length && !totals.length) return;
  let storage;
  try { storage = localStorage; } catch { /* Statistics still work without browser storage. */ }
  const cached = storage ? readCachedStats(storage) : null;
  const numbers = new Intl.NumberFormat('en-US');
  const dates = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  function render(snapshot, stale = false) {
    for (const card of cards) {
      const stats = snapshot.stats[card.dataset.crate];
      card.dataset.downloadsState = stats ? (stale ? 'cached' : 'ready') : 'unavailable';
      card.closest('article').dataset.downloads = stats?.total ?? '';
      card.querySelector('[data-download-total]').textContent = stats ? numbers.format(stats.total) : '—';
      const updated = card.querySelector('[data-download-updated]');
      updated.textContent = stats ? `${stale ? 'Cached · ' : ''}Checked ${dates.format(snapshot.checkedAt)}` : 'Stats unavailable · view on crates.io ↗';
      updated.title = stats ? `Primary crate only: ${card.dataset.crate}. Fetched ${new Date(snapshot.checkedAt).toISOString()}. Cached for up to 10 minutes. Crates.io statistics are processed in batches.` : 'A missing response is not a zero download count.';
    }
    if (snapshot.crateCount === Object.keys(snapshot.stats).length) {
      for (const total of totals) {
        total.textContent = numbers.format(Object.values(snapshot.stats).reduce((sum, crate) => sum + crate.total, 0));
        const box = total.closest('[data-account-metric]');
        box.querySelector('[data-metric-scope]').textContent = snapshot.crateCount + ' owned crates · all versions';
        box.querySelector('[data-metric-date]').textContent = (stale ? 'Cached · ' : '') + 'Checked ' + new Date(snapshot.checkedAt).toLocaleDateString('en-CA');
      }
    }
    cards[0]?.closest('.project-collection')?.dispatchEvent(new Event('metrics-updated'));
  }
  if (cached) render(cached, !cached.fresh);
  if (cached?.fresh && (!totals.length || cached.crateCount !== undefined)) return;
  
  try {
    pendingStats ||= fetchCrateStats().finally(() => { pendingStats = null; });
    const snapshot = await pendingStats;
    render(snapshot);
    try { storage?.setItem(cacheKey, JSON.stringify(snapshot)); } catch { /* Storage is optional. */ }
  } catch {
    if (cached) {
      render(cached, true);
      for (const card of cards) card.querySelector('[data-download-updated]').textContent += ' · refresh unavailable';
    } else {
      for (const card of cards) {
        if (card.closest('article').dataset.downloads !== '') {
          card.dataset.downloadsState = 'snapshot';
        } else {
          card.dataset.downloadsState = 'unavailable';
          card.querySelector('[data-download-updated]').textContent = 'Stats unavailable · view on crates.io ↗';
        }
      }
    }
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('astro:page-load', showDownloads);
  void showDownloads();
}
