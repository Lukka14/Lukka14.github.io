import { useEffect, useRef } from "react";
import Croppie from "croppie";
import 'croppie/croppie.css';

export default function CroppingModal({
    imageSrc,
    onCrop,
    onClose
}: {
    imageSrc: string;
    onCrop: (base64: string, file: File) => void;
    onClose: (isCropped?: boolean) => void;
}) {
    const croppieRef = useRef<HTMLDivElement>(null);
    const croppieInstanceRef = useRef<any>(null);

    useEffect(() => {
        if (imageSrc && croppieRef.current) {
            croppieInstanceRef.current = new Croppie(croppieRef.current, {
                showZoomer: true,
                enableOrientation: true,
                viewport: { width: 270, height: 270, type: "circle" },
                boundary: { width: 300, height: 300 }
            });

            croppieInstanceRef.current.bind({ url: imageSrc });
        }

        return () => {
            if (croppieInstanceRef.current) {
                croppieInstanceRef.current.destroy();
                croppieInstanceRef.current = null;
            }
        };
    }, [imageSrc]);

    const handleCrop = async () => {
        const base64 = await croppieInstanceRef.current.result({ type: "base64" });
        const blob = await (await fetch(base64)).blob();
        const file = new File([blob], "cropped.png", { type: "image/png" });
        onCrop(base64, file);
        onClose(true);
    };

    return (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog" style={{ marginTop: "25px" }}>
                <div className="modal-content bg-dark text-white">
                    <div className="modal-header">
                        <h5 className="modal-title">Crop Image</h5>
                        <button onClick={() => onClose(false)} className="btn-close btn-close-white"></button>
                    </div>
                    <div className="modal-body text-center">
                        <div ref={croppieRef}></div>
                    </div>
                    <div className="modal-footer">
                        <button style={{ color: "#f5f5f5" }}
                            onClick={() => onClose(false)} className="btn btn-outline-secondary">Cancel</button>
                        <button onClick={handleCrop} className="btn btn-outline-primary">Crop & Apply</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
