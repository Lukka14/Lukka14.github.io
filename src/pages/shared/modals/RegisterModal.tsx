import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  AlertCircle,
  Bookmark,
  Check,
  Clock,
  Eye,
  EyeOff,
  History,
  Lock,
  Mail,
  Sparkles,
  User,
  X,
  XIcon,
} from "lucide-react";
import { Endpoints, FeatureFlags } from "../../../config/Config";
import { switchModal } from "./modal-utils";
import {
  EMAIL_REGEX,
  PASSWORD_LETTER_REGEX,
  PASSWORD_MAX,
  PASSWORD_MIN,
  USERNAME_MAX,
  USERNAME_MIN,
  USERNAME_REGEX,
  extractApiError,
} from "./auth-validation";
import "./auth-modal.css";

const schema = z
  .object({
    username: z
      .string()
      .min(USERNAME_MIN, `Username must be at least ${USERNAME_MIN} characters`)
      .max(USERNAME_MAX, `Username must not exceed ${USERNAME_MAX} characters`)
      .regex(
        USERNAME_REGEX,
        "Username can only contain letters, numbers, dots, underscores, and hyphens"
      ),

    email: z
      .string()
      .min(1, "Email is required")
      .regex(
        EMAIL_REGEX,
        "Enter a valid email address (letters, numbers and + _ . - only)"
      ),

    password: z
      .string()
      .min(PASSWORD_MIN, `Password must be at least ${PASSWORD_MIN} characters`)
      .max(PASSWORD_MAX, `Password must not exceed ${PASSWORD_MAX} characters`)
      .regex(PASSWORD_LETTER_REGEX, "Password must contain at least one letter"),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

const PERKS = [
  { icon: Bookmark, label: "Watchlist" },
  { icon: History, label: "Resume playback" },
  { icon: Sparkles, label: "Always free" },
];

const STRENGTH_LEVELS = [
  { label: "Weak", className: "is-filled-weak" },
  { label: "Fair", className: "is-filled-fair" },
  { label: "Good", className: "is-filled-good" },
  { label: "Strong", className: "is-filled-strong" },
];

/** The two hard rules the API enforces — anything failing these is rejected with a 409. */
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

/** Advisory strength, only meaningful once the API's requirements are satisfied. */
const getPasswordScore = (password: string): number => {
  let score = 1;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
};

export default function RegisterModal() {
  const registrationEnabled = FeatureFlags.REGISTRATION_ENABLED;
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password") ?? "";
  const confirmPassword = watch("confirmPassword") ?? "";

  const passwordChecks = useMemo(
    () => REQUIREMENTS.map((rule) => ({ ...rule, passed: rule.test(password) })),
    [password]
  );
  const meetsRequirements = passwordChecks.every((check) => check.passed);
  const passwordScore = useMemo(
    () => (meetsRequirements ? getPasswordScore(password) : 0),
    [password, meetsRequirements]
  );
  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const resetState = () => {
    setErrorMessage("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    reset();
  };

  const onSubmit = async (data: FormData) => {
    if (!registrationEnabled) return;

    setLoading(true);
    setErrorMessage("");
    try {
      await axios.post(Endpoints.REGISTER, {
        username: data.username,
        email: data.email,
        password: data.password,
      });

      resetState();
      switchModal("registerModal", "verificationModal");
    } catch (err: any) {
      setErrorMessage(
        extractApiError(err, "Registration failed. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    resetState();
    switchModal("registerModal", "loginModal");
  };

  return (
    <div
      className="modal fade auth-modal auth-modal--wide"
      id="registerModal"
      tabIndex={-1}
      aria-labelledby="registerModalLabel"
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
            onClick={resetState}
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
              <h5 className="auth-modal-title" id="registerModalLabel">
                {registrationEnabled
                  ? "Create your account"
                  : "Sign-ups are paused"}
              </h5>
              <p className="auth-modal-subtitle">
                {registrationEnabled
                  ? "It takes less than a minute and costs nothing."
                  : "We cannot send confirmation emails yet, so new accounts are on hold for a short while."}
              </p>

              <div className="auth-perk-row">
                {PERKS.map((perk) => {
                  const Icon = perk.icon;
                  return (
                    <span className="auth-perk-chip" key={perk.label}>
                      <Icon size={14} />
                      {perk.label}
                    </span>
                  );
                })}
              </div>
            </div>

            {!registrationEnabled ? (
              <>
                <div className="auth-alert auth-alert--warning" role="status">
                  <Clock size={17} />
                  <span>
                    Account creation is temporarily disabled while we finish
                    setting up email verification. Everything else on MoviePlus
                    stays free to browse and watch without an account.
                  </span>
                </div>

                <button
                  type="button"
                  className="auth-submit"
                  data-bs-dismiss="modal"
                  onClick={resetState}
                >
                  Keep browsing
                </button>

                <div className="auth-divider">already a member?</div>

                <p className="auth-footer-text">
                  <button type="button" className="auth-link" onClick={goToLogin}>
                    Sign in to your account
                  </button>
                </p>
              </>
            ) : (
              <>
                {errorMessage && (
                  <div className="auth-alert auth-alert--error" role="alert">
                    <AlertCircle size={17} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="auth-field">
                <label className="auth-label" htmlFor="registerUsername">
                  Username
                </label>
                <div
                  className={`auth-input-wrap${
                    errors.username ? " is-invalid" : ""
                  }`}
                >
                  <User size={17} className="auth-input-icon" />
                  <input
                    {...register("username")}
                    id="registerUsername"
                    className="auth-input"
                    placeholder="Choose a username"
                    autoComplete="username"
                    disabled={loading}
                  />
                </div>
                {errors.username && (
                  <span className="auth-error-text">
                    {errors.username.message}
                  </span>
                )}
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="registerEmail">
                  Email
                </label>
                <div
                  className={`auth-input-wrap${errors.email ? " is-invalid" : ""}`}
                >
                  <Mail size={17} className="auth-input-icon" />
                  <input
                    {...register("email")}
                    type="email"
                    id="registerEmail"
                    className="auth-input"
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>
                {errors.email && (
                  <span className="auth-error-text">{errors.email.message}</span>
                )}
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="registerPassword">
                  Password
                </label>
                <div
                  className={`auth-input-wrap${
                    errors.password ? " is-invalid" : ""
                  }`}
                >
                  <Lock size={17} className="auth-input-icon" />
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    id="registerPassword"
                    className="auth-input"
                    placeholder="At least 6 characters"
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

                {password && (
                  <div className="auth-strength">
                    <div className="auth-strength-bars">
                      {STRENGTH_LEVELS.map((level, index) => (
                        <span
                          key={level.label}
                          className={`auth-strength-bar${
                            index < passwordScore
                              ? ` ${STRENGTH_LEVELS[passwordScore - 1].className}`
                              : ""
                          }`}
                        />
                      ))}
                    </div>
                    <span className="auth-strength-label">
                      Strength:{" "}
                      <span>
                        {meetsRequirements
                          ? STRENGTH_LEVELS[passwordScore - 1].label
                          : "Not accepted yet"}
                      </span>
                    </span>

                    <ul className="auth-requirements">
                      {passwordChecks.map((check) => (
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
                  </div>
                )}

                {errors.password && (
                  <span className="auth-error-text">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="registerConfirmPassword">
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
                    id="registerConfirmPassword"
                    className="auth-input"
                    placeholder="Repeat your password"
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
                {loading ? "Creating account..." : "Create account"}
              </button>

              <div className="auth-divider">already a member?</div>

              <p className="auth-footer-text">
                <button type="button" className="auth-link" onClick={goToLogin}>
                  Sign in to your account
                </button>
              </p>

                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
