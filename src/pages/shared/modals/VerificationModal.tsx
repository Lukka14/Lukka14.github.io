import { useRef } from "react";
import ModalFooter from "./ModalFooter";
import ModalHeader from "./ModalHeader";

export default function VerificationModal() {
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    const handleClick = () => {
        window.location.href = "";
    };

    return (
        <div
            className="modal fade"
            id="verificationModal"
            tabIndex={-1}
            aria-labelledby="verificationModal"
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div
                    className="modal-content"
                    style={{ backgroundColor: "#1c2231" }}
                >
                    <ModalHeader title="Verify Your Email" imgSrc="/Email.png" />
                    <div className="modal-body" style={{ color: "#f5f5f5" }}>
                        <p>
                            A verification link has been sent to your email. Please check your inbox and follow the instructions to activate your account.
                        </p>
                        <p className="mt-3 text-warning">
                            Didn't get the email? Make sure to check your spam or junk folder.
                        </p>
                        <hr style={{ borderColor: "#555" }} />
                        <p className="mt-3">
                            Still having trouble? Contact us at{" "}
                            <a href="mailto:team@movieplus.live" style={{ color: "#4da6ff" }}>
                                team@movieplus.live
                            </a>
                            .
                        </p>
                    </div>
                    <ModalFooter closeButtonRef={closeButtonRef} closeModal={handleClick} />
                </div>
            </div>
        </div>
    );
}
