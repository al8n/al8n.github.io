(() => {
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
  let transition;
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
  controls.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    const value = button.dataset.filter;
    if (value === active) return;
    history.pushState(null, '', value === 'all' ? location.pathname : `#${value}`);
    filter(value);
  });
  window.addEventListener('popstate', () => filter(location.hash.slice(1)));
  window.addEventListener('hashchange', () => filter(location.hash.slice(1)));
  filter(location.hash.slice(1), false);
})();
