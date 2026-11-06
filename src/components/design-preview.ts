import { profile } from '../data/profile.ts';
import { experience } from '../data/experience.ts';
import { escape, projectsContent, cvContent } from './render.ts';
import { accountSummary } from './account-summary.ts';

const designs = {
  studio: { letter: 'A', name: 'Studio', label: '极简蓝白', tagline: 'Rust systems.\nClear by design.', description: '大留白、蓝色点缀、清晰的产品界面。', role: 'Rust systems engineer & open-source maintainer' },
  terminal: { letter: 'B', name: 'Terminal', label: '暗色工程', tagline: 'At the core\nof the system.', description: '深色工作台、等宽字体、侧栏导航。', role: 'Rust / Distributed systems / Performance' },
  editorial: { letter: 'C', name: 'Editorial', label: '大字海报', tagline: 'Small details.\nLasting systems.', description: '大胆字体、暖色纸张、杂志式排版。', role: 'Systems engineer. Open-source maintainer.' },
};
type Design = keyof typeof designs;

function overview(style: Design) {
  const design = designs[style];
  const href = (page: string) => `/designs/${style}/${page}/`;
  const disciplines = [
    ['Languages & parsing', 'Lexers, parser combinators, GraphQL tooling.'],
    ['Networking & distributed systems', 'Gossip, membership, discovery, and transport.'],
    ['Storage & concurrency', 'Memory mapping, MVCC, caches, and atomic primitives.'],
  ];
  return `<section class="design-hero">
    <div class="hero-copy"><p class="kicker">${design.role}</p><h1>${design.tagline.split('\n').map(escape).join('<br>')}</h1><p class="bio">I’m Al Liu. ${escape(profile.introduction)}</p><div class="hero-cta"><a class="primary" href="${href('projects')}">Explore projects <span>↗</span></a><a href="${href('cv')}">Read my CV →</a></div></div>
    <aside class="system-note" aria-label="Engineering focus"><span class="note-caption">ENGINEERING FOCUS</span><div class="code-mark" aria-hidden="true">{ al }</div><h2>From protocol<br>to production.</h2><p>Explicit interfaces.<br>Predictable execution.<br>Reusable building blocks.</p><span class="note-foot">Rust · Sans-I/O · Concurrency</span></aside>
  </section>
  ${accountSummary()}
  <section class="disciplines"><div class="section-label"><h2>What I work on</h2><a href="${href('projects')}">Browse the collection ↗</a></div><div class="discipline-grid">${disciplines.map(([title, text]) => `<article><h3>${title}</h3><p>${text}</p></article>`).join('')}</div></section>
  <section class="preview-experience"><div class="section-label"><h2>Experience</h2><a href="${href('cv')}">Full CV ↗</a></div>${experience.map(entry => `<article><span>${escape(entry.start)} — ${escape(entry.end)}</span><h3>${escape(entry.role)}</h3><p>${escape(entry.company)}</p></article>`).join('')}</section>`;
}

export function designDocument(styleName: string, pageName: string) {
  const style = styleName as Design;
  const design = designs[style];
  const page = pageName === 'projects' || pageName === 'cv' ? pageName : 'overview';
  const suffix = page === 'overview' ? '' : page + '/';
  const nav = (name: string, label: string) => `<a href="/designs/${style}/${name === 'overview' ? '' : name + '/'}" ${page === name ? 'aria-current="page"' : ''}>${label}</a>`;
  let content = page === 'overview' ? overview(style) : page === 'projects' ? projectsContent() : cvContent();
  content = content.replaceAll('href="/projects/"', `href="/designs/${style}/projects/"`).replaceAll('href="/cv/"', `href="/designs/${style}/cv/"`);
  return `<!doctype html><html lang="en" data-design="${style}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="description" content="Al Liu — ${design.name} website design preview."><meta property="og:image" content="https://al8n.github.io/social-preview.png"><meta property="og:image:alt" content="Al Liu website design preview"><meta name="color-scheme" content="${style === 'terminal' ? 'dark' : 'light'}"><title>${design.name} · ${page} — Al Liu design preview</title><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/designs.css">
  ${page === 'projects' ? '<script type="module" src="/projects.js"></script>' : ''}
  ${page !== 'cv' ? '<script type="module" src="/downloads.js"></script><script type="module" src="/stars.js"></script>' : ''}
  </head><body>
    <aside class="design-picker" aria-label="设计方案切换" lang="zh-CN"><a class="picker-title" href="/designs/studio/">风格预览</a><nav aria-label="设计方案">${Object.entries(designs).map(([key,d]) => `<a href="/designs/${key}/${suffix}" ${key === style ? 'aria-current="true"' : ''}><b>${d.letter}</b><span>${d.name} · ${d.label}</span></a>`).join('')}</nav><a class="live-link" href="/">当前网站 ↗</a></aside>
    <a class="skip-link" href="#main">Skip to content</a>
    <div class="design-shell"><header class="design-nav"><a class="brand" aria-label="Al Liu, preview home" href="/designs/${style}/"><span class="brand-symbol" aria-hidden="true">${style === 'terminal' ? '>_' : style === 'editorial' ? 'AL.' : 'a'}</span><span>Al Liu<small>@al8n</small></span></a><nav aria-label="Main navigation">${nav('overview','Overview')}${nav('projects','Projects')}${nav('cv','CV')}</nav><a class="nav-github" href="https://github.com/al8n">GitHub ↗</a></header>
    <main id="main" class="design-main ${page}-panel">${content}</main>
    <footer class="design-footer"><span>Al Liu / Rust systems engineering</span><div><a href="mailto:${profile.email}">Email ↗</a><a href="${profile.github}">GitHub ↗</a><a href="${profile.crates}">crates.io ↗</a></div></footer></div>
  </body></html>`;
}
