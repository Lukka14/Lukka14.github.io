import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Home, Palette, Search, Sparkles, Wrench, X } from "lucide-react";
import "./UpdateNotifier.css";

declare const APP_VERSION: string;

const CURRENT_UPDATE_CODE = `v${APP_VERSION}`;

const updateSections = [
  {
    icon: Search,
    title: "Search suggests as you type",
    items: [
      "Start typing and matching movies and series appear right under the box — pick one to jump straight to it.",
      "Move through the suggestions with the arrow keys and press Escape to close them.",
      "Suggestions follow the filter you picked, so a search set to Series only suggests series.",
    ],
  },
  {
    icon: Home,
    title: "Search from the home page",
    items: [
      "A new search section sits under the featured card, with the same instant suggestions.",
      "Press enter and your search carries over to the full search page.",
    ],
  },
  {
    icon: Palette,
    title: "Tidier look",
    items: [
      "Scrollbars now match the site theme instead of the browser's default grey.",
      "The navigation bar has been slimmed down — Movies and TV Shows are gone now that search covers them.",
    ],
  },
  {
    icon: Wrench,
    title: "Fixes",
    items: [
      "Suggestions are no longer cut off or hidden behind the results below them.",
      "Near the bottom of the screen the suggestion list opens upwards so it always fits.",
      "The filter buttons on the randomizer no longer stretch across the page.",
    ],
  },
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
    Cookies.set("dismissedUpdateCode", CURRENT_UPDATE_CODE, { expires: 365 });
    setIsExiting(true);
    setTimeout(() => setShowUpdate(false), 500);
  };

  const openUpdateInfo = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowUpdateInfo(true);
  };

  const closeUpdateInfo = () => {
    setShowUpdateInfo(false);
    dismissUpdate();
  };

  useEffect(() => {
    if (!showUpdateInfo) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeUpdateInfo();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [showUpdateInfo]);

  if (!showUpdate) return null;

  return (
    <>
      {!showUpdateInfo && (
        <div
          className={`update-banner${isExiting ? " is-exiting" : ""}`}
          role="status"
        >
          <span className="update-banner-icon" aria-hidden="true">
            <Sparkles size={16} />
          </span>
          <span className="update-banner-text">
            MoviePlus search just got smarter
          </span>

          <span className="update-banner-actions">
            <button
              type="button"
              onClick={openUpdateInfo}
              className="update-btn update-btn-primary"
            >
              See what's new
            </button>
            <button
              type="button"
              onClick={dismissUpdate}
              className="update-btn update-btn-ghost"
            >
              Dismiss
            </button>
          </span>
        </div>
      )}

      {showUpdateInfo && (
        <div className="update-pull-up-overlay" onClick={closeUpdateInfo}>
          <div
            className="update-pull-up-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="updatePanelTitle"
          >
            <div className="update-panel-grip" aria-hidden="true" />

            <div className="update-header">
              <div>
                <span className="update-version-pill">
                  <Sparkles size={13} /> {CURRENT_UPDATE_CODE}
                </span>
                <h5 className="header-title" id="updatePanelTitle">
                  What's new
                </h5>
              </div>
              <button
                type="button"
                onClick={closeUpdateInfo}
                className="update-close-btn"
                aria-label="Close what's new"
              >
                <X size={18} />
              </button>
            </div>

            <div className="update-info-content">
              {updateSections.map((section) => {
                const Icon = section.icon;
                return (
                  <div key={section.title} className="update-section">
                    <div className="update-section-head">
                      <span className="update-section-icon" aria-hidden="true">
                        <Icon size={16} />
                      </span>
                      <h6>{section.title}</h6>
                    </div>
                    <ul>
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="update-panel-footer">
              <button
                type="button"
                onClick={closeUpdateInfo}
                className="update-btn update-btn-primary update-btn-wide"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
