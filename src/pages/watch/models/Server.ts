export interface Server {
    name: string;
    movie_url: string;
    series_url: string;
    safe?: boolean;
    /**
     * Opt in with `"sandbox": true` in servers.json. It is off by default
     * because Videasy and Vidking both refuse to play inside a sandboxed
     * frame ("Iframe Sandbox Detected") -- they check for the attribute
     * itself, so even granting every sandbox token does not help. Kept for
     * providers that do tolerate it.
     */
    sandbox?: boolean;
  }