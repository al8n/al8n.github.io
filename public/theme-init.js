(() => {
  let theme = 'system';
  try { const saved = localStorage.getItem('al-theme'); if (['light', 'dark'].includes(saved)) theme = saved; } catch { /* System preference remains available without storage. */ }
  document.documentElement.dataset.theme = theme;
})();
