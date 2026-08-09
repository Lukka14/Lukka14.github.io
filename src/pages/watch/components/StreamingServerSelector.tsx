import React, { useState, useEffect } from "react";
import { AlertTriangle, MonitorPlay } from "lucide-react";
import "../css/watch.css";
import { Server } from "../models/Server";

interface StreamingServerSelectorProps {
  selectServer(server: Server): void;
}

const StreamingServerSelector: React.FC<StreamingServerSelectorProps> = ({
  selectServer,
}) => {
  const [servers, setServers] = useState<Server[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch("/servers.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load servers: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data: Server[]) => setServers(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error(err.message);
        setFailed(true);
      });
  }, []);

  const [selectedServer, setSelectedServer] = useState<number>(0);

  useEffect(() => {
    if (servers.length > 0) {
      handleSelectServer(servers[0], 0);
    }
  }, [servers]);

  const handleSelectServer = (server: Server, index: number) => {
    setSelectedServer(index);
    selectServer(server);
  };

  return (
    <div className="watch-servers">
      <div className="watch-servers-head">
        <h2 className="watch-servers-title">
          <MonitorPlay size={17} />
          Streaming sources
        </h2>
        {servers.length > 0 && (
          <p className="watch-servers-hint">
            Video not loading? Switch to another source.
          </p>
        )}
      </div>

      {servers.length > 0 ? (
        <div className="watch-server-list">
          {servers.map((server, index) => (
            <button
              key={index}
              type="button"
              aria-pressed={selectedServer === index}
              className={`watch-server-pill ${
                selectedServer === index ? "is-active" : ""
              }`}
              onClick={() => handleSelectServer(server, index)}
            >
              <span className="watch-server-index">{index + 1}</span>
              {server.name}
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
    </div>
  );
};

export default StreamingServerSelector;
