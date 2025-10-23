// Build a TMDB poster URL (returns undefined if no path)
export function posterUrl(path?: string | null, size: 'w154' | 'w185' | 'w342' | 'w500' = 'w342') {
  if (!path) return undefined;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
