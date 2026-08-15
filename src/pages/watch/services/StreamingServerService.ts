import { Endpoints } from "../../../config/Config";
import { Server } from "../models/Server";

/**
 * Last-resort list used when the backend is unreachable or returns nothing, so
 * the player never dies on a backend hiccup.
 */
export const FALLBACK_SERVERS: Server[] = [
  {
    name: "Videasy",
    movie_url: "https://player.videasy.net/movie/{id}?color=e50914&autoPlay=true",
    series_url:
      "https://player.videasy.net/tv/{id}/{season}/{episode}?color=e50914&autoPlay=true",
    safe: true,
  },
  {
    name: "Vidking",
    movie_url: "https://www.vidking.net/embed/movie/{id}?color=e50914&autoPlay=true",
    series_url:
      "https://www.vidking.net/embed/tv/{id}/{season}/{episode}?color=e50914&autoPlay=true",
    safe: true,
  },
];

export interface StreamingServersResult {
  servers: Server[];
  /** True when the backend list could not be used and the fallback kicked in. */
  usedFallback: boolean;
}

// The list only changes when an admin edits it, so one request per session is
// enough. The promise itself is cached so parallel callers share a single fetch.
let cached: Promise<StreamingServersResult> | null = null;

const isUsable = (server: any): server is Server =>
  server &&
  typeof server.name === "string" &&
  (typeof server.movie_url === "string" || typeof server.series_url === "string");

const requestServers = async (): Promise<StreamingServersResult> => {
  const response = await fetch(Endpoints.STREAMING_SERVERS);

  if (!response.ok) {
    throw new Error(`Failed to load streaming servers: ${response.status}`);
  }

  const data = await response.json();
  // The backend returns the list already sorted -- never re-sort it here.
  const servers = Array.isArray(data) ? data.filter(isUsable) : [];

  if (servers.length === 0) {
    throw new Error("Streaming server list is empty");
  }

  return { servers, usedFallback: false };
};

export const fetchStreamingServers = (): Promise<StreamingServersResult> => {
  if (!cached) {
    cached = requestServers().catch((error) => {
      console.error(error);
      // Don't poison the cache: a later visit can retry the backend.
      cached = null;
      return { servers: FALLBACK_SERVERS, usedFallback: true };
    });
  }

  return cached;
};
