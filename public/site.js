const themes = ['system', 'light', 'dark'];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

function initSite() {
  const button = document.getElementById('theme-toggle');
  const label = document.getElementById('theme-label');
  function update() {
    const current = document.documentElement.dataset.theme || 'system';
    const next = themes[(themes.indexOf(current) + 1) % themes.length];
    const text = `Theme: ${current}. Switch to ${next} theme`;
    button?.setAttribute('aria-label', text);
    button?.setAttribute('title', text);
    if (label) label.textContent = current[0].toUpperCase() + current.slice(1);
  }
  if (button) {
    button.hidden = false;
    update();
    button.onclick = () => {
      const current = document.documentElement.dataset.theme || 'system';
      const next = themes[(themes.indexOf(current) + 1) % themes.length];
      document.documentElement.dataset.theme = next;
      try { if (next === 'system') localStorage.removeItem('al-theme'); else localStorage.setItem('al-theme', next); } catch { /* Theme switching works without storage. */ }
      if (!reducedMotion.matches) button.querySelector('svg')?.animate(
        [{ transform: 'rotate(-35deg)', opacity: .5 }, { transform: 'rotate(0)', opacity: 1 }],
        { duration: 220, easing: 'ease-out' },
      );
      update();
    };
  }
  const print = document.getElementById('print-cv');
  if (print) { print.hidden = false; print.onclick = () => window.print(); }
}

document.addEventListener('astro:before-swap', event => {
  event.newDocument.documentElement.dataset.theme = document.documentElement.dataset.theme || 'system';
});
document.addEventListener('astro:page-load', initSite);
initSite();
