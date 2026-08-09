import { useRef } from "react";
import ModalHeader from "./ModalHeader";
import { switchModal } from "./modal-utils";

export default function AuthRequiredModal() {
    const closeButtonRef = useRef<any>(null);

    function handleClick(target: "login" | "register"): void {
        switchModal("authRequiredModal", target === "login" ? "loginModal" : "registerModal");
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
                                onClick={() => handleClick("login")}
                            >
                                Login
                            </button>
                            <button
                                className="btn btn-outline-light px-4"
                                onClick={() => handleClick("register")}
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