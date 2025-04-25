interface ModalFooterInterface {
    primaryBtnText: string;
    onPrimaryClick: (e: any) => void;
    closeButtonRef: React.Ref<HTMLButtonElement>;
    primaryBtnClass?: string;
}

export default function ModalFooter({
    primaryBtnText,
    onPrimaryClick,
    closeButtonRef,
    primaryBtnClass = "btn-outline-primary"
}: ModalFooterInterface) {
    return (
        <div className="modal-footer">
            <button
                type="button"
                className="btn btn-outline-secondary"
                style={{ color: "#f5f5f5" }}    
                data-bs-dismiss="modal"
                ref={closeButtonRef}
            >
                Close
            </button>
            <button
                type="button"
                className={`btn ${primaryBtnClass}`}
                onClick={onPrimaryClick}
            >
                {primaryBtnText}
            </button>
        </div >
    );
}
