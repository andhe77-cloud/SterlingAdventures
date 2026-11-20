const processedCache = new Map<string, string>();
const inflightCache = new Map<string, Promise<string>>();

/**
 * Checks whether a pixel is part of the bright chroma-key green backdrop.
 * Requires strong green channel dominance so muted greens/teals on clothing are spared.
 */
function isChromaGreen(r: number, g: number, b: number, strict = false): boolean {
  const maxRB = r > b ? r : b;
  const dominance = g - maxRB;
  if (strict) {
    return g > 140 && dominance > 55;
  }
  return g > 92 && dominance > 34;
}

/**
 * Checks if an image actually uses a bright green chroma backdrop by sampling the top corners.
 */
function hasGreenChromaCorners(data: Uint8ClampedArray, width: number, height: number): boolean {
  const samplePoints = [
    [2, 2],
    [Math.max(0, width - 3), 2],
    [2, Math.floor(height * 0.15)],
    [Math.max(0, width - 3), Math.floor(height * 0.15)],
  ];
  let hits = 0;
  for (const [x, y] of samplePoints) {
    const idx = (y * width + x) * 4;
    if (isChromaGreen(data[idx], data[idx + 1], data[idx + 2], true)) {
      hits++;
    }
  }
  return hits >= 2;
}

function processImageElement(img: HTMLImageElement): string {
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;
  if (!width || !height) {
    throw new Error('Image has zero dimensions');
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Canvas 2D context unavailable');
  }

  ctx.drawImage(img, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Safety check: if image is not on a chroma-green backdrop, leave it untouched
  if (!hasGreenChromaCorners(data, width, height)) {
    return img.src;
  }

  const total = width * height;
  const isBg = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;

  const trySeed = (x: number, y: number, strictOnly: boolean) => {
    const pos = y * width + x;
    if (isBg[pos]) return;
    const idx = pos * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    if (isChromaGreen(r, g, b, strictOnly)) {
      isBg[pos] = 1;
      queue[tail++] = pos;
    }
  };

  // Seed 4-neighbor BFS from all 4 outer edges so enclosed pockets touching any edge are cleared,
  // while interior clothing details (e.g. green palm leaves) stay protected by ink outlines.
  for (let x = 0; x < width; x++) {
    trySeed(x, 0, false);
    trySeed(x, height - 1, false);
  }
  for (let y = 0; y < height; y++) {
    trySeed(0, y, false);
    trySeed(width - 1, y, false);
  }

  // Also seed pure neon #00FF00 islands (e.g. gap enclosed between bent arm and torso)
  for (let pos = 0; pos < total; pos++) {
    if (isBg[pos]) continue;
    const idx = pos * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    if (g > 218 && r < 42 && b < 42) {
      isBg[pos] = 1;
      queue[tail++] = pos;
    }
  }

  // BFS expansion through connected green pixels
  while (head < tail) {
    const pos = queue[head++];
    const x = pos % width;
    const y = (pos - x) / width;

    // Left
    if (x > 0) {
      const n = pos - 1;
      if (!isBg[n]) {
        const idx = n * 4;
        if (isChromaGreen(data[idx], data[idx + 1], data[idx + 2], false)) {
          isBg[n] = 1;
          queue[tail++] = n;
        }
      }
    }
    // Right
    if (x < width - 1) {
      const n = pos + 1;
      if (!isBg[n]) {
        const idx = n * 4;
        if (isChromaGreen(data[idx], data[idx + 1], data[idx + 2], false)) {
          isBg[n] = 1;
          queue[tail++] = n;
        }
      }
    }
    // Up
    if (y > 0) {
      const n = pos - width;
      if (!isBg[n]) {
        const idx = n * 4;
        if (isChromaGreen(data[idx], data[idx + 1], data[idx + 2], false)) {
          isBg[n] = 1;
          queue[tail++] = n;
        }
      }
    }
    // Down
    if (y < height - 1) {
      const n = pos + width;
      if (!isBg[n]) {
        const idx = n * 4;
        if (isChromaGreen(data[idx], data[idx + 1], data[idx + 2], false)) {
          isBg[n] = 1;
          queue[tail++] = n;
        }
      }
    }
  }

  // Clear background alpha
  for (let pos = 0; pos < total; pos++) {
    if (isBg[pos]) {
      data[pos * 4 + 3] = 0;
    }
  }

  // 2-pass boundary green-despill & soft anti-aliased edge feathering
  const isNearBg = new Uint8Array(total);
  for (let pass = 0; pass < 2; pass++) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pos = y * width + x;
        if (isBg[pos]) continue;

        const touchesBg =
          (x > 0 && (isBg[pos - 1] || (pass === 1 && isNearBg[pos - 1]))) ||
          (x < width - 1 && (isBg[pos + 1] || (pass === 1 && isNearBg[pos + 1]))) ||
          (y > 0 && (isBg[pos - width] || (pass === 1 && isNearBg[pos - width]))) ||
          (y < height - 1 && (isBg[pos + width] || (pass === 1 && isNearBg[pos + width])));

        if (!touchesBg) continue;
        isNearBg[pos] = 1;

        const idx = pos * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const maxRB = r > b ? r : b;
        const spill = g - maxRB;

        if (spill > 0) {
          // Neutralize green fringe cleanly without darkening skin or highlights too much
          data[idx + 1] = Math.min(g, Math.round((r + b) * 0.52 + 4));

          if (pass === 0 && spill > 12) {
            const fade = Math.max(0.18, 1 - spill / 42);
            data[idx + 3] = Math.round(data[idx + 3] * fade);
          } else if (pass === 1 && spill > 22) {
            const fade = Math.max(0.45, 1 - spill / 60);
            data[idx + 3] = Math.round(data[idx + 3] * fade);
          }
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}

export function getCachedCutoutUrl(imageUrl: string): string | null {
  return processedCache.get(imageUrl) ?? null;
}

/**
 * Removes the solid chroma-key green backdrop from a sprite image and caches a transparent PNG data URL.
 */
export function removeChromaBackground(imageUrl: string): Promise<string> {
  const cached = processedCache.get(imageUrl);
  if (cached) return Promise.resolve(cached);

  const existing = inflightCache.get(imageUrl);
  if (existing) return existing;

  const promise = new Promise<string>((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const result = processImageElement(img);
        processedCache.set(imageUrl, result);
        inflightCache.delete(imageUrl);
        resolve(result);
      } catch {
        inflightCache.delete(imageUrl);
        resolve(imageUrl);
      }
    };
    img.onerror = () => {
      inflightCache.delete(imageUrl);
      resolve(imageUrl);
    };
    img.src = imageUrl;
  });

  inflightCache.set(imageUrl, promise);
  return promise;
}

export function preloadCharacterSprites(urls: string[]): void {
  for (const url of urls) {
    if (url) {
      void removeChromaBackground(url);
    }
  }
}
