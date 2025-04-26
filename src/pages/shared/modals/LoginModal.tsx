import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Cookies from "js-cookie";
import ModalFooter from "./ModalFooter";
import ModalHeader from "./ModalHeader";
import { Endpoints } from "../../../config/Config";

const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginModal() {
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        setErrorMessage("");
        try {
            const res = await axios.post(Endpoints.LOGIN, data);
            const { accessToken } = res.data;

            Cookies.set("accessToken", accessToken.token, {
                expires: new Date(Date.now() + accessToken.expiresIn),
                secure: true,
                sameSite: "Strict",
            });
            // Cookies.set("refreshToken", refreshToken.token, {
            //     expires: new Date(Date.now() + refreshToken.expiresIn),
            //     secure: true,
            //     sameSite: "Strict",
            // });
            Cookies.set("username", data.username, {
                expires: new Date(Date.now() + accessToken.expiresIn),
                secure: true,
                sameSite: "Strict",
            });

            reset();
            window.location.href = "/#/profile/" + data.username;

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

    return (
        <div className="modal fade" id="loginModal" tabIndex={-1} aria-labelledby="loginModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content" style={{
                    backgroundColor: "#1c2231"
                }}>
                    <ModalHeader title="Login" />
                    <div className="modal-body">
                        {errorMessage && (
                            <div className="alert alert-danger" role="alert">
                                {errorMessage}
                            </div>
                        )}
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
                                <label htmlFor="password" className="form-label">Password</label>
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
                    </div>
                    <ModalFooter
                        primaryBtnText={loading ? "Logging in..." : "Login"}
                        onPrimaryClick={handleSubmit(onSubmit)}
                        closeButtonRef={closeButtonRef}
                    />
                </div>
            </div>
        </div>
    );
}
