import React from "react";

interface CenteredH1Props {
  children: React.ReactNode;
}

const CenteredH1: React.FC<CenteredH1Props> = ({ children }) => {
  return (
    <div style={{ textAlign: "center", marginTop: "0%", color: "white" }}>
      <h1>{children}</h1>
    </div>
  );
};

export default CenteredH1;
