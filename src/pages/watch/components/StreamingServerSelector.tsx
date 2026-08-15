import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, ExternalLink, MonitorPlay, ShieldCheck } from "lucide-react";
import "../css/watch.css";
import { Server, getServerUrl } from "../models/Server";
import { fetchStreamingServers } from "../services/StreamingServerService";

interface StreamingServerSelectorProps {
  selectServer(server: Server): void;
  /** Only sources that can play this media type are offered. */
  isMovie: boolean;
}

const StreamingServerSelector: React.FC<StreamingServerSelectorProps> = ({
  selectServer,
  isMovie,
}) => {
  const [servers, setServers] = useState<Server[]>([]);
  const [failed, setFailed] = useState(false);
  const [selectedServer, setSelectedServer] = useState<number>(0);

  useEffect(() => {
    let active = true;

    fetchStreamingServers().then(({ servers: loaded, usedFallback }) => {
      if (!active) return;
      setServers(loaded);
      setFailed(usedFallback);
    });

    return () => {
      active = false;
    };
  }, []);

  // The backend list is already sorted, so order is preserved and index 0 is
  // the default source. Only the media type filter is applied.
  const usable = useMemo(
    () => servers.filter((server) => getServerUrl(server, isMovie)),
    [servers, isMovie]
  );

  const handleSelectServer = useCallback(
    (server: Server, index: number) => {
      setSelectedServer(index);
      selectServer(server);
    },
    [selectServer]
  );

  useEffect(() => {
    if (usable.length > 0) {
      handleSelectServer(usable[0], 0);
    }
    // Re-picking the first source is intentional when the usable list changes
    // (e.g. switching between a movie and a series).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usable]);

  const selected = usable[selectedServer];

  return (
    <div className="watch-servers">
      <div className="watch-servers-head">
        <h2 className="watch-servers-title">
          <MonitorPlay size={17} />
          Streaming sources
        </h2>
        {usable.length > 0 && (
          <p className="watch-servers-hint">
            Video not loading? Switch to another source.
          </p>
        )}
      </div>

      {usable.length > 0 ? (
        <div className="watch-server-list">
          {usable.map((server, index) => (
            <button
              key={`${server.name}-${server.order ?? index}`}
              type="button"
              aria-pressed={selectedServer === index}
              className={`watch-server-pill ${
                selectedServer === index ? "is-active" : ""
              }`}
              onClick={() => handleSelectServer(server, index)}
            >
              <span className="watch-server-index">{index + 1}</span>
              {server.name}
              {server.safe === false && (
                <span className="watch-server-badge" title="Expect intrusive ads or popups">
                  <AlertTriangle size={12} />
                  Ads
                </span>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="watch-servers-empty">
          <AlertTriangle size={17} />
          {failed
            ? "We couldn't load the streaming sources. Please refresh the page."
            : "No streaming sources are available right now."}
        </div>
      )}

      {selected?.safe === false && (
        <div className="watch-servers-empty">
          <AlertTriangle size={17} />
          {selected.name} shows intrusive ads and popups. An ad blocker is
          strongly recommended.
        </div>
      )}

      <div className="watch-adblock-note">
        <span className="watch-adblock-icon">
          <ShieldCheck size={16} />
        </span>
        <p className="watch-adblock-text">
          Playback comes from third-party sources, so they may show ads or open
          new tabs when clicked. We can't remove those from our side &mdash; a
          blocker such as{" "}
          <a
            className="watch-adblock-link"
            href="https://ublockorigin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            uBlock Origin
            <ExternalLink size={12} />
          </a>{" "}
          stops them for good.
        </p>
      </div>
    </div>
  );
};

export default StreamingServerSelector;
