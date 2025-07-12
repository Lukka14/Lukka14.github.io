import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import Cookies from "js-cookie";
import ModalFooter from "./ModalFooter";
import ModalHeader from "./ModalHeader";
import { Endpoints } from "../../../config/Config";

const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password must be at least 6 characters"),
});

const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function LoginModal() {
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<LoginFormData>({
        defaultValues: {
            username: "",
            password: ""
        }
    });

    const {
        register: forgotPasswordRegister,
        handleSubmit: handleForgotPasswordSubmit,
        formState: { errors: forgotPasswordErrors },
        reset: forgotPasswordReset
    } = useForm<ForgotPasswordFormData>({
        defaultValues: {
            email: ""
        }
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");
        try {
            const res = await axios.post(Endpoints.LOGIN, data, {
                withCredentials: true
            });
            const { accessToken } = res.data;

            Cookies.set("accessToken", accessToken.token, {
                expires: new Date(Date.now() + accessToken.expiresIn),
                secure: true,
                sameSite: "Strict",
            });

            Cookies.set("username", data.username, {
                expires: new Date(Date.now() + accessToken.expiresIn),
                secure: true,
                sameSite: "Strict",
            });

            reset();
            if (window.location.href.includes("watch") || window.location.hash == "#/profile/" + data.username) {
                window.location.reload();
            } else {
                window.location.href = "/#/profile/" + data.username;
            }

            if (closeButtonRef.current) {
                closeButtonRef.current.click();
            }
        } catch (error: any) {
            setErrorMessage(
                error.response?.data?.message || "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const onForgotPasswordSubmit = async (data: ForgotPasswordFormData) => {
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");
        try {
            const res = await axios.post(`${Endpoints.FORGOT_PASSWORD}?email=${encodeURIComponent(data.email)}`);

            setSuccessMessage(res.data.message || "Forgot password email sent successfully");
            forgotPasswordReset();
        } catch (error: any) {
            if (error.response?.status === 404) {
                setErrorMessage("User with this email not found");
            } else {
                setErrorMessage(
                    error.response?.data?.detail ||
                    error.response?.data?.message ||
                    "Failed to send reset email. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleForgotPasswordMode = () => {
        setIsForgotPasswordMode(!isForgotPasswordMode);
        setErrorMessage("");
        setSuccessMessage("");
        reset();
        forgotPasswordReset();
    };

    return (
        <div className="modal fade" id="loginModal" tabIndex={-1} aria-labelledby="loginModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content" style={{
                    backgroundColor: "#1c2231"
                }}>
                    <ModalHeader title={isForgotPasswordMode ? "Forgot Password" : "Login"} />
                    <div className="modal-body">
                        {errorMessage && (
                            <div className="alert alert-danger" role="alert">
                                {errorMessage}
                            </div>
                        )}
                        {successMessage && (
                            <div className="alert alert-success" role="alert">
                                {successMessage}
                            </div>
                        )}

                        {isForgotPasswordMode ? (
                            <form id="forgotPasswordForm" onSubmit={handleForgotPasswordSubmit(onForgotPasswordSubmit)}>
                                <div className="mb-4">
                                    <label htmlFor="email" className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        className={`form-control ${forgotPasswordErrors.email ? 'is-invalid' : ''}`}
                                        id="email"
                                        placeholder="Enter your email address"
                                        autoComplete="email"
                                        {...forgotPasswordRegister("email")}
                                        disabled={loading}
                                    />
                                    {forgotPasswordErrors.email && (
                                        <div className="invalid-feedback d-block">{forgotPasswordErrors.email.message}</div>
                                    )}
                                </div>

                                <div className="d-flex justify-content-between mt-4">
                                    <button
                                        type="button"
                                        className="text-decoration-none p-0"
                                        onClick={toggleForgotPasswordMode}
                                        disabled={loading}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            color: "#3b71ca",
                                            cursor: "pointer",
                                            fontSize: "inherit",
                                            lineHeight: "inherit"
                                        }}
                                        onMouseEnter={(e) => (e.target as HTMLElement).style.opacity = "0.95"}
                                        onMouseLeave={(e) => (e.target as HTMLElement).style.opacity = "1"}
                                    >
                                        ← Back to Login
                                    </button>
                                </div>
                                <button type="submit" style={{ display: "none" }}></button>
                            </form>
                        ) : (
                            <form id="loginForm" onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-4">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                        id="username"
                                        placeholder="Enter username"
                                        autoComplete="off"
                                        {...register("username")}
                                        disabled={loading}
                                    />
                                    {errors.username && (
                                        <div className="invalid-feedback d-block">{errors.username.message}</div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <button
                                            type="button"
                                            className="text-decoration-none p-0"
                                            onClick={toggleForgotPasswordMode}
                                            disabled={loading}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                color: "#3b71ca",
                                                cursor: "pointer",
                                                fontSize: "inherit",
                                                lineHeight: "inherit"
                                            }}
                                            onMouseEnter={(e) => (e.target as HTMLElement).style.opacity = "0.95"}
                                            onMouseLeave={(e) => (e.target as HTMLElement).style.opacity = "1"}
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        id="password"
                                        autoComplete="off"
                                        placeholder="Password"
                                        {...register("password")}
                                        disabled={loading}
                                    />
                                    {errors.password && (
                                        <div className="invalid-feedback d-block">{errors.password.message}</div>
                                    )}
                                </div>

                                <div className="d-flex justify-content-end mt-4">
                                    <div>
                                        <span style={{ color: "#c2c2c2" }}>Don't have an account? </span>
                                        <a href="/#/register/" onClick={() => {
                                            if (closeButtonRef.current) {
                                                closeButtonRef.current.click();
                                            }
                                        }} className="text-decoration-none">Sign up</a>
                                    </div>
                                </div>
                                <button type="submit" style={{ display: "none" }}></button>
                            </form>
                        )}
                    </div>
                    <ModalFooter
                        loading={loading}
                        onPrimaryClick={isForgotPasswordMode ? handleForgotPasswordSubmit(onForgotPasswordSubmit) : handleSubmit(onSubmit)}
                        closeButtonRef={closeButtonRef}
                        primaryBtnText={isForgotPasswordMode ? "Send Reset Email" : "Login"}
                    />
                </div>
            </div>
        </div>
    );
}
