import { cp, lstat, mkdir, mkdtemp, rename, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export async function buildSite(root = repositoryRoot) {
  const index = await lstat(join(root, 'index.html'));
  if (!index.isFile() || index.isSymbolicLink()) throw new Error('index.html must be a regular file.');
  const staging = await mkdtemp(join(root, '.dist-build-'));
  try {
    for (const entry of ['index.html', 'src', 'public', 'zh', 'ja']) {
      const source = join(root, entry);
      const exists = await lstat(source).then(() => true, (error) => {
        if (error.code === 'ENOENT') return false;
        throw error;
      });
      if (!exists) continue;
      await cp(source, join(staging, entry), {
        recursive: true,
        filter: async (filename) => {
          if (basename(filename).startsWith('.')) return false;
          if ((await lstat(filename)).isSymbolicLink()) {
            throw new Error(`Build assets cannot be symbolic links: ${filename}`);
          }
          return true;
        },
      });
    }
    const renderer = join(root, 'src', 'render.js');
    const hasRenderer = await lstat(renderer).then(() => true, (error) => {
      if (error.code === 'ENOENT') return false;
      throw error;
    });
    if (hasRenderer) {
      const { createDocument } = await import(pathToFileURL(renderer).href);
      for (const language of ['en', 'zh', 'ja']) {
        const directory = language === 'en' ? staging : join(staging, language);
        await mkdir(directory, { recursive: true });
        await writeFile(join(directory, 'index.html'), createDocument(language, language === 'en' ? './' : '../'));
      }
    }
    await rm(join(root, 'dist'), { force: true, recursive: true });
    await rename(staging, join(root, 'dist'));
  } finally {
    await rm(staging, { force: true, recursive: true });
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildSite().then(() => console.log('Built static website in dist/')).catch((error) => {
    console.error(`Build failed: ${error.message}`);
    process.exitCode = 1;
  });
}
