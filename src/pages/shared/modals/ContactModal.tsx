import { useState } from "react";
import { Check, Clock, Copy, LifeBuoy, Mail, XIcon } from "lucide-react";
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
                Our support inbox is still being set up, so we cannot reply just
                yet. This is the address it will live at.
              </p>
            </div>

            <div className="contact-address">
              <div className="contact-address-main">
                <span className="contact-address-value">{SUPPORT_EMAIL}</span>
                <span className="contact-soon-pill">
                  <Clock size={13} />
                  Coming soon
                </span>
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
                In the meantime, the FAQ on the help page covers the most common
                questions about playback, accounts and missing titles.
              </span>
            </div>

            <button
              type="button"
              className="auth-submit"
              data-bs-dismiss="modal"
              onClick={() => setCopied(false)}
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
