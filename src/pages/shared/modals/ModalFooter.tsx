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
    primaryBtnClass = "btn-primary"
}: ModalFooterInterface) {
    return (
        <div className="modal-footer">
            <button
                type="button"
                className="btn btn-secondary"
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
