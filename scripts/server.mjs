import { createReadStream } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, extname, isAbsolute, relative, resolve, sep } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const localeDirectories = new Set(['zh', 'ja']);
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

function isPublicPath(pathname) {
  const parts = pathname.split('/');
  if (parts.some((part) => part.startsWith('.')) || pathname.includes('\\') || pathname.includes('\0')) {
    return false;
  }
  return pathname === 'index.html'
    || /^(zh|ja)\/index\.html$/.test(pathname)
    || (['src', 'public'].includes(parts[0]) && parts.length > 1 && Boolean(contentTypes[extname(pathname).toLowerCase()]));
}

function respond(response, request, status, message, headers = {}) {
  response.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': Buffer.byteLength(message),
    'X-Content-Type-Options': 'nosniff',
    ...headers,
  });
  response.end(request.method === 'HEAD' ? undefined : message);
}

export function createStaticServer({ root = repositoryRoot } = {}) {
  const rootPath = realpath(root);
  return createServer({ requestTimeout: 15_000, headersTimeout: 10_000 }, async (request, response) => {
    if (!['GET', 'HEAD'].includes(request.method)) {
      respond(response, request, 405, 'Method not allowed\n', { Allow: 'GET, HEAD' });
      return;
    }

    const requestUrl = request.url || '/';
    const queryIndex = requestUrl.indexOf('?');
    const query = queryIndex === -1 ? '' : requestUrl.slice(queryIndex);
    let pathname;
    try {
      pathname = decodeURIComponent(queryIndex === -1 ? requestUrl : requestUrl.slice(0, queryIndex));
    } catch {
      respond(response, request, 400, 'Invalid URL\n');
      return;
    }
    if (!pathname.startsWith('/')) {
      respond(response, request, 400, 'Invalid URL\n');
      return;
    }
    if (localeDirectories.has(pathname.slice(1))) {
      respond(response, request, 308, 'Permanent redirect\n', { Location: `${pathname}/${query}` });
      return;
    }
    const asset = pathname === '/' ? 'index.html'
      : /^\/(zh|ja)\/$/.test(pathname) ? `${pathname.slice(1)}index.html`
        : pathname.slice(1);
    if (!isPublicPath(asset)) {
      respond(response, request, 404, 'Not found\n');
      return;
    }

    try {
      const directory = await rootPath;
      const filename = await realpath(resolve(directory, asset));
      const resolvedAsset = relative(directory, filename);
      if (isAbsolute(resolvedAsset) || resolvedAsset.startsWith(`..${sep}`)
        || !isPublicPath(resolvedAsset.split(sep).join('/'))) {
        respond(response, request, 404, 'Not found\n');
        return;
      }
      const details = await stat(filename);
      if (!details.isFile()) {
        respond(response, request, 404, 'Not found\n');
        return;
      }
      response.writeHead(200, {
        'Content-Type': contentTypes[extname(filename).toLowerCase()],
        'Content-Length': details.size,
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      });
      if (request.method === 'HEAD') response.end();
      else await pipeline(createReadStream(filename), response);
    } catch (error) {
      if (response.headersSent) response.destroy(error);
      else if (['ENOENT', 'ENOTDIR', 'EACCES', 'ELOOP'].includes(error.code)) {
        respond(response, request, 404, 'Not found\n');
      } else {
        console.error('Unable to serve file:', error.message);
        respond(response, request, 500, 'Server error\n');
      }
    }
  });
}

async function main() {
  const preview = process.argv.includes('--preview');
  const root = preview ? resolve(repositoryRoot, 'dist') : repositoryRoot;
  const portText = process.env.PORT || (preview ? '4173' : '3000');
  if (!/^\d+$/.test(portText) || Number(portText) < 1 || Number(portText) > 65_535) {
    throw new Error('PORT must be an integer from 1 to 65535.');
  }
  await stat(resolve(root, 'index.html')).catch(() => {
    throw new Error(preview ? 'No build found. Run npm run build first.' : 'index.html is missing.');
  });
  const host = process.env.HOST || '0.0.0.0';
  const server = createStaticServer({ root });
  await new Promise((fulfill, reject) => {
    server.once('error', reject);
    server.listen(Number(portText), host, fulfill);
  });
  console.log(`${preview ? 'Preview' : 'Development'} server listening on ${host}:${portText}`);
  const shutdown = () => {
    server.close(() => process.exit(0));
    server.closeIdleConnections();
    setTimeout(() => process.exit(0), 5_000).unref();
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
