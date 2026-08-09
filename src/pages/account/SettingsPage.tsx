import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    AlertCircle,
    ArrowLeft,
    AtSign,
    CheckCircle2,
    Eye,
    EyeOff,
    ImageUp,
    KeyRound,
    Lock,
    UserRound,
} from "lucide-react";
import axios from "axios";
import { Background } from "../main/Background";
import PrimarySearchAppBar from "../shared/TopNavBar";
import { fetchMedia } from "../../services/MediaService";
import { Media } from "../../models/Movie";
import { getCurrentUser, getUsername, getAccessToken } from "../../services/UserService";
import { Endpoints } from "../../config/Config";
import { openModal } from "../shared/modals/modal-utils";
import "../shared/modals/auth-modal.css";
import "./settings-page.css";

const BACKDROP =
    "https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true";

const passwordSchema = z
    .object({
        currentPassword: z.string().min(1, "Enter your current password"),
        newPassword: z
            .string()
            .min(6, "New password must be at least 6 characters")
            .max(50, "New password must not exceed 50 characters")
            .regex(/^(?=.*[a-zA-Z])[\x00-\x7F]+$/, "Must contain at least one letter")
            .refine((val) => val.trim().length > 0, "New password cannot be empty"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
    const [, setMedias] = useState<Media[]>([]);
    const username = getUsername();
    const [avatarVersion, setAvatarVersion] = useState(Date.now());
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{
        text: string;
        type: "success" | "error";
    } | null>(null);
    const [user, setUser] = useState<any>({
        username: username,
        avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}&backgroundType=gradientLinear,solid`,
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
        setAvatarUrl(`${Endpoints.IMG_VIEW}/${username}.webp`);
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
                navigate("/");
            }
        }
        if (username) fetchUser();
        else navigate("/");
    }, [username]);

    useEffect(() => {
        const handleProfileUpdated = (event: Event) => {
            const customEvent = event as CustomEvent;
            setAvatarVersion(customEvent.detail?.timestamp || Date.now());
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
                    type: "error",
                });
                return;
            }

            const response = await axios.post(
                `${Endpoints.CHANGE_PASSWORD}`,
                {
                    oldPassword: data.currentPassword,
                    newPassword: data.newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            setPasswordMessage({
                text: response.data.detail || "Password changed successfully.",
                type: "success",
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

            setPasswordMessage({ text: errorMessage, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-page">
            <Background url={BACKDROP} />
            <div className="settings-scrim" />
            <PrimarySearchAppBar onClick={handleSearch} displaySearch={false} />

            <div className="settings-shell">
                {user.username && (
                    <Link to={`/profile/${user.username}`} className="settings-back">
                        <ArrowLeft size={16} />
                        Back to profile
                    </Link>
                )}

                <div>
                    <h1 className="settings-page-title">Account settings</h1>
                    <p className="settings-page-subtitle">
                        Manage how you appear on MoviePlus and keep your account secure.
                    </p>
                </div>

                <section className="settings-card">
                    <div className="settings-card-head">
                        <span className="settings-card-icon">
                            <UserRound size={19} />
                        </span>
                        <div>
                            <h2 className="settings-card-title">Profile</h2>
                            <p className="settings-card-desc">
                                Your picture is shown next to your name across the site.
                            </p>
                        </div>
                    </div>

                    <div className="settings-avatar-row">
                        <div className="settings-avatar-ring">
                            <img
                                key={`avatar-${avatarVersion}`}
                                src={avatarUrl}
                                alt={`${user.username ?? "Your"} avatar`}
                                className="settings-avatar"
                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = user.avatar;
                                }}
                            />
                        </div>

                        <div className="settings-avatar-copy">
                            <p>
                                Square images work best. You can crop your picture after
                                choosing it.
                            </p>
                            <button
                                type="button"
                                className="settings-ghost-btn"
                                onClick={() => openModal("editProfileModal")}
                            >
                                <ImageUp size={16} />
                                Change picture
                            </button>
                        </div>
                    </div>

                    <div className="settings-readonly-grid settings-readonly">
                        <div className="auth-field">
                            <label className="auth-label" htmlFor="username">
                                Username
                            </label>
                            <div className="auth-input-wrap">
                                <UserRound size={17} className="auth-input-icon" />
                                <input
                                    className="auth-input"
                                    id="username"
                                    type="text"
                                    value={user.username ?? ""}
                                    readOnly
                                    disabled
                                />
                                <Lock size={15} className="auth-input-icon" />
                            </div>
                        </div>

                        <div className="auth-field">
                            <label className="auth-label" htmlFor="email">
                                Email
                            </label>
                            <div className="auth-input-wrap">
                                <AtSign size={17} className="auth-input-icon" />
                                <input
                                    className="auth-input"
                                    id="email"
                                    type="email"
                                    value={user.email ?? ""}
                                    readOnly
                                    disabled
                                />
                                <Lock size={15} className="auth-input-icon" />
                            </div>
                        </div>
                    </div>

                    <span className="settings-hint">
                        Your username and email cannot be changed yet. Contact support if you
                        need them updated.
                    </span>
                </section>

                <section className="settings-card">
                    <div className="settings-card-head">
                        <span className="settings-card-icon">
                            <KeyRound size={19} />
                        </span>
                        <div>
                            <h2 className="settings-card-title">Password</h2>
                            <p className="settings-card-desc">
                                Choose a password you do not use anywhere else.
                            </p>
                        </div>
                    </div>

                    {passwordMessage && (
                        <div
                            className={`auth-alert ${passwordMessage.type === "success"
                                ? "auth-alert--success"
                                : "auth-alert--error"
                                }`}
                            role="alert"
                        >
                            {passwordMessage.type === "success" ? (
                                <CheckCircle2 size={17} />
                            ) : (
                                <AlertCircle size={17} />
                            )}
                            <span>{passwordMessage.text}</span>
                        </div>
                    )}

                    <form className="settings-form" onSubmit={handleSubmit(onPasswordSubmit)} noValidate>
                        <div className="auth-field">
                            <label className="auth-label" htmlFor="currentPassword">
                                Current password
                            </label>
                            <div
                                className={`auth-input-wrap${errors.currentPassword ? " is-invalid" : ""
                                    }`}
                            >
                                <Lock size={17} className="auth-input-icon" />
                                <input
                                    className="auth-input"
                                    id="currentPassword"
                                    type={showCurrent ? "text" : "password"}
                                    placeholder="Enter current password"
                                    autoComplete="current-password"
                                    disabled={loading}
                                    {...register("currentPassword")}
                                />
                                <button
                                    type="button"
                                    className="auth-toggle-visibility"
                                    onClick={() => setShowCurrent((v) => !v)}
                                    aria-label={showCurrent ? "Hide password" : "Show password"}
                                >
                                    {showCurrent ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                            {errors.currentPassword && (
                                <span className="auth-error-text">
                                    {errors.currentPassword.message}
                                </span>
                            )}
                        </div>

                        <div className="auth-field">
                            <label className="auth-label" htmlFor="newPassword">
                                New password
                            </label>
                            <div
                                className={`auth-input-wrap${errors.newPassword ? " is-invalid" : ""}`}
                            >
                                <KeyRound size={17} className="auth-input-icon" />
                                <input
                                    className="auth-input"
                                    id="newPassword"
                                    type={showNew ? "text" : "password"}
                                    placeholder="Enter new password"
                                    autoComplete="new-password"
                                    disabled={loading}
                                    {...register("newPassword")}
                                />
                                <button
                                    type="button"
                                    className="auth-toggle-visibility"
                                    onClick={() => setShowNew((v) => !v)}
                                    aria-label={showNew ? "Hide password" : "Show password"}
                                >
                                    {showNew ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <span className="auth-error-text">{errors.newPassword.message}</span>
                            )}
                        </div>

                        <div className="auth-field">
                            <label className="auth-label" htmlFor="confirmPassword">
                                Confirm new password
                            </label>
                            <div
                                className={`auth-input-wrap${errors.confirmPassword ? " is-invalid" : ""
                                    }`}
                            >
                                <KeyRound size={17} className="auth-input-icon" />
                                <input
                                    className="auth-input"
                                    id="confirmPassword"
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="Repeat new password"
                                    autoComplete="new-password"
                                    disabled={loading}
                                    {...register("confirmPassword")}
                                />
                                <button
                                    type="button"
                                    className="auth-toggle-visibility"
                                    onClick={() => setShowConfirm((v) => !v)}
                                    aria-label={showConfirm ? "Hide password" : "Show password"}
                                >
                                    {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <span className="auth-error-text">
                                    {errors.confirmPassword.message}
                                </span>
                            )}
                        </div>

                        <p className="settings-requirements">
                            At least 6 characters, including one letter.
                        </p>

                        <button className="auth-submit" type="submit" disabled={!isValid || loading}>
                            {loading ? (
                                <>
                                    <span className="auth-spinner" aria-hidden="true" />
                                    Updating...
                                </>
                            ) : (
                                "Update password"
                            )}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}
