import manifest from '../generated/photo-manifest.json';

export const panelSizes = '(max-width: 600px) 100vw, (max-width: 800px) 600px, (max-width: 1100px) 48vw, (max-width: 1348px) 46vw, 620px';

export function imageProps(src, sizes = panelSizes) {
  const variants = manifest[src];
  if (!variants?.length) return { src, decoding: 'async' };
  const fallback = variants.find(image => image.width >= 800) || variants.at(-1);
  return {
    src: fallback.src,
    srcSet: variants.map(image => `${image.src} ${image.width}w`).join(', '),
    sizes, width: fallback.width, height: fallback.height, decoding: 'async',
  };
}
