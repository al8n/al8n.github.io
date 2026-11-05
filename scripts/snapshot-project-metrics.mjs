// Refresh the public, first-render fallback from the same APIs the cards use in the browser.
import { writeFile } from 'node:fs/promises';
import { projects } from '../src/data/projects.ts';
import { fetchStars } from '../public/stars.js';
import { fetchCrateStats } from '../public/downloads.js';

const published = projects.filter(project => project.github);
const repository = project => new URL(project.github).pathname.slice(1);
const [github, crates] = await Promise.all([
  fetchStars(published.map(repository)),
  fetchCrateStats('al8n-portfolio/1.0 (https://al8n.github.io)'),
]);
const counts = Object.fromEntries(published.map(project => [project.name, {
  downloads: crates.stats[project.crate || project.name]?.total ?? null,
  stars: github.counts[repository(project)] ?? null,
}]));
const snapshot = { checkedAt: new Date().toISOString(), counts };
await writeFile(new URL('../src/data/project-metrics.json', import.meta.url), JSON.stringify(snapshot, null, 2) + '\n');
console.log('Saved public metric totals for', published.length, 'projects.');
