import { useRef } from "react";
import ModalFooter from "./ModalFooter";
import ModalHeader from "./ModalHeader";
import { useNavigate } from "react-router-dom";

export default function AuthRequiredModal() {
    const closeButtonRef = useRef<any>(null);
    function handleClick(arg0: number): void {
        if (arg0 == 1) {
            closeButtonRef?.current?.click();
            const button = document.createElement("button");
            button.type = "button";
            button.setAttribute("data-bs-toggle", "modal");
            button.setAttribute("data-bs-target", "#loginModal");
            button.style.display = "none";

            document.body.appendChild(button);
            button.click();
            document.body.removeChild(button);
        } else {
            closeButtonRef?.current?.click();
            window.location.href = "/#/register";
        }
    }

    return (
        <div
            className="modal fade"
            id="authRequiredModal"
            tabIndex={-1}
            aria-labelledby="authRequiredModal"
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div
                    className="modal-content"
                    style={{ backgroundColor: "#1c2231" }}
                >
                    <ModalHeader title="🔐 Authorization Required" closeButtonRef={closeButtonRef} />
                    <div className="modal-body" style={{ color: "#f5f5f5" }}>
                        <p className="text-center mb-4" id="content">
                        </p>

                        <div className="d-flex justify-content-center gap-3 mb-4">
                            <button
                                className="btn btn-outline-primary"
                                onClick={() => handleClick(1)}
                            >
                                Login
                            </button>
                            <button
                                className="btn btn-outline-light px-4"
                                onClick={() => handleClick(2)}
                            >
                                Register
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}