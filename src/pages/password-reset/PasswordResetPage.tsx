import { useEffect, useMemo, useRef, useState } from "react";
import {
    AlertCircle,
    ArrowRight,
    Check,
    CheckCircle2,
    Eye,
    EyeOff,
    Lock,
    ShieldCheck,
    X,
} from "lucide-react";
import { Background } from "../main/Background";
import TopNavBar from "../shared/TopNavBar";
import { useParams, useNavigate } from "react-router-dom";
import { Endpoints } from "../../config/Config";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
    PASSWORD_LETTER_REGEX,
    PASSWORD_MAX,
    PASSWORD_MIN,
    extractApiError,
} from "../shared/modals/auth-validation";
import "../shared/modals/auth-modal.css";
import "./password-reset.css";

const REDIRECT_SECONDS = 5;

const passwordResetSchema = z
    .object({
        newPassword: z
            .string()
            .min(PASSWORD_MIN, `Password must be at least ${PASSWORD_MIN} characters`)
            .max(PASSWORD_MAX, `Password must not exceed ${PASSWORD_MAX} characters`)
            .regex(PASSWORD_LETTER_REGEX, "Password must contain at least one letter"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type PasswordResetFormData = z.infer<typeof passwordResetSchema>;

/** The two rules AuthUtils.isValidPassword enforces server-side. */
const REQUIREMENTS = [
    {
        label: `${PASSWORD_MIN}\u2013${PASSWORD_MAX} characters`,
        test: (value: string) =>
            value.length >= PASSWORD_MIN && value.length <= PASSWORD_MAX,
    },
    {
        label: "At least one letter",
        test: (value: string) => PASSWORD_LETTER_REGEX.test(value),
    },
];

export default function PasswordResetPage() {
    const [resetState, setResetState] = useState<"form" | "success" | "error">("form");
    const [countdown, setCountdown] = useState(REDIRECT_SECONDS);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const countdownRef = useRef<number | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset: resetForm,
    } = useForm<PasswordResetFormData>({
        resolver: zodResolver(passwordResetSchema),
        defaultValues: { newPassword: "", confirmPassword: "" },
        mode: "onChange",
    });

    const newPassword = watch("newPassword") ?? "";
    const confirmPassword = watch("confirmPassword") ?? "";

    const checks = useMemo(
        () => REQUIREMENTS.map((r) => ({ label: r.label, passed: r.test(newPassword) })),
        [newPassword]
    );
    const passwordsMatch =
        confirmPassword.length > 0 && newPassword === confirmPassword;

    useEffect(() => {
        if (!token) {
            setResetState("error");
        }
    }, [token]);

    // Clear the redirect countdown on unmount, otherwise it keeps firing navigate().
    useEffect(() => {
        return () => {
            if (countdownRef.current) window.clearInterval(countdownRef.current);
        };
    }, []);

    const onSubmit = async (data: PasswordResetFormData) => {
        setLoading(true);
        setErrorMessage("");

        try {
            await axios.post(Endpoints.RESET_PASSWORD, {
                token: token,
                newPassword: data.newPassword,
            });

            setResetState("success");
            resetForm();

            countdownRef.current = window.setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        if (countdownRef.current) window.clearInterval(countdownRef.current);
                        navigate("/");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (error: any) {
            if (error.response?.status === 401) {
                setErrorMessage("Invalid or expired token, please request a new one.");
            } else {
                setErrorMessage(
                    extractApiError(error, "Failed to reset password. Please try again.")
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Background url="https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true" />
            <TopNavBar onClick={() => { }} displaySearch={false} />

            <div className="pwreset-shell">
                <div className="pwreset-card">
                    <div className="pwreset-glow" />

                    <div className="pwreset-body">
                        <div className="pwreset-head">
                            <div
                                className={`pwreset-icon pwreset-icon--${
                                    resetState === "success"
                                        ? "success"
                                        : resetState === "error"
                                            ? "error"
                                            : "default"
                                }`}
                            >
                                {resetState === "form" && <Lock size={26} />}
                                {resetState === "success" && <CheckCircle2 size={26} />}
                                {resetState === "error" && <AlertCircle size={26} />}
                            </div>

                            <h1 className="auth-modal-title">
                                {resetState === "form" && "Reset your password"}
                                {resetState === "success" && "Password updated"}
                                {resetState === "error" && "Reset link problem"}
                            </h1>
                            <p className="auth-modal-subtitle">
                                {resetState === "form" &&
                                    "Choose a new password for your MoviePlus account."}
                                {resetState === "success" &&
                                    "You can now sign in with your new password."}
                                {resetState === "error" &&
                                    "This reset link is invalid or has expired."}
                            </p>
                        </div>

                        {resetState === "form" && (
                            <>
                                {errorMessage && (
                                    <div className="auth-alert auth-alert--error">
                                        <AlertCircle size={17} />
                                        <span>{errorMessage}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                                    <div className="auth-field">
                                        <label className="auth-label" htmlFor="newPassword">
                                            New password
                                        </label>
                                        <div
                                            className={`auth-input-wrap${
                                                errors.newPassword ? " is-invalid" : ""
                                            }`}
                                        >
                                            <Lock size={17} className="auth-input-icon" />
                                            <input
                                                {...register("newPassword")}
                                                type={showPassword ? "text" : "password"}
                                                id="newPassword"
                                                className="auth-input"
                                                placeholder="Enter a new password"
                                                autoComplete="new-password"
                                                disabled={loading}
                                            />
                                            <button
                                                type="button"
                                                className="auth-toggle-visibility"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                            </button>
                                        </div>

                                        {newPassword.length > 0 && (
                                            <ul className="auth-requirements">
                                                {checks.map((check) => (
                                                    <li
                                                        key={check.label}
                                                        className={`auth-requirement${
                                                            check.passed ? " is-passed" : ""
                                                        }`}
                                                    >
                                                        {check.passed ? <Check size={13} /> : <X size={13} />}
                                                        {check.label}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        {errors.newPassword && (
                                            <span className="auth-error-text">
                                                {errors.newPassword.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="auth-field">
                                        <label className="auth-label" htmlFor="confirmPassword">
                                            Confirm password
                                        </label>
                                        <div
                                            className={`auth-input-wrap${
                                                errors.confirmPassword ? " is-invalid" : ""
                                            }`}
                                        >
                                            <Lock size={17} className="auth-input-icon" />
                                            <input
                                                {...register("confirmPassword")}
                                                type={showConfirmPassword ? "text" : "password"}
                                                id="confirmPassword"
                                                className="auth-input"
                                                placeholder="Repeat the new password"
                                                autoComplete="new-password"
                                                disabled={loading}
                                            />
                                            <button
                                                type="button"
                                                className="auth-toggle-visibility"
                                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                                aria-label={
                                                    showConfirmPassword ? "Hide password" : "Show password"
                                                }
                                                tabIndex={-1}
                                            >
                                                {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword ? (
                                            <span className="auth-error-text">
                                                {errors.confirmPassword.message}
                                            </span>
                                        ) : (
                                            passwordsMatch && (
                                                <span className="auth-match-hint">
                                                    <Check size={14} />
                                                    Passwords match
                                                </span>
                                            )
                                        )}
                                    </div>

                                    <button type="submit" className="auth-submit" disabled={loading}>
                                        {loading && <span className="auth-spinner" />}
                                        {loading ? "Updating password..." : "Update password"}
                                    </button>
                                </form>

                                <p className="pwreset-tip">
                                    <ShieldCheck size={15} />
                                    You'll stay signed out on other devices until you sign in again.
                                </p>
                            </>
                        )}

                        {resetState === "success" && (
                            <>
                                <div className="auth-alert auth-alert--success">
                                    <CheckCircle2 size={17} />
                                    <span>
                                        Redirecting you home in {countdown} second
                                        {countdown === 1 ? "" : "s"}.
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className="auth-submit"
                                    onClick={() => navigate("/")}
                                >
                                    Go home now
                                    <ArrowRight size={17} />
                                </button>
                            </>
                        )}

                        {resetState === "error" && (
                            <>
                                <div className="auth-alert auth-alert--warning">
                                    <AlertCircle size={17} />
                                    <span>
                                        Reset links expire for security. Request a fresh one from the
                                        sign-in screen.
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className="auth-submit"
                                    onClick={() => navigate("/")}
                                >
                                    Back to home
                                    <ArrowRight size={17} />
                                </button>
                            </>
                        )}

                        <p className="auth-footer-text pwreset-support">
                            Having trouble? Email us at{" "}
                            <span className="pwreset-mail">team@movieplus.live</span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
