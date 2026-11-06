import { groupProjects } from './project-order.js';

const views = ['grid', 'list', 'categories'];
const sorts = ['recommended', 'downloads', 'stars', 'name'];
const settingsKey = 'al-project-catalog-v1';

function preferences() {
  let saved;
  try { saved = JSON.parse(localStorage.getItem(settingsKey)); } catch { /* Optional. */ }
  return {
    view: views.includes(saved?.view) ? saved.view : 'grid',
    sort: sorts.includes(saved?.sort) ? saved.sort : 'recommended',
  };
}

let syncHash;
function initProjects() {
  const catalog = document.getElementById('catalog');
  syncHash = null;
  if (!catalog) return;
  const controls = catalog.querySelector('.catalog-controls');
  const filters = [...controls.querySelectorAll('[data-filter]')];
  const categories = filters.slice(1).map(button => ({ id: button.dataset.filter, name: button.dataset.label }));
  const collection = catalog.querySelector('.project-collection');
  const cards = [...collection.querySelectorAll('[data-project]')];
  const sortMenu = controls.querySelector('select');
  const count = controls.querySelector('#results-count');
  const settings = preferences();
  let activeFilter;
  let animation;
  let signature;

  function draw(animate = false, hash = location.hash.slice(1)) {
    activeFilter = categories.some(category => category.id === hash) ? hash : 'all';
    const number = value => value === '' ? null : Number(value);
    const records = cards.map(card => ({
      name: card.dataset.project, category: card.dataset.topic,
      featured: card.classList.contains('collection-spotlight'),
      stars: number(card.dataset.stars), downloads: number(card.dataset.downloads), card,
    }));
    const groups = groupProjects(records, settings.view, settings.sort, categories);
    const next = JSON.stringify([settings.view, settings.sort, activeFilter, groups.map(g => g.items.map(item => item.name))]);
    if (next === signature) return;
    signature = next;
    const focused = collection.contains(document.activeElement) ? document.activeElement : null;
    const fragment = document.createDocumentFragment();
    let total = 0;
    for (const group of groups) {
      const section = document.createElement('section');
      section.className = 'project-category';
      const header = document.createElement('div');
      header.className = 'catalog-heading';
      const title = document.createElement('h2');
      title.textContent = group.title;
      header.append(title);
      const grid = document.createElement('div');
      grid.className = 'collection-grid';
      let visible = 0;
      for (const { card, category } of group.items) {
        card.hidden = activeFilter !== 'all' && category !== activeFilter;
        if (!card.hidden) visible++;
        grid.append(card);
      }
      section.hidden = visible === 0;
      total += visible;
      section.append(header, grid);
      fragment.append(section);
    }
    collection.dataset.layout = settings.view;
    collection.replaceChildren(fragment);
    if (focused?.closest('.collection-card:not([hidden])')) focused.focus({ preventScroll: true });
    count.textContent = total + (total === 1 ? ' PROJECT' : ' PROJECTS');
    sortMenu.value = settings.sort;
    for (const button of filters) button.setAttribute('aria-pressed', String(button.dataset.filter === activeFilter));
    for (const button of controls.querySelectorAll('[data-view]')) button.setAttribute('aria-pressed', String(button.dataset.view === settings.view));
    animation?.cancel();
    if (animate && !matchMedia('(prefers-reduced-motion: reduce)').matches && collection.animate) {
      animation = collection.animate([{ opacity: .45, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }],
        { duration: 220, easing: 'ease-out' });
    }
  }
  function saveAndDraw() {
    try { localStorage.setItem(settingsKey, JSON.stringify(settings)); } catch { /* Optional. */ }
    draw(true);
  }
  controls.onclick = event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.view) {
      settings.view = button.dataset.view;
      saveAndDraw();
      return;
    }
    const value = button.dataset.filter;
    if (!value || value === activeFilter) return;
    const href = value === 'all' ? location.pathname : '#' + value;
    const navigation = new CustomEvent('portfolio:filter-navigation', {
      cancelable: true, detail: { href, left: scrollX, top: scrollY },
    });
    if (document.dispatchEvent(navigation)) history.pushState(null, '', href);
    draw(true, value);
  };
  sortMenu.onchange = () => {
    settings.sort = sortMenu.value;
    saveAndDraw();
  };
  syncHash = () => draw(true);
  collection.addEventListener('metrics-updated', () => draw());
  draw();
  controls.hidden = false;
}
const initialized = new WeakMap();
function onLoad() {
  const catalog = document.getElementById('catalog');
  if (catalog && initialized.has(catalog)) {
    syncHash = initialized.get(catalog);
    syncHash();
    return;
  }
  initProjects();
  if (catalog) initialized.set(catalog, syncHash);
}
window.addEventListener('popstate', () => syncHash?.());
window.addEventListener('hashchange', () => syncHash?.());
document.addEventListener('astro:page-load', onLoad);
onLoad();
