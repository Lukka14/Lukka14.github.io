import { useState } from "react";
import { Check, Copy, LifeBuoy, Mail, Send, XIcon } from "lucide-react";
import "./auth-modal.css";
import "./contact-modal.css";

export const SUPPORT_EMAIL = "team@movieplus.live";

export default function ContactModal() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="modal fade auth-modal"
      id="contactModalWindow"
      tabIndex={-1}
      aria-labelledby="contactModalWindowLabel"
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
            onClick={() => setCopied(false)}
          >
            <XIcon size={17} />
          </button>

          <div className="auth-modal-body">
            <div className="auth-modal-head">
              <span className="contact-modal-badge">
                <Mail size={22} />
              </span>
              <h5 className="auth-modal-title" id="contactModalWindowLabel">
                Contact us
              </h5>
              <p className="auth-modal-subtitle">
                Found a bug, a broken stream or a missing title? Email us and
                we'll get back to you.
              </p>
            </div>

            <div className="contact-address">
              <div className="contact-address-main">
                <span className="contact-address-label">Support inbox</span>
                <a
                  className="contact-address-value"
                  href={`mailto:${SUPPORT_EMAIL}`}
                >
                  {SUPPORT_EMAIL}
                </a>
              </div>
              <button
                type="button"
                className="contact-copy-btn"
                onClick={copyEmail}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="contact-note">
              <LifeBuoy size={17} />
              <span>
                The FAQ on the help page covers the most common questions about
                playback, accounts and missing titles — it's often the fastest
                answer.
              </span>
            </div>

            <a
              className="auth-submit contact-mail-btn"
              href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
                "MoviePlus support"
              )}`}
            >
              <Send size={16} />
              Email support
            </a>

            <button
              type="button"
              className="auth-link contact-dismiss"
              data-bs-dismiss="modal"
              onClick={() => setCopied(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
