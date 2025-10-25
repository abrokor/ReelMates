// lib/tmdb.ts
import Constants from "expo-constants";

/** TMDB API base (v3) */
const TMDB_BASE = "https://api.themoviedb.org/3";

/** Read from both extra and process.env (EXPO_PUBLIC_*) */
const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, any>;
const env = (process.env ?? {}) as Record<string, string | undefined>;

function pickEnv(...keys: string[]) {
  for (const k of keys) {
    const v = (extra as any)[k] ?? env[k];
    if (v) return String(v);
  }
  return undefined;
}

// Prefer v4 bearer; fallback to v3 key
const TMDB_V4 = pickEnv(
  "TMDB_V4",
  "TMDB_READ_TOKEN",
  "EXPO_PUBLIC_TMDB_V4",
  "EXPO_PUBLIC_TMDB_READ_TOKEN"
);
const TMDB_KEY = pickEnv("TMDB_KEY", "EXPO_PUBLIC_TMDB_KEY");

function authFetch(input: string, init?: RequestInit) {
  if (TMDB_V4) {
    return fetch(input, {
      ...(init ?? {}),
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: `Bearer ${TMDB_V4}`, // raw token from TMDB (no "Bearer " in .env)
        ...(init?.headers ?? {}),
      },
    });
  }
  if (TMDB_KEY) {
    const url = new URL(input);
    url.searchParams.set("api_key", TMDB_KEY);
    return fetch(url.toString(), {
      ...(init ?? {}),
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  }
  throw new Error(
    "TMDB credentials missing. Provide EXPO_PUBLIC_TMDB_READ_TOKEN (v4) or EXPO_PUBLIC_TMDB_KEY (v3) in .env and map via app.config.ts."
  );
}

export type MediaType = "movie" | "tv";
export type TMDBItem = {
  id: number;
  media_type: MediaType;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string | null;
  vote_average?: number;
};

export async function searchTMDB(query: string, year?: string) {
  const q = query?.trim();
  if (!q) return [];
  const url = new URL("https://api.themoviedb.org/3/search/multi");
  url.searchParams.set("query", q);
  if (year && /^\d{4}$/.test(year)) url.searchParams.set("year", year);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_READ_TOKEN || process.env.TMDB_V4}` }
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.results ?? [];
}

export async function getDetails(media: MediaType, id: number) {
  const url = `${TMDB_BASE}/${media}/${id}?language=en-US`;
  const res = await authFetch(url);
  if (!res.ok) {
    let msg = `TMDB details failed: ${res.status}`;
    try {
      const j = await res.json();
      if (j?.status_message) msg += ` – ${j.status_message}`;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export function imgUrl(
  path?: string | null,
  size:
    | "w92"
    | "w154"
    | "w185"
    | "w342"
    | "w500"
    | "w780"
    | "original" = "w342"
) {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function titleOf(item: TMDBItem) {
  return item.media_type === "movie"
    ? item.title ?? item.name ?? ""
    : item.name ?? item.title ?? "";
}

export function yearOf(item: TMDBItem) {
  const d =
    item.media_type === "movie" ? item.release_date : item.first_air_date;
  return d ? String(new Date(d).getFullYear()) : "";
}
