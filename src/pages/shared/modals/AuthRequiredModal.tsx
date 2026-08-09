import { useEffect, useRef, useState } from "react";
import { Bookmark, Heart, LogIn, UserPlus, XIcon } from "lucide-react";
import {
  AUTH_REQUIRED_EVENT,
  AuthRequiredDetail,
  AuthRequiredIntent,
  switchModal,
} from "./modal-utils";
import "./auth-modal.css";

const COPY: Record<AuthRequiredIntent, { title: string; list: string }> = {
  fav: { title: "Save this to your favourites", list: "favourites" },
  watch: { title: "Add this to your watchlist", list: "watchlist" },
};

export default function AuthRequiredModal() {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [detail, setDetail] = useState<AuthRequiredDetail>({
    intent: "fav",
    subject: "this title",
  });

  // The trigger lives in a plain service module rather than the React tree, so
  // it hands over context through an event instead of the old approach of
  // writing innerHTML into a hard-coded #content element.
  useEffect(() => {
    const handler = (event: Event) => {
      const next = (event as CustomEvent<AuthRequiredDetail>).detail;
      if (next) setDetail(next);
    };

    window.addEventListener(AUTH_REQUIRED_EVENT, handler);
    return () => window.removeEventListener(AUTH_REQUIRED_EVENT, handler);
  }, []);

  const copy = COPY[detail.intent] ?? COPY.fav;
  const Icon = detail.intent === "watch" ? Bookmark : Heart;

  const handleClick = (target: "login" | "register") => {
    switchModal(
      "authRequiredModal",
      target === "login" ? "loginModal" : "registerModal"
    );
  };

  return (
    <div
      className="modal fade auth-modal"
      id="authRequiredModal"
      tabIndex={-1}
      aria-labelledby="authRequiredModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="auth-modal-glow" />

          <button
            type="button"
            className="auth-modal-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            ref={closeButtonRef}
          >
            <XIcon size={17} />
          </button>

          <div className="auth-modal-body">
            <div className="auth-modal-head">
              <span className="auth-required-icon">
                <Icon size={24} />
              </span>
              <h5 className="auth-modal-title" id="authRequiredModalLabel">
                {copy.title}
              </h5>
              <p className="auth-modal-subtitle">
                Create a free account to keep {detail.subject} in your{" "}
                {copy.list} and pick up where you left off on any device.
              </p>
            </div>

            <div className="auth-required-actions">
              <button
                type="button"
                className="auth-submit"
                onClick={() => handleClick("register")}
              >
                <UserPlus size={17} />
                Create free account
              </button>

              <button
                type="button"
                className="auth-required-secondary"
                onClick={() => handleClick("login")}
              >
                <LogIn size={17} />
                I already have an account
              </button>
            </div>

            <p className="auth-required-note">
              It takes less than a minute and it is completely free.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
