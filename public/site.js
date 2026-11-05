(() => {
  const button = document.getElementById('theme-toggle');
  const label = document.getElementById('theme-label');
  const themes = ['system', 'light', 'dark'];
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
    button.addEventListener('click', () => {
      const current = document.documentElement.dataset.theme || 'system';
      const next = themes[(themes.indexOf(current) + 1) % themes.length];
      document.documentElement.dataset.theme = next;
      try { if (next === 'system') localStorage.removeItem('al-theme'); else localStorage.setItem('al-theme', next); } catch { /* The current page still switches if storage is unavailable. */ }
      update();
    });
  }
  const print = document.getElementById('print-cv');
  if (print) { print.hidden = false; print.addEventListener('click', () => window.print()); }
})();
