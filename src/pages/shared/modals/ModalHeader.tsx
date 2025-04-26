import { XIcon } from "lucide-react";

export default function ModalHeader({ title }: { title: string; }) {
    return <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel" style={{ color: "#f5f5f5" }}>{title}</h5>
        <button type="button" className="btn" data-bs-dismiss="modal" aria-label="Close" style={{ color: "#f5f5f5", padding: "0px" }}><XIcon /></button>
    </div>
}