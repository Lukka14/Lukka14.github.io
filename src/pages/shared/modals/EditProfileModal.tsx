import { useRef, useState } from "react";
import { AlertCircle, ImageUp, XIcon } from "lucide-react";
import axios from "axios";
import { Endpoints } from "../../../config/Config";
import { getAccessToken, getUsername } from "../../../services/UserService";
import 'croppie/croppie.css';
import CroppingModal from "./CroppingModal";
import "./auth-modal.css";

export default function EditProfileModal() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showCropper, setShowCropper] = useState(false);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const username = getUsername();

    const fallbackAvatar = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}&backgroundType=gradientLinear,solid`;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setErrorMessage("");
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
        e.target.value = "";
    };

    const onSubmit = async () => {
        if (!profileImage) {
            setErrorMessage("Choose an image first.");
            return;
        }

        setIsSaving(true);
        setErrorMessage("");

        try {
            const accessToken = await getAccessToken();
            if (!accessToken) {
                setErrorMessage("Your session expired. Please sign in again.");
                return;
            }

            const formData = new FormData();
            formData.append('image', profileImage);

            await axios.post(Endpoints.IMG_UPLOAD, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            window.dispatchEvent(
                new CustomEvent('profile-updated', {
                    detail: { timestamp: Date.now(), success: true }
                })
            );

            closeButtonRef.current?.click();
            resetState();
        } catch (error: any) {
            console.error(error);
            setErrorMessage(
                error?.response?.data?.detail ||
                "We could not upload that image. Please try again."
            );
        } finally {
            setIsSaving(false);
        }
    };

    const resetState = () => {
        setImagePreview(null);
        setProfileImage(null);
        setErrorMessage("");
    };

    return (
        <div
            className="modal fade auth-modal"
            id="editProfileModal"
            tabIndex={-1}
            aria-labelledby="editProfileModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="auth-modal-glow" />

                    <button
                        type="button"
                        className="auth-modal-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        ref={closeButtonRef}
                        onClick={resetState}
                    >
                        <XIcon size={17} />
                    </button>

                    <div className="auth-modal-body">
                        <div className="auth-modal-head">
                            <span className="auth-required-icon">
                                <ImageUp size={24} />
                            </span>
                            <h5 className="auth-modal-title" id="editProfileModalLabel">
                                Update your picture
                            </h5>
                            <p className="auth-modal-subtitle">
                                Pick an image and crop it to fit. It shows up next to your name
                                across MoviePlus.
                            </p>
                        </div>

                        {errorMessage && (
                            <div className="auth-alert auth-alert--error" role="alert">
                                <AlertCircle size={17} />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <div className="edit-profile-preview">
                            <div className="edit-profile-ring">
                                <img
                                    src={imagePreview ?? `${Endpoints.IMG_VIEW}/${username}.webp`}
                                    alt="Profile preview"
                                    className="edit-profile-avatar"
                                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null;
                                        target.src = fallbackAvatar;
                                    }}
                                />
                            </div>
                            {imagePreview && (
                                <span className="edit-profile-badge">New picture ready</span>
                            )}
                        </div>

                        {showCropper && imagePreview && (
                            <CroppingModal
                                imageSrc={imagePreview}
                                onCrop={(base64, file) => {
                                    setImagePreview(base64);
                                    setProfileImage(file);
                                    setShowCropper(false);
                                }}
                                onClose={(isCropped) => {
                                    setShowCropper(false);
                                    if (!isCropped) {
                                        setImagePreview(null);
                                        setProfileImage(null);
                                    }
                                }}
                            />
                        )}

                        <label htmlFor="profileImage" className="edit-profile-pick">
                            <ImageUp size={17} />
                            {imagePreview ? "Choose a different image" : "Choose an image"}
                        </label>
                        <input
                            type="file"
                            className="d-none"
                            id="profileImage"
                            name="profileImage"
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                        <div className="edit-profile-actions">
                            <button
                                type="button"
                                className="auth-submit"
                                onClick={onSubmit}
                                disabled={!profileImage || isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <span className="auth-spinner" aria-hidden="true" />
                                        Uploading...
                                    </>
                                ) : (
                                    "Save picture"
                                )}
                            </button>

                            <button
                                type="button"
                                className="auth-required-secondary"
                                data-bs-dismiss="modal"
                                onClick={resetState}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
