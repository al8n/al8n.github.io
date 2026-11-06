import account from '../data/account-metrics.json' with { type: 'json' };

export function accountSummary() {
  const format = (value: number) => value.toLocaleString('en-US');
  const date = account.checkedAt.slice(0, 10);
  return `<section class="account-summary" aria-label="Open-source totals">
    <a class="account-stat" data-account-metric href="https://github.com/al8n?tab=repositories">
      <span class="metric-label">GitHub total stars <span aria-hidden="true">↗</span></span>
      <strong data-account-stars>${format(account.stars)}</strong>
      <span data-metric-scope>${account.repositories} public repositories</span>
      <small data-metric-date>Checked ${date}</small>
    </a>
    <a class="account-stat" data-account-metric href="https://crates.io/users/al8n">
      <span class="metric-label">crates.io total downloads <span aria-hidden="true">↗</span></span>
      <strong data-account-downloads>${format(account.downloads)}</strong>
      <span data-metric-scope>${account.crates} owned crates · all versions</span>
      <small data-metric-date>Checked ${date}</small>
    </a>
  </section>`;
}
