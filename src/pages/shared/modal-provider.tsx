import DeleteAccountModal from "./modals/DeleteAccountModal";
import EditProfileModal from "./modals/EditProfileModal";
import LoginModal from "./modals/LoginModal";

export default function ModalProvider() {
    return <>
        <EditProfileModal />
        <DeleteAccountModal />
        <LoginModal />
    </>
}