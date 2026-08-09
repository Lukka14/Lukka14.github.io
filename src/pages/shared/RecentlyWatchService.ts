import { Media } from "../../models/Movie";
import Cookies from "js-cookie";

const maxHistorySize = 10;
const STORAGE_KEY = "recentlyWatched";
const RESUME_KEY = "mp:resumePoints";

/**
 * Reads and parses a JSON value from localStorage. Storage can hold malformed
 * data (a partial write, an older schema, or a user editing it by hand), and
 * this runs during render, so an unguarded parse would blank the whole page.
 * On bad data we drop the key so the app heals itself instead of failing again
 * on every subsequent load.
 */
const readJson = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    try {
      localStorage.removeItem(key);
    } catch {
      /* storage unavailable (private mode, quota) - nothing else to do */
    }
    return fallback;
  }
};

const writeJson = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable - history is non-critical, so ignore */
  }
};

export const saveRecentlyWatched = (newMedia: Media): void => {
  const items: Media[] = getRecentlyWatched();

  // Remove any existing instance of the same Media (if applicable)
  const updatedItems = items.filter((item) => item.id !== newMedia.id);

  // Add the new Media object at the beginning
  updatedItems.unshift(newMedia);

  writeJson(STORAGE_KEY, updatedItems.slice(0, maxHistorySize));
};

export const getRecentlyWatched = (): Media[] => {
  const items = readJson<any[]>(STORAGE_KEY, []);
  if (!Array.isArray(items)) return [];

  return items
    .filter((item) => item && typeof item === "object")
    .slice(0, maxHistorySize)
    .map((item: any) => new Media(item));
};

/* ------------------------------------------------------------------ resume */

type ResumePoints = Record<string, { s: number; e: number }>;

/**
 * Resume points used to live in one cookie per series, named after the raw
 * TMDB id. That leaked the id namespace into the cookie jar, sent the data to
 * the server on every request for no reason, and silently fell over once a
 * user built up enough history to hit the per-domain cookie limit.
 */
export const saveResumePoint = (
  mediaId: string | number | undefined,
  season: number,
  episode: number
): void => {
  if (!mediaId || !season || !episode) return;

  const points = readJson<ResumePoints>(RESUME_KEY, {});
  points[String(mediaId)] = { s: season, e: episode };
  writeJson(RESUME_KEY, points);
};

export const getResumePoint = (
  mediaId: string | number | undefined
): { s: number; e: number } | null => {
  const point = readJson<ResumePoints>(RESUME_KEY, {})[String(mediaId)];
  if (!point || typeof point.s !== "number" || typeof point.e !== "number") {
    return null;
  }

  return point;
};

/** Returns the "&s=1&e=2" suffix for a series watch URL. */
export const getResumeQuery = (mediaId: string | number | undefined): string => {
  const point = getResumePoint(mediaId);
  return point ? `&s=${point.s}&e=${point.e}` : "&s=1&e=1";
};

const LEGACY_VALUE_PATTERN = /^&s=(\d+)&e=(\d+)$/;

/**
 * Moves resume points written by the old cookie-based implementation into
 * localStorage, then clears those cookies. Matches on both the name (a numeric
 * media id) and the value shape so unrelated cookies are never touched.
 * Safe to run on every startup; it is a no-op once the cookies are gone.
 */
export const migrateLegacyResumeCookies = (): void => {
  try {
    const all = Cookies.get();
    if (!all) return;

    const points = readJson<ResumePoints>(RESUME_KEY, {});
    let migrated = false;

    Object.entries(all).forEach(([name, value]) => {
      if (!/^\d+$/.test(name)) return;

      const match = LEGACY_VALUE_PATTERN.exec(String(value));
      if (!match) return;

      // Anything already in localStorage is newer, so it wins.
      if (!points[name]) {
        points[name] = { s: Number(match[1]), e: Number(match[2]) };
      }

      Cookies.remove(name);
      migrated = true;
    });

    if (migrated) writeJson(RESUME_KEY, points);
  } catch {
    /* migration is best effort - never let it break startup */
  }
};
