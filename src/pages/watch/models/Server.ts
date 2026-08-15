export interface Server {
    name: string;
    /** Null when the source can't play movies. */
    movie_url: string | null;
    /** Null when the source can't play series. */
    series_url: string | null;
    /** `false` means intrusive ads/popups, so the UI warns about it. */
    safe?: boolean;
    /** Stable key supplied by the backend. Never used to re-sort the list. */
    order?: number;
    /**
     * Opt in with `"sandbox": true` on the server entry. It is off by default
     * because Videasy and Vidking both refuse to play inside a sandboxed
     * frame ("Iframe Sandbox Detected") -- they check for the attribute
     * itself, so even granting every sandbox token does not help. Kept for
     * providers that do tolerate it.
     */
    sandbox?: boolean;
  }

/** Media type helper: which url a server needs to be usable. */
export const getServerUrl = (server: Server, isMovie: boolean): string | null =>
  (isMovie ? server.movie_url : server.series_url) ?? null;