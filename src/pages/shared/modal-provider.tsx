import AuthRequiredModal from "./modals/AuthRequiredModal";
import ContactModalWindow from "./modals/ContactModalWindow";
import DeleteAccountModal from "./modals/DeleteAccountModal";
import EditProfileModal from "./modals/EditProfileModal";
import LoginModal from "./modals/LoginModal";
import VerificationModal from "./modals/VerificationModal";

export default function ModalProvider() {
    return <>
        <EditProfileModal />
        <DeleteAccountModal />
        <LoginModal />
        <VerificationModal />
        <ContactModalWindow />
        <AuthRequiredModal />
    </>
}