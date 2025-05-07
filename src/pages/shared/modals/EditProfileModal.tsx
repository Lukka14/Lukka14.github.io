import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ModalFooter from "./ModalFooter";
import ModalHeader from "./ModalHeader";
import axios from "axios";
import { Endpoints } from "../../../config/Config";
import Cookies from "js-cookie";
import { getAccessToken, getCurrentUser } from "../../../services/UserService";
import 'croppie/croppie.css';
import Croppie from "croppie";
import CroppingModal from "./CroppingModal";

const profileSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username cannot exceed 50 characters"),
    email: z.string().email("Please enter a valid email address"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function EditProfileModal() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const username = Cookies.get("username");
    const [isLoading, setIsLoading] = useState(true);
    const [showCropper, setShowCropper] = useState(false);

    const [user, setUser] = useState({
        username,
        email: username + "@example.com",
        avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}&backgroundType=gradientLinear,solid`,
        createdAt: new Date("2023-01-01")
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: username || "",
            email: username + "@example.com" || ""
        }
    });

    useEffect(() => {
        async function fetchUser() {
            setIsLoading(true);
            try {
                const me = await getCurrentUser();
                if (me?.username && me?.username === username) {
                    setUser((prev) => ({ ...prev, ...me }));
                    reset({
                        username: me.username,
                        email: me.email
                    });
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchUser();
    }, [username, reset]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
        e.target.value = "";
    };


    const onSubmit = async (data: ProfileFormData) => {
        let accessToken: string | undefined = await getAccessToken();

        const isValidAccessToken = (token: string | undefined) => {
            return token && token !== "expired";
        };

        if (!isValidAccessToken(accessToken)) {
            accessToken = await getAccessToken();
            if (!accessToken) {
                return;
            }
        }

        if (!profileImage) {
            return;
        }

        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('image', profileImage);

            const response = await axios.post(Endpoints.IMG_UPLOAD, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            const a = new CustomEvent('profile-updated', {
                detail: {
                    timestamp: Date.now(),
                    success: true
                }
            });
            window.dispatchEvent(a);

            if (closeButtonRef.current) {
                closeButtonRef.current.click();
            }

            reset();
            setImagePreview(null);
            setProfileImage(null);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const closeEditModal = () => {
        setImagePreview(null);
        setProfileImage(null);
    }

    return (
        <div className="modal fade" id="editProfileModal" tabIndex={-1} aria-labelledby="editProfileModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content" style={{
                    backgroundColor: "#1c2231"
                }}>
                    <ModalHeader title="Edit Profile" closeModal={closeEditModal} />
                    <div className="modal-body">
                        {isLoading ? (
                            <div className="text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <form id="profileForm" onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-3 text-center">
                                    <div className="profile-image-container mb-3">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Profile"
                                                className="rounded-circle border-2 border-primary"
                                                style={{
                                                    width: "120px",
                                                    height: "120px",
                                                    objectFit: "cover",
                                                    border: "1px solid white"
                                                }}
                                            />
                                        ) : (
                                            <img
                                                src={`${Endpoints.IMG_VIEW}/${username}.webp`}
                                                alt="Profile"
                                                className="rounded-circle border-2 border-primary"
                                                style={{
                                                    width: "120px",
                                                    height: "120px",
                                                    objectFit: "cover",
                                                    border: "1px solid white"
                                                }}
                                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.onerror = null;
                                                    target.src = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}&backgroundType=gradientLinear,solid`;
                                                }}
                                            />
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
                                                if (!isCropped) setImagePreview(null);
                                                if (!isCropped) setProfileImage(null);
                                            }}
                                        />
                                    )}

                                    <div className="mb-3">
                                        <label htmlFor="profileImage" className="btn btn-outline-primary btn-sm">
                                            <i className="bi bi-upload me-1"></i>
                                            Change Profile Picture
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control d-none"
                                            id="profileImage"
                                            name="profileImage"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                </div>

                                {/* <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                            id="username"
                                            placeholder="Username"
                                            {...register("username")}
                                        />
                                    </div>
                                    {errors.username && (
                                        <div className="invalid-feedback d-block">{errors.username.message}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address</label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        id="email"
                                        placeholder="name@example.com"
                                        {...register("email")}
                                    />
                                    {errors.email && (
                                        <div className="invalid-feedback d-block">{errors.email.message}</div>
                                    )}
                                </div> */}
                            </form>
                        )}
                    </div>
                    <ModalFooter
                        primaryBtnText="Save changes"
                        onPrimaryClick={handleSubmit(onSubmit)}
                        closeButtonRef={closeButtonRef}
                        closeModal={closeEditModal}
                    />
                </div>
            </div>
        </div>
    );
}