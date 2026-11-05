const cacheKey = 'al-project-stars-v1';
const lifetime = 60 * 60 * 1000;

export async function fetchStars(repositories) {
  const remaining = new Set(repositories);
  const counts = {};
  for (let page = 1; remaining.size; page++) {
    const url = new URL('https://api.github.com/users/al8n/repos');
    url.search = new URLSearchParams({ type: 'owner', sort: 'full_name', per_page: '100', page: String(page) });
    const response = await fetch(url, { credentials: 'omit', signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error('GitHub stars unavailable');
    const rows = await response.json();
    if (!Array.isArray(rows)) throw new Error('Invalid repository listing');
    for (const row of rows) {
      if (row.private !== false || !remaining.has(row.full_name)) continue;
      if (!Number.isSafeInteger(row.stargazers_count) || row.stargazers_count < 0) throw new Error('Invalid star count');
      counts[row.full_name] = row.stargazers_count;
      remaining.delete(row.full_name);
    }
    if (rows.length < 100) break;
  }
  return { checkedAt: Date.now(), counts };
}

function readCache() {
  try {
    const snapshot = JSON.parse(localStorage.getItem(cacheKey));
    if (Number.isSafeInteger(snapshot?.checkedAt) && snapshot.checkedAt <= Date.now() &&
      snapshot.counts && typeof snapshot.counts === 'object' && !Array.isArray(snapshot.counts) && Object.values(snapshot.counts).every(n => Number.isSafeInteger(n) && n >= 0)) return snapshot;
  } catch { /* Storage may be blocked. */ }
  return null;
}

let pending;
export async function showStars() {
  const fields = [...document.querySelectorAll('[data-repo]')];
  if (!fields.length) return;
  const render = snapshot => {
    for (const field of fields) {
      const count = snapshot.counts[field.dataset.repo];
      field.querySelector('[data-star-total]').textContent = count == null ? '—' : count.toLocaleString('en-US');
      field.closest('article').dataset.stars = count ?? '';
      field.title = count == null ? 'Public star count unavailable' : 'GitHub stars · checked ' + new Date(snapshot.checkedAt).toLocaleString();
    }
    fields[0].closest('.project-collection')?.dispatchEvent(new Event('metrics-updated'));
  };
  const cached = readCache();
  if (cached) render(cached);
  if (cached && Date.now() - cached.checkedAt < lifetime) return;
  try {
    pending ||= fetchStars(fields.map(field => field.dataset.repo)).finally(() => { pending = null; });
    const snapshot = await pending;
    render(snapshot);
    try { localStorage.setItem(cacheKey, JSON.stringify(snapshot)); } catch { /* Optional. */ }
  } catch { /* Keep the dated cache or the published snapshot when GitHub is unavailable. */ }
}
