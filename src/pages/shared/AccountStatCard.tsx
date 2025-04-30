import { AlertTriangle } from "lucide-react";
import { firstToUppercase } from "../../utils/Utils";

interface AccountStatCard {
    value: string | number;
    label: string;
}

export default function AccountStatCard({
    value,
    label
}: AccountStatCard) {
    return <div className="text-center">
        <p className="h6 text-white">WiP <AlertTriangle size={24} className="text-warning mb-2" /></p>
        <p className="small text-muted">{firstToUppercase(label)}</p>
    </div>
}