import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

export async function optimizeImages(root = process.cwd()) {
  const { wedding } = await import(`${pathToFileURL(path.join(root, 'src/config.js')).href}?images=${Date.now()}`);
  const sources = [...new Set([
    wedding.heroPhoto, ...(wedding.heroSlides || []), wedding.couplePhoto, wedding.storyPhoto,
    ...wedding.gallery.map(photo => photo.src), '/decor/floral-bouquet.png',
  ].filter(src => src?.startsWith('/photos/') || src?.startsWith('/decor/')))];
  const output = path.join(root, 'public/optimized');
  await mkdir(output, { recursive: true });
  await mkdir(path.join(root, 'src/generated'), { recursive: true });
  const manifest = {};
  let originalBytes = 0, displayBytes = 0;
  for (const src of sources) {
    const inputPath = path.resolve(root, 'public', `.${src}`);
    if (!inputPath.startsWith(path.resolve(root, 'public') + path.sep)) throw new Error('Image path outside public directory');
    let input;
    try { input = await readFile(inputPath); }
    catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    const digest = createHash('sha256').update(input).update('webp-v1-q80').digest('hex').slice(0, 12);
    const stem = path.basename(src, path.extname(src));
    const widths = src.startsWith('/decor/') ? [320, 640, 1000] : [160, 480, 800, 1280, 1800];
    const variants = [];
    for (const width of widths) {
      const filename = `${stem}-${digest}-${width}.webp`;
      const target = path.join(output, filename);
      try { await access(target); }
      catch { await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(target); }
      const buffer = await readFile(target);
      const meta = await sharp(buffer).metadata();
      if (!variants.some(item => item.width === meta.width)) variants.push({ src: `/optimized/${filename}`, width: meta.width, height: meta.height, bytes: buffer.length });
    }
    manifest[src] = variants;
    originalBytes += input.length;
    displayBytes += (variants.find(item => item.width >= 800) || variants.at(-1)).bytes;
  }
  const target = path.join(root, 'src/generated/photo-manifest.json');
  const json = JSON.stringify(manifest, null, 2) + '\n';
  const previous = await readFile(target, 'utf8').catch(() => '');
  if (json !== previous) await writeFile(target, json);
  console.log(`[photos] ${(originalBytes / 1048576).toFixed(1)} MB originals → ${(displayBytes / 1048576).toFixed(2)} MB at ~800px`);
}
