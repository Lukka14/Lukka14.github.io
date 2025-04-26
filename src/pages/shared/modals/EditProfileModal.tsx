import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ModalFooter from "./ModalFooter";
import ModalHeader from "./ModalHeader";
import axios from "axios";
import { Endpoints } from "../../../config/Config";
import Cookies from "js-cookie";
import { fetchMe } from "../../../services/MediaService";

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
    const accessToken = Cookies.get("accessToken");
    const [isLoading, setIsLoading] = useState(true);

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
                const me = await fetchMe();
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
            setProfileImage(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: ProfileFormData) => {
        if (!profileImage) {
            console.error('No profile image selected');
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

            // console.log(response);

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
            console.error("Error uploading profile image:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal fade" id="editProfileModal" tabIndex={-1} aria-labelledby="editProfileModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content" style={{
                    backgroundColor: "#1c2231"
                }}>
                    <ModalHeader title="Edit Profile" />
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
                                                    objectFit: "cover"
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
                                                    objectFit: "cover"
                                                }}
                                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.onerror = null;
                                                    target.src = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}&backgroundType=gradientLinear,solid`;
                                                }}
                                            />
                                        )}
                                    </div>

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
                    />
                </div>
            </div>
        </div>
    );
}