import { CircularProgress } from "@mui/material";

interface ModalFooterInterface {
    primaryBtnText?: string;
    onPrimaryClick?: (e: any) => void;
    closeButtonRef?: React.Ref<HTMLButtonElement>;
    primaryBtnClass?: string;
    loading?: boolean;
    closeModal?: () => void;
}

export default function ModalFooter({
    primaryBtnText,
    onPrimaryClick,
    closeButtonRef,
    loading,
    primaryBtnClass = "btn-outline-primary",
    closeModal,
}: ModalFooterInterface) {
    return (
        <div className="modal-footer">
            <button
                type="button"
                className="btn btn-outline-secondary"
                style={{ color: "#f5f5f5" }}
                data-bs-dismiss="modal"
                ref={closeButtonRef}
                onClick={closeModal}
            >
                Close
            </button>
            {onPrimaryClick && <button
                type="button"
                className={`btn d-flex align-items-center  justify-content ${primaryBtnClass}`}
                onClick={onPrimaryClick}
            >
                {loading && <CircularProgress size={15} style={{
                    marginRight: "10px"
                }} />}
                {loading ? primaryBtnText == "Login" ? "Logging in..." : primaryBtnText : primaryBtnText}
            </button>}
        </div>
    );
}
