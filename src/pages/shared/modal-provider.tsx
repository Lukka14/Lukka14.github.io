import AuthRequiredModal from "./modals/AuthRequiredModal";
import ContactModal from "./modals/ContactModal";
import DeleteAccountModal from "./modals/DeleteAccountModal";
import EditProfileModal from "./modals/EditProfileModal";
import LoginModal from "./modals/LoginModal";
import RegisterModal from "./modals/RegisterModal";
import VerificationModal from "./modals/VerificationModal";

export default function ModalProvider() {
    return <>
        <EditProfileModal />
        <DeleteAccountModal />
        <LoginModal />
        <RegisterModal />
        <VerificationModal />
        <ContactModal />
        <AuthRequiredModal />
    </>
}