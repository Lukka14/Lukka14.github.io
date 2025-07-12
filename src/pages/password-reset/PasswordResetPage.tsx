import React, { useState, useEffect, useRef } from "react";
import { CheckCircle, AlertTriangle, Lock } from "lucide-react";
import { Background } from "../main/Background";
import { fetchOnlyMovies } from "../../services/MediaService";
import { Media } from "../../models/Movie";
import TopNavBar from "../shared/TopNavBar";
import { LoadingSpinner } from "../main/LoadingSpinner";
import { useParams, useNavigate } from "react-router-dom";
import { Endpoints } from "../../config/Config";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const passwordResetSchema = z
    .object({
        newPassword: z
            .string()
            .min(6, "Password must be at least 6 characters")
            .max(50, "Password must not exceed 50 characters")
            .regex(/^(?=.*[a-zA-Z])[\x00-\x7F]+$/, "Password must contain at least one letter")
            .refine((val) => val.trim().length > 0, "Password cannot be empty"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type PasswordResetFormData = z.infer<typeof passwordResetSchema>;

export default function PasswordResetPage() {
    const [resetState, setResetState] = useState("form");
    const [countdown, setCountdown] = useState(5);
    const [medias, setMedias] = useState<Media[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset: resetForm,
    } = useForm<PasswordResetFormData>({
        resolver: zodResolver(passwordResetSchema),
        mode: "onChange",
    });

    useEffect(() => {
        if (!token) {
            setResetState("error");
        }
    }, [token]);

    const onSubmit = async (data: PasswordResetFormData) => {
        setLoading(true);
        setErrorMessage("");
        
        try {
            const response = await axios.post(Endpoints.RESET_PASSWORD, {
                token: token,
                newPassword: data.newPassword
            });

            setResetState("success");
            resetForm();

            const countdownInterval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
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
                    error.response?.data?.detail || 
                    error.response?.data?.message || 
                    "Failed to reset password. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        fetchOnlyMovies(query).then(setMedias).catch(console.error);
    };

    return (
        <>
            <Background url="https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true" />
            <TopNavBar onClick={handleSearch} displaySearch={false} />
            <div className="container-xl px-4 py-1 d-flex justify-content-center align-items-center flex-column mt-4">
                <div className="card shadow-lg text-center p-4 mb-4"
                    style={{
                        maxWidth: "500px",
                        width: "100%",
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(8px)"
                    }}>
                    <div className="mb-4">
                        {resetState === "form" && (
                            <div className="text-center">
                                <Lock size={64} className="mx-auto" style={{ color: "#66bb6a" }} />
                            </div>
                        )}
                        {resetState === "success" && (
                            <div className="text-center">
                                <CheckCircle size={64} className="mx-auto" style={{ color: "#66bb6a" }} />
                            </div>
                        )}
                        {resetState === "error" && (
                            <AlertTriangle size={64} className="mx-auto" style={{ color: "#ef5350" }} />
                        )}
                    </div>

                    <h1 className="h3 fw-bold text-white mb-2">
                        {resetState === "form" && "Reset Your Password"}
                        {resetState === "success" && "Password Reset Successful!"}
                        {resetState === "error" && "Reset Failed"}
                    </h1>

                    <div className="text-white-50">
                        {resetState === "form" && (
                            <div>
                                <p className="mb-4">Enter your new password below.</p>
                                
                                {errorMessage && (
                                    <div className="alert alert-danger mb-3" role="alert">
                                        {errorMessage}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit(onSubmit)} className="text-start">
                                    <div className="mb-4">
                                        <label htmlFor="newPassword" className="form-label text-white mb-2">New Password</label>
                                        <input
                                            type="password"
                                            className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                                            id="newPassword"
                                            placeholder="Enter new password"
                                            {...register("newPassword")}
                                            disabled={loading}
                                        />
                                        {errors.newPassword && (
                                            <div className="invalid-feedback d-block" style={{ fontSize: "0.875rem" }}>{errors.newPassword.message}</div>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="confirmPassword" className="form-label text-white mb-2">Confirm Password</label>
                                        <input
                                            type="password"
                                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                            id="confirmPassword"
                                            placeholder="Confirm new password"
                                            {...register("confirmPassword")}
                                            disabled={loading}
                                        />
                                        {errors.confirmPassword && (
                                            <div className="invalid-feedback d-block" style={{ fontSize: "0.875rem" }}>{errors.confirmPassword.message}</div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-outline-primary w-100 mt-3"
                                        disabled={!isValid || loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Resetting Password...
                                            </>
                                        ) : (
                                            "Reset Password"
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}

                        {resetState === "success" && (
                            <div>
                                <p className="mb-2">Your password has been successfully reset!</p>
                                <p>You will be redirected to the home page in <span className="font-bold text-info">{countdown}</span> seconds.</p>
                            </div>
                        )}

                        {resetState === "error" && (
                            <div>
                                <p className="mb-3">The reset token is invalid or has expired.</p>
                                <a href="/#/" className="btn btn-outline-primary">
                                    Back to Home
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                <p className="text-white-50 small">
                    Having trouble? <a href="mailto:team@movieplus.live" className="text-info">Contact our support team</a>
                </p>
            </div>
        </>
    );
} 