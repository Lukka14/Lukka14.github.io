import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Background } from "../main/Background";
import PrimarySearchAppBar from "../shared/TopNavBar";
import { fetchMedia } from "../../services/MediaService";
import { Media } from "../../models/Movie";
import { Edit } from "lucide-react";
import { getCurrentUser, getUsername, getAccessToken } from "../../services/UserService";
import { Endpoints } from "../../config/Config";
import axios from "axios";

const passwordSchema = z
    .object({
        currentPassword: z.string(),
        newPassword: z
            .string()
            .min(6, "New password must be at least 6 characters")
            .regex(/^(?=.*[a-zA-Z])[\x00-\x7F]+$/, "Must contain at least one letter"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });


type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
    const [media, setMedias] = useState<Media[]>([]);
    const username = getUsername();
    const [avatarVersion, setAvatarVersion] = useState(Date.now());
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [user, setUser] = useState<any>({
        username: username,
        avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}&backgroundType=gradientLinear,solid`,
        createdAt: new Date("2023-01-01"),
    });

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
        mode: "onChange",
    });

    useEffect(() => {
        const newAvatarUrl = `${Endpoints.IMG_VIEW}/${username}.webp`;
        setAvatarUrl(newAvatarUrl);
    }, [username, avatarVersion]);

    useEffect(() => {
        async function fetchUser() {
            const me = await getCurrentUser();
            if (me?.username?.toLowerCase() === username?.toLowerCase()) {
                setUser((prev: any) => {
                    const updated = { ...prev, ...me };
                    setAvatarUrl(me?.avatarUrl || updated.avatar);
                    return updated;
                });
            } else {
                navigate("/#/");
            }
        }
        if (username) fetchUser();
        else navigate("/#/");
    }, [username]);

    useEffect(() => {
        const handleProfileUpdated = (event: Event) => {
            setAvatarVersion((_) => {
                const customEvent = event as CustomEvent;
                return customEvent.detail?.timestamp || Date.now();
            });
        };
        window.addEventListener("profile-updated", handleProfileUpdated);
        return () => window.removeEventListener("profile-updated", handleProfileUpdated);
    }, []);

    const handleSearch = (query: string) => {
        fetchMedia(query)
            .then(setMedias)
            .catch((err) => console.error(err));
    };

    const onPasswordSubmit = async (data: PasswordFormData) => {
        setLoading(true);
        setPasswordMessage(null);

        try {
            const accessToken = await getAccessToken();

            if (!accessToken) {
                setPasswordMessage({
                    text: "Not authenticated. Please log in again.",
                    type: 'error'
                });
                return;
            }

            const response = await axios.post(
                `${Endpoints.CHANGE_PASSWORD}`,
                {
                    oldPassword: data.currentPassword,
                    newPassword: data.newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );

            setPasswordMessage({
                text: response.data.detail || "Password changed successfully!",
                type: 'success'
            });
            reset();

        } catch (error: any) {
            console.error(error);

            let errorMessage = "Failed to change password. Please try again later.";

            if (error.response) {
                if (error.response.data && error.response.data.detail) {
                    errorMessage = error.response.data.detail;
                } else if (error.response.status === 401) {
                    errorMessage = "Current password is incorrect.";
                }
            }

            setPasswordMessage({
                text: errorMessage,
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Background url="https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true" />
            <PrimarySearchAppBar onClick={handleSearch} displaySearch={false} />

            <div className="container-xl px-4 mt-4">
                <div className="card mb-4" style={cardStyle}>
                    <div className="card-header">
                        <h5 className="font-weight-bold">Change Profile Picture</h5>
                    </div>
                    <div className="card-body">
                        <div className="mb-4 text-center">
                            <img
                                key={`avatar-${avatarVersion}`}
                                src={avatarUrl}
                                alt="Profile"
                                className="rounded-circle border-2 border-primary"
                                style={{
                                    width: "120px",
                                    height: "120px",
                                    objectFit: "cover",
                                    border: "1px solid white",
                                }}
                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = user.avatar;
                                }}
                            />
                            <div className="d-flex justify-content-center mt-4">
                                <button
                                    className="btn btn-outline-primary px-4 py-2 d-flex align-items-center gap-2"
                                    data-bs-toggle="modal"
                                    data-bs-target="#editProfileModal"
                                >
                                    <Edit size={16} />
                                    EDIT PROFILE
                                </button>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="small mb-1" htmlFor="newPassword">Username</label>
                            <input
                                className={`form-control`}
                                id="username"
                                type="text"
                                value={user.username}
                                disabled={true}
                                style={{
                                    cursor: "not-allowed"
                                }}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="small mb-1" htmlFor="newPassword">Email</label>
                            <input
                                className={`form-control`}
                                id="email"
                                type="email"
                                value={user.email}
                                disabled={true}
                                style={{
                                    cursor: "not-allowed"
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="card mt-4 mb-5" style={cardStyle}>
                    <div className="card-header">
                        <h5 className="font-weight-bold">Change Password</h5>
                    </div>
                    <div className="card-body">
                        {passwordMessage && (
                            <div
                                className={`alert ${passwordMessage.type === 'success' ? 'alert-success' : 'alert-danger'} mb-4`}
                                role="alert"
                            >
                                {passwordMessage.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onPasswordSubmit)}>
                            <div className="mb-3">
                                <label className="small mb-1" htmlFor="currentPassword">Current Password</label>
                                <input
                                    className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
                                    id="currentPassword"
                                    type="password"
                                    placeholder="Enter current password"
                                    {...register("currentPassword")}
                                    disabled={loading}
                                />
                                {errors.currentPassword && (
                                    <div className="small text-danger">{errors.currentPassword.message}</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="small mb-1" htmlFor="newPassword">New Password</label>
                                <input
                                    className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                                    id="newPassword"
                                    type="password"
                                    placeholder="Enter new password"
                                    {...register("newPassword")}
                                    disabled={loading}
                                />
                                {errors.newPassword && (
                                    <div className="small text-danger">{errors.newPassword.message}</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="small mb-1" htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm new password"
                                    {...register("confirmPassword")}
                                    disabled={loading}
                                />
                                {errors.confirmPassword && (
                                    <div className="small text-danger">{errors.confirmPassword.message}</div>
                                )}
                            </div>

                            <button
                                className="btn btn-outline-primary"
                                type="submit"
                                disabled={!isValid || loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Changing Password...
                                    </>
                                ) : (
                                    "Change Password"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

const cardStyle = {
    padding: "24px",
    marginTop: "24px",
    background: "rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(8px)",
    borderRadius: "8px",
    color: "#f5f5f5",
};