import React, { useState, useEffect } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { FaPlay } from "react-icons/fa"; // Play icon
import CenteredH1 from "../../shared/CenteredText";
import { MDBContainer } from "mdb-react-ui-kit";
import "../css/watch.css";
import { Server } from "../models/Server";

interface StreamingServerSelectorProps {
  selectServer(server: Server): void;
}

const StreamingServerSelector: React.FC<StreamingServerSelectorProps> = ({
  selectServer,
}) => {
  const [servers, setServers] = useState<Server[]>([]);

  useEffect(() => {
    fetch("/servers.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load servers: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data: Server[]) => setServers(data))
      .catch((err) => console.error(err.message));
  }, []);

  const [selectedServer, setSelectedServer] = useState<number>(0);

  useEffect(() => {
     if (servers.length > 0) {
        handleSelectServer(servers[0], 0); // Invoke handleSelectServer for the first server
      }
  }, [servers]);

  const handleSelectServer = (server: Server, index: number) => {
    setSelectedServer(index);
    selectServer(server);
  };

  return (
    <MDBContainer breakpoint="xl">
      <div className="server-bg">
        <Row className="d-flex justify-content-center mx-0 my-4">
          <CenteredH1>Available Servers:</CenteredH1>

          {servers.map((server, index) => (
            <Col key={index} xs="auto" className="mb-3">
              <Button
                variant={selectedServer === index ? "warning" : "primary"} // Changed to 'primary' for bluish background
                className={`streaming-server-btn ${
                  selectedServer === index ? "selected" : ""
                }`}
                onClick={() => handleSelectServer(server, index)}
                style={{
                  width: "150px", // Smaller button width
                  height: "80px", // Smaller button height
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 10px",
                  justifyContent: "center", // Center content horizontally
                  backgroundColor:
                    selectedServer === index ? "#1E3E62" : "#0B192C", // Updated to #040f13 for unselected servers
                  boxShadow:
                    selectedServer === index ? `0 0 15px 5px #040f13` : "none", // Glow effect
                }}
              >
                <FaPlay size={30} style={{ marginLeft: "-5px" }} />
                <div
                  className="d-flex flex-column justify-content-center align-items-center"
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  <span
                    className="text-white"
                    style={{ fontSize: "12px", textTransform: "none" }}
                  >
                    Server
                  </span>
                  <span
                    className={selectedServer === index ? "text-success" : "text-white"}
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      textTransform: "none",
                    }}
                  >
                    {server.name}
                  </span>
                </div>
              </Button>
            </Col>
          ))}
        </Row>
      </div>
    </MDBContainer>
  );
};

export default StreamingServerSelector;

