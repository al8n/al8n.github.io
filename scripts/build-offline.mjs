import { mkdir, rm, cp, writeFile } from 'node:fs/promises';
import { renderDocument } from '../src/components/render.ts';
// Same public data and render functions as the Astro pages; useful without registry access.
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true });
for (const [route, output] of [['/', 'index.html'], ['/projects/', 'projects/index.html'], ['/cv/', 'cv/index.html'], ['/404.html', '404.html']]) {
  const path = `dist/${output}`;
  await mkdir(path.slice(0, path.lastIndexOf('/')), { recursive: true });
  await writeFile(path, renderDocument(route));
}
console.log('Built 4 static pages from shared TypeScript renderers → dist/');
