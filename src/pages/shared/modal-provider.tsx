import DeleteAccountModal from "./modals/DeleteAccountModal";
import EditProfileModal from "./modals/EditProfileModal";

export default function ModalProvider() {
    return <>
        <EditProfileModal />
        <DeleteAccountModal />
    </>
}