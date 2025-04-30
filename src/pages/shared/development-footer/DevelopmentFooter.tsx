import { useState, useEffect } from "react";

export default function DevelopmentFooter() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition > 200) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div
            style={{
                position: "fixed",
                bottom: visible ? 0 : "-100px",
                width: "100%",
                backgroundColor: "rgba(255, 193, 7, 1)",
                color: "#212529",
                padding: "10px",
                textAlign: "center",
                zIndex: 1000,
                boxShadow: "0 -2px 5px rgba(0,0,0,0.2)",
                transition: "bottom 0.4s ease-in-out",
                opacity: visible ? 1 : 0
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