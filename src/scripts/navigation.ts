import { navigate } from 'astro:transitions/client';

// Let category history use the same router as page navigation without moving the toolbar.
document.addEventListener('portfolio:filter-navigation', event => {
  if (!(event instanceof CustomEvent)) return;
  event.preventDefault();
  const { href, left, top } = event.detail;
  void navigate(href).then(() => window.scrollTo({ left, top, behavior: 'instant' }));
});
