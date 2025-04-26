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
        <p className="h4 text-white">{value}</p>
        <p className="small text-muted">{firstToUppercase(label)}</p>
    </div>
}