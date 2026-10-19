import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { request } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, test } from 'node:test';
import { buildSite } from './build.mjs';
import { createStaticServer } from './server.mjs';

let root;
let server;
let port;

function fetchPath(path, method = 'GET') {
  return new Promise((fulfill, reject) => {
    const req = request({ hostname: '127.0.0.1', port, path, method, timeout: 5_000 }, (response) => {
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => fulfill({ status: response.statusCode, headers: response.headers, body: Buffer.concat(chunks).toString() }));
      response.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('Local HTTP request timed out')));
    req.end();
  });
}

before(async () => {
  root = await mkdtemp(join(tmpdir(), 'portfolio-server-'));
  await mkdir(join(root, 'src'));
  await mkdir(join(root, 'public'));
  await mkdir(join(root, 'zh'));
  await mkdir(join(root, 'ja'));
  await mkdir(join(root, '.git'));
  await Promise.all([
    writeFile(join(root, 'index.html'), '<h1>Fixture</h1>'),
    ...['zh', 'ja'].map((locale) => writeFile(join(root, locale, 'index.html'), `<html lang="${locale}"><link rel="stylesheet" href="../src/style.css"><script type="module" src="../src/app.js"></script><h1>${locale} fixture</h1></html>`)),
    writeFile(join(root, 'src', 'app.js'), 'console.log("fixture");'),
    writeFile(join(root, 'src', 'style.css'), 'body { color: black; }'),
    writeFile(join(root, 'public', 'mark.svg'), '<svg></svg>'),
    writeFile(join(root, 'public', '简历.pdf'), 'PDF fixture'),
    writeFile(join(root, 'package.json'), '{"private": true}'),
    writeFile(join(root, '.env'), 'SECRET=fixture'),
    writeFile(join(root, '.git', 'config'), 'private fixture'),
    symlink(join(root, 'package.json'), join(root, 'src', 'private.json')),
    symlink('/etc/passwd', join(root, 'public', 'outside.txt')),
    symlink(join(root, 'package.json'), join(root, 'zh', 'private.json')),
  ]);
  server = createStaticServer({ root });
  await new Promise((fulfill, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', fulfill);
  });
  port = server.address().port;
});

after(async () => {
  if (server?.listening) await new Promise((fulfill) => server.close(fulfill));
  await rm(root, { recursive: true, force: true });
});

test('serves the home page and ignores query strings', async () => {
  const response = await fetchPath('/?lang=ja');
  assert.equal(response.status, 200);
  assert.equal(response.body, '<h1>Fixture</h1>');
  assert.equal(response.headers['content-type'], 'text/html; charset=utf-8');
  assert.equal(response.headers['x-content-type-options'], 'nosniff');
});

test('serves scripts, styles, images, and Unicode asset paths with correct MIME types', async () => {
  for (const [path, mime] of [
    ['/src/app.js', 'text/javascript; charset=utf-8'],
    ['/src/style.css', 'text/css; charset=utf-8'],
    ['/public/mark.svg', 'image/svg+xml'],
    [`/public/${encodeURIComponent('简历.pdf')}`, 'application/pdf'],
  ]) {
    const response = await fetchPath(path);
    assert.equal(response.status, 200, path);
    assert.equal(response.headers['content-type'], mime, path);
  }
});

test('serves locale directories and their explicit index pages with shared relative assets', async () => {
  for (const locale of ['zh', 'ja']) {
    for (const path of [`/${locale}/`, `/${locale}/index.html?from=direct`]) {
      const response = await fetchPath(path);
      assert.equal(response.status, 200, path);
      assert.equal(response.headers['content-type'], 'text/html; charset=utf-8', path);
      assert.match(response.body, new RegExp(`<html lang="${locale}">`));
      for (const relativeAsset of ['../src/app.js', '../src/style.css']) {
        assert.ok(response.body.includes(`"${relativeAsset}"`));
        const asset = new URL(relativeAsset, `http://localhost${path}`).pathname;
        assert.equal((await fetchPath(asset)).status, 200, `${path} → ${asset}`);
      }
    }
  }
});

test('redirects bare locale paths to trailing slashes and preserves the exact query string', async () => {
  for (const locale of ['zh', 'ja']) {
    for (const query of ['', '?view=cv&name=a%20b&name=c']) {
      const response = await fetchPath(`/${locale}${query}`);
      assert.equal(response.status, 308);
      assert.equal(response.headers.location, `/${locale}/${query}`);
    }
    const head = await fetchPath(`/${locale}?view=cv`, 'HEAD');
    assert.equal(head.status, 308);
    assert.equal(head.headers.location, `/${locale}/?view=cv`);
    assert.equal(head.body, '');
  }
});

test('HEAD returns GET headers without a body', async () => {
  const response = await fetchPath('/', 'HEAD');
  assert.equal(response.status, 200);
  assert.equal(response.body, '');
  assert.equal(Number(response.headers['content-length']), Buffer.byteLength('<h1>Fixture</h1>'));
});

