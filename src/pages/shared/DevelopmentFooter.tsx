import { useState } from "react";

export default function DevelopmentFooter() {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    return (
        <div
            style={{
                position: "fixed",
                bottom: 0,
                width: "100%",
                backgroundColor: "rgba(255, 193, 7, 1)",
                color: "#212529",
                padding: "10px",
                textAlign: "center",
                zIndex: 1000,
                boxShadow: "0 -2px 5px rgba(0,0,0,0.2)",
                // backdropFilter: "blur(5px)",
            }}
        >
            <span>This website is currently under development 🚧</span>
            <button
                onClick={() => setVisible(false)}
                className="btn btn-dark btn-sm ms-3"
            >
                dismiss
            </button>
        </div>
    );
}
