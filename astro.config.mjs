import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://al8n.github.io',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
