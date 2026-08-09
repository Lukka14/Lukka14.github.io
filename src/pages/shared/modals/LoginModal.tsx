import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import Cookies from "js-cookie";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  XIcon,
} from "lucide-react";
import { Endpoints } from "../../../config/Config";
import { switchModal } from "./modal-utils";
import { EMAIL_REGEX } from "./auth-validation";
import "./auth-modal.css";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .regex(EMAIL_REGEX, "Please enter a valid email address"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function LoginModal() {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const {
    register: forgotPasswordRegister,
    handleSubmit: handleForgotPasswordSubmit,
    formState: { errors: forgotPasswordErrors },
    reset: forgotPasswordReset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const res = await axios.post(Endpoints.LOGIN, data, {
        withCredentials: true,
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

      if (closeButtonRef.current) {
        closeButtonRef.current.click();
      }

      if (
        window.location.href.includes("watch") ||
        window.location.hash === "#/profile/" + data.username
      ) {
        window.location.reload();
      } else {
        window.location.href = "/#/profile/" + data.username;
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
      const res = await axios.post(
        `${Endpoints.FORGOT_PASSWORD}?email=${encodeURIComponent(data.email)}`
      );

      setSuccessMessage(
        res.data.message || "Reset email sent. Check your inbox."
      );
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
    setIsForgotPasswordMode((prev) => !prev);
    setErrorMessage("");
    setSuccessMessage("");
    setShowPassword(false);
    reset();
    forgotPasswordReset();
  };

  const closeAndReset = () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsForgotPasswordMode(false);
    setShowPassword(false);
    reset();
    forgotPasswordReset();
  };

  return (
    <div
      className="modal fade auth-modal"
      id="loginModal"
      tabIndex={-1}
      aria-labelledby="loginModalLabel"
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
            onClick={closeAndReset}
          >
            <XIcon size={17} />
          </button>

          <div className="auth-modal-body">
            <div className="auth-modal-head">
              <img
                className="auth-modal-logo"
                src="/assets/movieplus-mark.svg"
                alt="MoviePlus"
              />
              <h5 className="auth-modal-title" id="loginModalLabel">
                {isForgotPasswordMode ? "Reset your password" : "Welcome back"}
              </h5>
              <p className="auth-modal-subtitle">
                {isForgotPasswordMode
                  ? "Enter your email address and we will send you a link to reset your password."
                  : "Sign in to keep your watchlist and continue where you left off."}
              </p>
            </div>

            {errorMessage && (
              <div className="auth-alert auth-alert--error" role="alert">
                <AlertCircle size={17} />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="auth-alert auth-alert--success" role="alert">
                <CheckCircle2 size={17} />
                <span>{successMessage}</span>
              </div>
            )}

            {isForgotPasswordMode ? (
              <form
                id="forgotPasswordForm"
                onSubmit={handleForgotPasswordSubmit(onForgotPasswordSubmit)}
                noValidate
              >
                <div className="auth-field">
                  <label className="auth-label" htmlFor="email">
                    Email address
                  </label>
                  <div
                    className={`auth-input-wrap${
                      forgotPasswordErrors.email ? " is-invalid" : ""
                    }`}
                  >
                    <Mail size={17} className="auth-input-icon" />
                    <input
                      type="email"
                      className="auth-input"
                      id="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={loading}
                      {...forgotPasswordRegister("email")}
                    />
                  </div>
                  {forgotPasswordErrors.email && (
                    <span className="auth-error-text">
                      {forgotPasswordErrors.email.message}
                    </span>
                  )}
                </div>

                <button type="submit" className="auth-submit" disabled={loading}>
                  {loading && <span className="auth-spinner" />}
                  {loading ? "Sending..." : "Send reset email"}
                </button>

                <div className="auth-divider">or</div>

                <p className="auth-footer-text">
                  <button
                    type="button"
                    className="auth-link auth-back-link"
                    onClick={toggleForgotPasswordMode}
                    disabled={loading}
                  >
                    <ArrowLeft size={15} />
                    Back to sign in
                  </button>
                </p>
              </form>
            ) : (
              <form id="loginForm" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="auth-field">
                  <label className="auth-label" htmlFor="username">
                    Username
                  </label>
                  <div
                    className={`auth-input-wrap${
                      errors.username ? " is-invalid" : ""
                    }`}
                  >
                    <User size={17} className="auth-input-icon" />
                    <input
                      type="text"
                      className="auth-input"
                      id="username"
                      placeholder="Enter your username"
                      autoComplete="username"
                      disabled={loading}
                      {...register("username")}
                    />
                  </div>
                  {errors.username && (
                    <span className="auth-error-text">
                      {errors.username.message}
                    </span>
                  )}
                </div>

                <div className="auth-field">
                  <label className="auth-label" htmlFor="password">
                    Password
                  </label>
                  <div
                    className={`auth-input-wrap${
                      errors.password ? " is-invalid" : ""
                    }`}
                  >
                    <Lock size={17} className="auth-input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="auth-input"
                      id="password"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={loading}
                      {...register("password")}
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
                  {errors.password && (
                    <span className="auth-error-text">
                      {errors.password.message}
                    </span>
                  )}
                </div>

                <div className="auth-meta-row">
                  <span />
                  <button
                    type="button"
                    className="auth-link"
                    onClick={toggleForgotPasswordMode}
                    disabled={loading}
                  >
                    Forgot password?
                  </button>
                </div>

                <button type="submit" className="auth-submit" disabled={loading}>
                  {loading && <span className="auth-spinner" />}
                  {loading ? "Signing in..." : "Sign in"}
                </button>

                <div className="auth-divider">new here?</div>

                <p className="auth-footer-text">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    className="auth-link"
                    onClick={() => {
                      closeAndReset();
                      switchModal("loginModal", "registerModal");
                    }}
                  >
                    Create one
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
