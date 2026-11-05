import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
const root = resolve('dist');
const port = Number(process.env.PORT || 4321);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.pdf': 'application/pdf', '.xml': 'application/xml', '.txt': 'text/plain' };
createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    let pathname;
    try { pathname = decodeURIComponent(url.pathname); } catch { response.writeHead(400); response.end('Bad request'); return; }
    let file = resolve(root, '.' + pathname);
    if (!file.startsWith(root + '/') && file !== root) { response.writeHead(403); response.end('Forbidden'); return; }
    try {
      const info = await stat(file);
      if (info.isDirectory()) {
        if (!pathname.endsWith('/')) { response.writeHead(301, { location: pathname + '/' + url.search }); response.end(); return; }
        file = resolve(file, 'index.html');
      }
      const bytes = await readFile(file);
      response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      response.end(request.method === 'HEAD' ? undefined : bytes);
    } catch {
      response.writeHead(404, { 'Content-Type': types['.html'] });
      response.end(await readFile(resolve(root, '404.html')));
    }
  } catch { response.writeHead(500); response.end('Server error'); }
}).listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}/`));
