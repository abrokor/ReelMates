// app/lib/tmdb.ts
const TMDB_V4_TOKEN = process.env.EXPO_PUBLIC_TMDB_TOKEN
  ?? 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MmVhMTZjMTVmNDkyZjQxODM0OWI5ZTQ5YzE1MzA5MiIsIm5iZiI6MTc1ODIyMjA1NC44MzksInN1YiI6IjY4Y2M1NmU2NzE3MjQ3ODUyYWNmNDY5ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8PMYTfCridhYDelueKgl83O1lVsahnxF7LTH2vFaCu4';

const BASE = 'https://api.themoviedb.org/3';

async function req(path: string, params: Record<string, any> = {}) {
  const qs = new URLSearchParams({ language: 'en-US', ...params } as any).toString();
  const url = `${BASE}${path}${qs ? `?${qs}` : ''}`;
  const res = await fetch(url, {
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${TMDB_V4_TOKEN}`,
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`TMDB ${res.status}: ${body || url}`);
  }
  return res.json();
}

export async function searchMulti(q: string, page = 1) {
  return req('/search/multi', { query: q, page });
}

export async function getDetails(media: 'movie' | 'tv', id: number) {
  if (!id || Number.isNaN(id)) throw new Error('Invalid TMDB id');
  return req(`/${media}/${id}`);
}

export function imgUrl(path?: string | null, size: 'w185'|'w342'|'w500'|'original'='w342') {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : undefined;
}

export function titleOf(x: any) {
  return x?.title ?? x?.name ?? '';
}
export function yearOf(x: any) {
  const d = x?.release_date ?? x?.first_air_date ?? '';
  return d ? Number(d.slice(0,4)) : null;
}
export type MediaType = 'movie' | 'tv';
