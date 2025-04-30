import { AlertTriangle } from "lucide-react";

export const WorkInProgress = () => {
    return (
        <div
            className="d-flex align-items-center justify-content-center"
            style={{
                minHeight: "180px",
                border: "1px dashed rgba(255,255,255,0.2)",
                borderRadius: "8px"
            }}
        >
            <div className="text-center">
                <AlertTriangle size={32} className="text-warning mb-2" />
                <h4 className="text-white">Work in Progress</h4>
            </div>
        </div>
    );
};