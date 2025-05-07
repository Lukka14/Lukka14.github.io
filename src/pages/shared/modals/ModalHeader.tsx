import { XIcon } from "lucide-react";

export default function ModalHeader({ title, imgSrc, closeButtonRef, closeModal }: {
    title: string; imgSrc?: string; closeButtonRef?: React.Ref<HTMLButtonElement>; closeModal?: () => void;
}) {
    return <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel" style={{ color: "#f5f5f5", display: "flex", alignItems: "center", gap: "9px" }}>
            {imgSrc && <img src={imgSrc} style={{
                width: "25px",
                height: "25px"
            }} />}
            {title}</h5>
        {closeButtonRef ? <button onClick={closeModal} ref={closeButtonRef} type="button" className="btn" data-bs-dismiss="modal" aria-label="Close" style={{ color: "#f5f5f5", padding: "0px" }}><XIcon /></button> : <button onClick={closeModal} type="button" className="btn" data-bs-dismiss="modal" aria-label="Close" style={{ color: "#f5f5f5", padding: "0px" }}><XIcon /></button>}
    </div>
}