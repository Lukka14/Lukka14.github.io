import { XIcon } from "lucide-react";

export default function ModalHeader({ title, imgSrc }: { title: string; imgSrc?: string; }) {
    return <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel" style={{ color: "#f5f5f5", display: "flex", alignItems: "center", gap: "9px" }}>
            {imgSrc && <img src={imgSrc} style={{
                width: "25px",
                height: "25px"
            }} />}
            {title}</h5>
        <button type="button" className="btn" data-bs-dismiss="modal" aria-label="Close" style={{ color: "#f5f5f5", padding: "0px" }}><XIcon /></button>
    </div>
}