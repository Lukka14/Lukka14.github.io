import React from "react";

interface CenteredH1Props {
  children: React.ReactNode;
}

const CenteredH1: React.FC<CenteredH1Props> = ({ children }) => {
  return (
    <div style={{textAlign:"center", marginTop: "10px", color: "white" }}>
      <p className="lead">{children}</p>
    </div>
  );
};

export default CenteredH1;
