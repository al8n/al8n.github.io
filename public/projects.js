let syncFilter;
let transition;
function initProjects() {
  transition?.cancel();
  syncFilter = null;
  const controls = document.querySelector('.project-filters');
  if (!controls) return;
  controls.hidden = false;
  document.querySelector('.category-nav').hidden = true;
  const sections = Array.from(document.querySelectorAll('[data-category]'));
  const buttons = Array.from(controls.querySelectorAll('button'));
  const count = document.getElementById('results-count');
  const collection = document.querySelector('.project-collection');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let active = null;
  function filter(value, animate = true) {
    const selected = sections.some(s => s.dataset.category === value) ? value : 'all';
    if (selected === active) return;
    transition?.cancel();
    let total = 0;
    for (const section of sections) {
      section.hidden = selected !== 'all' && selected !== section.dataset.category;
      if (!section.hidden) total += section.querySelectorAll('.collection-card').length;
    }
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.filter === selected));
    if (count) count.textContent = `${total} PROJECT${total === 1 ? '' : 'S'}`;
    active = selected;
    if (animate && !reducedMotion.matches && collection?.animate) {
      transition = collection.animate(
        [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 240, easing: 'cubic-bezier(.2,.7,.2,1)' },
      );
    }
  }
  controls.onclick = event => {
    const button = event.target.closest('button');
    if (!button) return;
    const value = button.dataset.filter;
    if (value === active) return;
    const href = value === 'all' ? location.pathname : `#${value}`;
    const navigation = new CustomEvent('portfolio:filter-navigation', {
      cancelable: true, detail: { href, left: scrollX, top: scrollY },
    });
    if (document.dispatchEvent(navigation)) history.pushState(null, '', href);
    filter(value);
  };
  syncFilter = () => filter(location.hash.slice(1));
  filter(location.hash.slice(1), false);
}
window.addEventListener('popstate', () => syncFilter?.());
window.addEventListener('hashchange', () => syncFilter?.());
document.addEventListener('astro:page-load', initProjects);
initProjects();