test('missing assets and directories return a useful 404', async () => {
  for (const path of ['/missing', '/src/', '/public/missing.png']) {
    const response = await fetchPath(path);
    assert.equal(response.status, 404, path);
    assert.equal(response.body, 'Not found\n');
  }
});

test('denies repository files, hidden files, traversal, and escaping symbolic links', async () => {
  for (const path of [
    '/package.json', '/scripts/server.mjs', '/.env', '/.git/config',
    '/src/../index.html', '/src/%2e%2e/index.html', '/src/%2e%2e%2fpackage.json',
    '/src/%2eenv', '/src/..%5cpackage.json', '/src/private.json', '/public/outside.txt',
    '/zh/.env', '/ja/../index.html', '/zh/%2e%2e/index.html',
    '/ja/%2e%2e%2fpackage.json', '/zh/private.json', '/ja/src/app.js',
  ]) {
    assert.equal((await fetchPath(path)).status, 404, path);
  }
});

test('malformed URLs and unsupported HTTP methods have explicit responses', async () => {
  assert.equal((await fetchPath('/public/%ZZ')).status, 400);
  const response = await fetchPath('/', 'POST');
  assert.equal(response.status, 405);
  assert.equal(response.headers.allow, 'GET, HEAD');
});

test('build copies only website inputs, skips hidden files, and replaces stale output', async () => {
  const fixture = await mkdtemp(join(tmpdir(), 'portfolio-build-'));
  try {
    await mkdir(join(fixture, 'src'));
    await mkdir(join(fixture, 'public'));
    await mkdir(join(fixture, 'dist'));
    await Promise.all([
      writeFile(join(fixture, 'index.html'), '<h1>Build fixture</h1>'),
      writeFile(join(fixture, 'src', 'app.js'), 'export const ready = true;'),
      writeFile(join(fixture, 'public', 'image.svg'), '<svg/>'),
      writeFile(join(fixture, 'public', '.env'), 'hidden'),
      writeFile(join(fixture, 'package.json'), '{}'),
      writeFile(join(fixture, 'dist', 'stale.txt'), 'old'),
    ]);
    await buildSite(fixture);
    assert.deepEqual((await readdir(join(fixture, 'dist'))).sort(), ['index.html', 'public', 'src']);
    assert.deepEqual(await readdir(join(fixture, 'dist', 'public')), ['image.svg']);
    assert.equal(await readFile(join(fixture, 'dist', 'src', 'app.js'), 'utf8'), 'export const ready = true;');
    await buildSite(fixture);
    assert.equal(await readFile(join(fixture, 'dist', 'index.html'), 'utf8'), '<h1>Build fixture</h1>');
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test('build preserves locale page layout and shared asset references', async () => {
  const fixture = await mkdtemp(join(tmpdir(), 'portfolio-locales-build-'));
  try {
    for (const directory of ['src', 'zh', 'ja']) await mkdir(join(fixture, directory));
    const localeHtml = '<link rel="stylesheet" href="../src/style.css"><script type="module" src="../src/app.js"></script>';
    await Promise.all([
      writeFile(join(fixture, 'index.html'), '<h1>English</h1>'),
      writeFile(join(fixture, 'src', 'app.js'), 'export const ready = true;'),
      writeFile(join(fixture, 'src', 'style.css'), 'body { color: black; }'),
      writeFile(join(fixture, 'zh', 'index.html'), localeHtml),
      writeFile(join(fixture, 'ja', 'index.html'), localeHtml),
      writeFile(join(fixture, 'ja', '.env'), 'hidden'),
    ]);
    await buildSite(fixture);
    assert.deepEqual((await readdir(join(fixture, 'dist'))).sort(), ['index.html', 'ja', 'src', 'zh']);
    for (const locale of ['zh', 'ja']) {
      assert.equal(await readFile(join(fixture, 'dist', locale, 'index.html'), 'utf8'), localeHtml);
      assert.deepEqual(await readdir(join(fixture, 'dist', locale)), ['index.html']);
      assert.equal(await readFile(join(fixture, 'dist', locale, '../src/app.js'), 'utf8'), 'export const ready = true;');
      assert.equal(await readFile(join(fixture, 'dist', locale, '../src/style.css'), 'utf8'), 'body { color: black; }');
    }
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test('a failed build preserves the previous output and cleans staging files', async () => {
  const fixture = await mkdtemp(join(tmpdir(), 'portfolio-build-'));
  try {
    await mkdir(join(fixture, 'public'));
    await mkdir(join(fixture, 'dist'));
    await writeFile(join(fixture, 'index.html'), 'current');
    await writeFile(join(fixture, 'dist', 'index.html'), 'previous');
    await symlink('/etc/passwd', join(fixture, 'public', 'outside.txt'));
    await assert.rejects(buildSite(fixture), /cannot be symbolic links/);
    assert.equal(await readFile(join(fixture, 'dist', 'index.html'), 'utf8'), 'previous');
    assert.ok(!(await readdir(fixture)).some((entry) => entry.startsWith('.dist-build-')));
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});
