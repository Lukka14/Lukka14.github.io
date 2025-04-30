import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./UpdateNotifier.css";

declare const APP_VERSION: string;

const CURRENT_UPDATE_CODE = `v${APP_VERSION}`;

const updateInfo = [
    {
        title: `🚀 Big Updates Arrived!`,
        items: [
            "Now you'll get notified about important updates on the page!",
            "Added credentials validation for registration",
            "Email verification is now required after signing up",
            "Updated Media Card style"
        ]
    }
];

export default function UpdateNotifier() {
    const [showUpdate, setShowUpdate] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [showUpdateInfo, setShowUpdateInfo] = useState(false);

    useEffect(() => {
        const dismissedVersion = Cookies.get("dismissedUpdateCode");
        if (dismissedVersion !== CURRENT_UPDATE_CODE) {
            setShowUpdate(true);
        }
    }, []);

    const dismissUpdate = () => {
        setIsExiting(true);
        setTimeout(() => {
            setShowUpdate(false);
            Cookies.set("dismissedUpdateCode", CURRENT_UPDATE_CODE, { expires: 365 });
        }, 500);
    };

    const toggleUpdateInfo = (e: any) => {
        e.preventDefault();
        setShowUpdateInfo(true);
    };

    const closeUpdateInfo = () => {
        setShowUpdateInfo(false);
        dismissUpdate();
    };

    if (!showUpdate) return null;

    return (
        <>
            {!showUpdateInfo && (
                <div className="update-banner lightColorCustom" style={{ animation: isExiting ? "slideDown 0.5s ease-out forwards" : "slideUp 0.5s ease-out" }}>
                    🚀 Big Updates Arrived!&nbsp;
                    <button
                        onClick={toggleUpdateInfo}
                        className="btn btn-sm btn-light ms-2 update-btn"
                    >
                        See What's New
                    </button>

                    <button
                        onClick={dismissUpdate}
                        className="btn btn-sm btn-outline-light ms-2 update-btn dismiss-btn"
                    >
                        Dismiss
                    </button>
                </div>

            )}

            {showUpdateInfo && (
                <div className="update-pull-up-overlay" onClick={closeUpdateInfo}>
                    <div className="update-pull-up-panel" onClick={(e) => e.stopPropagation()}>
                        <div className="update-info-content">
                            {updateInfo.map((section, index) => (
                                <div key={index} className="update-section">
                                    <div className="update-header">
                                        <h5 className="header-title">{section.title}</h5>
                                        <button
                                            onClick={closeUpdateInfo}
                                            className="btn btn-sm btn-outline-light close-btn"
                                        >
                                            X
                                        </button>
                                    </div>
                                    <ul style={{
                                        paddingTop: "10px"
                                    }}>
                                        {section.items.map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
