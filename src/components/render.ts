import { accountSummary } from './account-summary.ts';
import metrics from '../data/project-metrics.json' with { type: 'json' };
import { groupProjects } from '../../public/project-order.js';
import { profile, skills, expertise } from '../data/profile.ts';
import { experience } from '../data/experience.ts';
import { projects, categories, type Project } from '../data/projects.ts';

export type Route = '/' | '/projects/' | '/cv/' | '/404.html';
const entities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const escape = (value: string) => value.replace(/[&<>"']/g, char => entities[char]!);
const arrow = '<span aria-hidden="true">↗</span>';
const link = (href: string, label: string, cls = '') => `<a class="${cls}" href="${escape(href)}">${escape(label)} ${arrow}</a>`;
const tags = (items: string[]) => `<ul class="tags" aria-label="Technical concepts">${items.map(item => `<li>${escape(item)}</li>`).join('')}</ul>`;
const projectTitle = (project: Project) => project.github ? link(project.github, project.name) : escape(project.name);
export const pageMeta = {
  '/': { title: `${profile.name} — ${profile.title}`, description: 'Personal engineering portfolio of Al Liu, focusing on Rust, distributed systems, networking, storage engines, and open-source infrastructure.' },
  '/projects/': { title: 'Open-source projects — Al Liu', description: 'Explore Al Liu’s Rust infrastructure libraries for parsing, distributed systems, networking, file I/O, codecs, caches, and data structures.' },
  '/cv/': { title: 'Curriculum vitae — Al Liu', description: 'Public CV of Al Liu: Rust systems engineering, professional experience, open-source infrastructure, and education.' },
  '/404.html': { title: 'Page not found — Al Liu', description: 'This page could not be found. Explore Al Liu’s engineering portfolio.' },
};

export function renderHead(route: Route) {
  const meta = pageMeta[route];
  const person = { '@context': 'https://schema.org', '@type': 'Person', name: profile.name, url: profile.site, jobTitle: profile.title, email: `mailto:${profile.email}`, sameAs: [profile.github, profile.linkedin, profile.crates], alumniOf: { '@type': 'CollegeOrUniversity', name: profile.education.school }, knowsAbout: ['Rust', 'Distributed systems', 'Networking', 'Storage engines'] };
  return `<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark">
<title>${escape(meta.title)}</title><meta name="description" content="${escape(meta.description)}">
${route === '/404.html' ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${profile.site}${route}">`}
<meta property="og:type" content="website"><meta property="og:site_name" content="Al Liu"><meta property="og:title" content="${escape(meta.title)}"><meta property="og:description" content="${escape(meta.description)}"><meta property="og:url" content="${profile.site}${route}"><meta property="og:image" content="${profile.site}/social-preview.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Al Liu — Rust Systems Engineer and Open-Source Maintainer"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image:alt" content="Al Liu — Rust Systems Engineer and Open-Source Maintainer">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/styles.css"><script src="/theme-init.js"></script><script type="module" src="/site.js"></script>${route === '/projects/' ? '<script type="module" src="/projects.js"></script>' : ''}${route === '/projects/' || route === '/' ? '<script type="module" src="/downloads.js"></script><script type="module" src="/stars.js"></script>' : ''}<script type="application/ld+json">${JSON.stringify(person).replaceAll('<', '\\u003c')}</script>`;
}

export function renderHeader(route: Route) {
  return `<a class="skip-link" href="#main">Skip to content</a><header class="site-header container"><a class="wordmark" href="/" aria-label="Al Liu, home">al<span>.</span></a><nav aria-label="Main navigation"><a href="/" ${route === '/' ? 'aria-current="page"' : ''}>Overview</a><a href="/projects/" ${route === '/projects/' ? 'aria-current="page"' : ''}>Projects</a><a href="/cv/" ${route === '/cv/' ? 'aria-current="page"' : ''}>CV</a><span class="nav-divider" aria-hidden="true"></span><button class="theme-toggle" id="theme-toggle" hidden aria-label="Theme: system. Switch to light theme" title="Theme: system. Switch to light theme"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" stroke="none"/></svg><span id="theme-label">System</span></button></nav></header>`;
}

export function renderFooter() {
  return `<footer class="site-footer container"><div><a class="footer-name" href="/">Al Liu<span class="accent">.</span></a><p>Thoughtful systems. Open source.</p></div><div class="footer-links">${link(profile.github, 'GitHub')}${link(profile.linkedin, 'LinkedIn')}${link(profile.crates, 'Crates.io')}${link(`mailto:${profile.email}`, 'Email')}</div><span class="copyright">© ${new Date().getUTCFullYear()} Al Liu</span></footer>`;
}

function networkDrawing() {
  return `<svg class="project-drawing network-drawing" viewBox="0 0 440 180" role="img" aria-label="Peer nodes connected in a decentralized membership network"><g stroke="currentColor" stroke-width="1" fill="none" opacity=".35"><path d="m78 95 90-54 105 34 83-27M78 95l97 55 98-75 91 65M168 41l7 109m98-75 83-27 8 92M78 95l195-20m-98 75 189-10"/><circle cx="78" cy="95" r="23"/><circle cx="168" cy="41" r="16"/><circle cx="175" cy="150" r="16"/><circle cx="273" cy="75" r="29"/><circle cx="356" cy="48" r="14"/><circle cx="364" cy="140" r="20"/></g><g fill="currentColor"><circle cx="78" cy="95" r="4"/><circle cx="168" cy="41" r="3"/><circle cx="175" cy="150" r="3"/><circle cx="273" cy="75" r="5"/><circle cx="356" cy="48" r="3"/><circle cx="364" cy="140" r="3"/></g><g font-family="monospace" font-size="9" fill="currentColor" opacity=".8"><text x="55" y="135">PEER 01</text><text x="248" y="122">PEER 04</text><text x="132" y="15">MEMBERSHIP</text></g></svg>`;
}
function parsingDrawing(execution = false) {
  return `<svg class="project-drawing parsing-drawing" viewBox="0 0 440 180" role="img" aria-label="${execution ? 'GraphQL source, syntax tree, and execution core' : 'Source text, on-demand tokens, and a syntax tree'}"><g fill="none" stroke="currentColor" stroke-width="1" opacity=".4"><rect x="24" y="48" width="102" height="80" rx="4"/><path d="M41 69h43m-43 14h66M41 97h34m-34 14h57M140 88h47m-7-6 7 6-7 6M205 64h43v48h-43zM226 112v25m0-25 44 25m-44-25-44 25M284 88h39m-7-6 7 6-7 6"/><rect x="341" y="60" width="70" height="56" rx="4"/></g><g fill="currentColor"><circle cx="182" cy="137" r="4"/><circle cx="226" cy="137" r="4"/><circle cx="270" cy="137" r="4"/></g><g font-family="monospace" font-size="9" fill="currentColor" opacity=".8"><text x="40" y="153">SOURCE TEXT</text><text x="207" y="91">${execution ? 'AST' : 'LEX'}</text><text x="351" y="92">${execution ? 'EXECUTE' : 'PARSE'}</text><text x="180" y="28">${execution ? 'GRAPHQL / SANS-I/O' : 'LEX ONLY AS NEEDED'}</text></g></svg>`;
}
function experienceEntry(entry: typeof experience[number], full = false) {
  if (!full) return `<article class="experience-entry"><div class="experience-date mono">${escape(entry.start)} — ${escape(entry.end)}</div><div class="experience-copy"><h3>${escape(entry.role)}</h3><p class="company">${escape(entry.company)}</p></div></article>`;
  return `<article class="experience-entry cv-experience-entry"><header class="experience-heading"><div class="experience-identity"><h3>${escape(entry.role)}</h3><p class="company">${escape(entry.company)}</p></div><div class="experience-meta"><p class="experience-date mono">${escape(entry.start)} — ${escape(entry.end)}</p><p class="arrangement">${escape(entry.arrangement)}</p></div></header><div class="experience-copy"><p class="experience-overview">${escape(entry.overview)}</p>${tags(entry.scope)}<ul class="experience-bullets">${entry.bullets.map(b => `<li>${escape(b)}</li>`).join('')}</ul></div></article>`;
}
function contactBlock() {
  return `<section class="contact-section" aria-labelledby="contact-title"><span class="eyebrow">LET’S TALK SYSTEMS</span><h2 id="contact-title">Good work starts<br>with a conversation<span class="accent">.</span></h2><div><p>Infrastructure, Rust, or an interesting engineering problem.</p>${link(`mailto:${profile.email}`, profile.email, 'contact-email')}</div></section>`;
}

export function homeContent() {
  return `<section class="hero" aria-labelledby="hero-title"><div class="hero-main"><p class="eyebrow"><span class="small-cross" aria-hidden="true">✳</span> ENGINEERING IN THE OPEN</p><h1 id="hero-title">Al Liu<span class="accent">.</span></h1><p class="hero-title">Rust Systems Engineer<br><span class="muted">& Open-Source Maintainer</span></p><p class="hero-intro">${escape(profile.introduction)}</p><div class="hero-actions"><a class="button button-primary" href="/projects/">Explore my work <span aria-hidden="true">↗</span></a><a class="text-link" href="/cv/">View CV <span aria-hidden="true">→</span></a></div><div class="hero-socials">${link(profile.github, 'GitHub')}${link(profile.linkedin, 'LinkedIn')}${link(profile.crates, 'Crates.io')}${link('/resume.pdf', 'Download résumé')}${link(`mailto:${profile.email}`, 'Email')}</div></div><aside class="hero-aside" aria-label="Engineering focus"><div class="aside-heading mono">THE BUILDING BLOCKS</div><div class="focus-item"><span class="mono">01</span><div><strong>Languages & parsing</strong><p>From text to execution.</p></div><span aria-hidden="true">↗</span></div><div class="focus-item"><span class="mono">02</span><div><strong>Networking</strong><p>Protocols that connect.</p></div><span aria-hidden="true">↗</span></div><div class="focus-item"><span class="mono">03</span><div><strong>Distributed systems</strong><p>Coordination without a center.</p></div><span aria-hidden="true">↗</span></div><div class="focus-item"><span class="mono">04</span><div><strong>Storage & concurrency</strong><p>Data, memory, and correctness.</p></div><span aria-hidden="true">↗</span></div><div class="aside-footnote"><span class="mono">BUILT WITH RUST.</span><p>Made to be understood.<br>Designed to be reused.</p></div></aside></section>
${accountSummary()}<section class="approach section" aria-labelledby="approach-title"><div><p class="eyebrow">01 / ENGINEERING FOCUS</p><h2 id="approach-title">Close to the details.<br>Clear on the bigger picture.</h2></div><div class="approach-list"><article><span class="mono">I.</span><div><h3>Production Rust</h3><p>Performance-sensitive services, asynchronous networking, concurrent pipelines, and the work of keeping systems reliable.</p></div></article><article><span class="mono">II.</span><div><h3>Protocols & primitives</h3><p>From SWIM gossip to memory-mapped I/O. Reusable libraries with explicit boundaries and carefully considered tradeoffs.</p></div></article><article><span class="mono">III.</span><div><h3>Open by design</h3><p>Source code you can read, use, and build on. Public projects are the clearest picture of how I think about engineering.</p></div></article></div></section>
<section class="experience section" aria-labelledby="experience-title"><div class="section-heading"><div><p class="eyebrow">02 / EXPERIENCE</p><h2 id="experience-title">From protocols<br>to production.</h2></div><a class="text-link" href="/cv/">Full experience & education <span aria-hidden="true">→</span></a></div><div class="experience-list">${experience.map(e => experienceEntry(e)).join('')}</div></section>${contactBlock()}`;
}

const counts: Record<string, { downloads: number | null; stars: number | null }> = metrics.counts;
const publishedDate = metrics.checkedAt.slice(0, 10);
const metricText = (value: number | null | undefined) => value == null ? '—' : value.toLocaleString('en-US');

function projectMetrics(project: Project) {
  if (!project.github) return '<p class="source-unavailable">Source not public</p>';
  const crate = project.crate || project.name;
  const repo = new URL(project.github).pathname.slice(1);
  const stats = counts[project.name];
  return `<div class="project-downloads" data-crate="${escape(crate)}">
    <div class="metric-pair">
      <a href="https://crates.io/crates/${escape(crate)}"><span>Total downloads</span><strong data-download-total>${metricText(stats?.downloads)}</strong></a>
      <a data-repo="${escape(repo)}" href="${escape(project.github)}/stargazers" title="GitHub stars as of ${publishedDate}"><span><i aria-hidden="true">☆</i> GitHub stars</span><strong data-star-total>${metricText(stats?.stars)}</strong></a>
    </div>
    <p data-download-updated>Downloads as of ${publishedDate}</p>
  </div>`;
}

function projectCard(project: Project) {
  const category = categories.find(c => c.id === project.category)!;
  const stats = counts[project.name];
  return `<article class="collection-card${project.spotlight ? ' collection-spotlight' : ''}" data-project="${escape(project.name)}" data-topic="${category.id}" data-downloads="${stats?.downloads ?? ''}" data-stars="${stats?.stars ?? ''}">
    <div class="card-identity"><p class="card-topic">${escape(category.name)}</p><div class="collection-title"><h3>${projectTitle(project)}</h3></div></div>
    ${project.spotlight ? `<div class="card-figure">${project.category === 'parsing' ? parsingDrawing(project.name === 'smear') : networkDrawing()}</div>` : ''}
    <p class="collection-description">${escape(project.detail)}</p>${tags(project.concepts)}
    ${project.provenance ? `<p class="provenance">${escape(project.provenance)}</p>` : ''}
    ${projectMetrics(project)}
  </article>`;
}

export function projectsContent() {
  const records = projects.map(p => ({
    name: p.name, category: p.category, featured: !!p.spotlight,
    downloads: counts[p.name]?.downloads, stars: counts[p.name]?.stars, project: p,
  }));
  const groups: { title: string; items: typeof records }[] = groupProjects(records, 'grid', 'recommended', categories);
  const filters = categories.map(c => `<button data-filter="${c.id}" data-label="${escape(c.name)}" aria-pressed="false">${escape(c.short)}</button>`).join('');
  const anchors = categories.map(c => `<span class="category-anchor" id="${c.id}"></span>`).join('');
  const noScriptFilters = categories.map(c => `#catalog:has(#${c.id}:target) .collection-card:not([data-topic="${c.id}"]),#catalog:has(#${c.id}:target) .project-category:not(:has([data-topic="${c.id}"])){display:none}`).join('');
  const section = (title: string, cards: string) => `<section class="project-category"><div class="catalog-heading"><h2>${escape(title)}</h2></div><div class="collection-grid">${cards}</div></section>`;
  return `<section class="catalog-hero"><div><p class="eyebrow">THE OPEN-SOURCE COLLECTION</p><h1>Project index<span class="accent">.</span></h1></div><div class="catalog-intro"><p>${projects.length} projects across ${categories.length} categories, from language tooling to distributed systems.</p><div class="page-hero-links">${link(profile.github, 'GitHub profile')}${link(profile.crates, 'Published crates')}</div></div></section>
    ${accountSummary()}<div class="catalog" id="catalog">${anchors}
      <noscript><style>${noScriptFilters}</style><nav class="category-nav" aria-label="Project categories"><a href="#catalog">All projects</a>${categories.map(c => `<a href="#${c.id}">${escape(c.short)}</a>`).join('')}</nav></noscript>
      <div class="catalog-controls" hidden>
        <div class="project-filters" role="group" aria-label="Filter projects"><button data-filter="all" aria-pressed="true">All projects</button>${filters}</div>
        <div class="catalog-options">
          <p class="results-count mono" role="status" id="results-count">${projects.length} PROJECTS</p>
          <div class="sort-control"><label for="project-sort">Sort</label><select id="project-sort"><option value="recommended">Recommended</option><option value="downloads">Total downloads</option><option value="stars">GitHub stars</option><option value="name">Name A–Z</option></select></div>
          <div class="view-switch" role="group" aria-label="Project layout"><button data-view="grid" aria-pressed="true">Grid</button><button data-view="list" aria-pressed="false">List</button><button data-view="categories" aria-pressed="false">Categories</button></div>
        </div>
      </div>
      <div class="project-collection" data-layout="grid">${groups.map(group => section(group.title, group.items.map(item => projectCard(item.project)).join(''))).join('')}</div>
    </div>
    <div class="project-endnote"><p>Downloads cover each project’s primary crate across all versions. Stars come from the public GitHub repository.</p><a class="text-link" href="/cv/">View CV <span aria-hidden="true">→</span></a></div>${contactBlock()}`;
}

export function cvContent() {
  return `<section class="cv-top page-hero"><div><p class="eyebrow">CURRICULUM VITAE</p><h1>Al Liu<span class="accent">.</span></h1><p class="cv-subtitle">${escape(profile.title)}</p></div><div class="cv-actions"><a class="button button-primary" href="/resume.pdf" download="Al_Liu_Public_Resume.pdf">Download résumé <span class="mono">PDF ↓</span></a><button class="text-link print-button" id="print-cv" hidden>Print this page <span aria-hidden="true">↗</span></button></div></section><div class="cv-layout"><nav class="cv-nav" aria-label="CV sections"><a href="#profile">Profile</a><a href="#expertise">Expertise</a><a href="#experience">Experience</a><a href="#open-source">Open source</a><a href="#education">Education</a><a href="#contact">Contact</a></nav><div class="cv-content"><section class="cv-section" id="profile"><p class="eyebrow">01 / PROFILE</p><h2>Engineering at the systems level.</h2><p class="cv-summary">${escape(profile.summary)}</p><p class="cv-context">My professional work and open-source maintenance share the same focus: dependable infrastructure with clear interfaces and explicit tradeoffs.</p></section><section class="cv-section" id="expertise"><p class="eyebrow">02 / TECHNICAL EXPERTISE</p><h2>The tools & the thinking.</h2><p class="skills-note">Professional and open-source experience across these areas; project links below show the public work.</p><div class="expertise-grid">${expertise.map(item => `<article><h3>${escape(item.name)}</h3><p>${escape(item.detail)}</p></article>`).join('')}</div><dl class="skills-list">${skills.map(s => `<div><dt>${escape(s.name)}</dt><dd>${s.items.map(escape).join(' · ')}</dd></div>`).join('')}</dl></section><section class="cv-section" id="experience"><p class="eyebrow">03 / PROFESSIONAL EXPERIENCE</p><h2>Work in practice.</h2><p class="cv-context">Roles include full-time, contract, and part-time remote work. Overlapping dates reflect the actual engagements.</p><div class="experience-list">${experience.map(e => experienceEntry(e, true)).join('')}</div></section><section class="cv-section" id="open-source"><p class="eyebrow">04 / SELECTED OPEN SOURCE</p><h2>Infrastructure, maintained in the open.</h2>${profile.publicWork.map(paragraph => `<p class="cv-context">${escape(paragraph)}</p>`).join('')}<a class="text-link cv-project-link" href="/projects/">Explore all ${projects.length} projects across ${categories.length} categories <span aria-hidden="true">→</span></a></section><section class="cv-section" id="education"><p class="eyebrow">05 / EDUCATION</p><h2>${escape(profile.education.school)}</h2><p class="degree">${escape(profile.education.degree)}</p><p class="mono muted">${profile.education.dates} · ${profile.education.graduation}</p><p class="cv-context">${escape(profile.education.context)}</p><div class="education-award"><h3>Scholarship</h3><p>${escape(profile.education.award)}</p></div></section><section class="cv-section cv-contact" id="contact"><p class="eyebrow">06 / CONTACT & LINKS</p><h2>Let’s stay in touch.</h2><p>${link(`mailto:${profile.email}`, profile.email)}</p><div class="cv-contact-links">${link(profile.github, 'GitHub')}${link(profile.linkedin, 'LinkedIn')}${link(profile.crates, 'Crates.io')}</div></section></div></div>`;
}
export function notFoundContent() {
  return `<section class="not-found"><p class="eyebrow">404 / A MISSING PIECE</p><h1>This path<br>ends here<span class="accent">.</span></h1><p>The page may have moved, or the address may be incomplete.<br>There’s plenty more to explore.</p><div class="hero-actions"><a class="button button-primary" href="/">Back to overview <span aria-hidden="true">→</span></a><a class="text-link" href="/projects/">Explore projects</a></div></section>`;
}
export function renderContent(route: Route) { return route === '/' ? homeContent() : route === '/projects/' ? projectsContent() : route === '/cv/' ? cvContent() : notFoundContent(); }
export function renderDocument(route: Route) { return `<!DOCTYPE html><html lang="en"><head>${renderHead(route)}</head><body class="${route === '/cv/' ? 'cv-page' : ''}">${renderHeader(route)}<main class="container" id="main" tabindex="-1">${renderContent(route)}</main>${renderFooter()}</body></html>`; }
