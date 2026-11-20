export function resolveAssetPath(assetPath: string): string {
  if (!assetPath) return assetPath;
  if (/^(https?:|data:|blob:)/i.test(assetPath)) {
    return assetPath;
  }

  const normalizedPath = assetPath.replace(/^\/+/, '');
  const base = import.meta.env.BASE_URL || './';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${normalizedPath}`;
}
