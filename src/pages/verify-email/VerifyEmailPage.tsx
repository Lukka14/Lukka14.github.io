import React, { useState, useEffect, useRef } from "react";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Background } from "../main/Background";
import { fetchOnlyMovies } from "../../services/MediaService";
import { Media } from "../../models/Movie";
import TopNavBar from "../shared/TopNavBar";
import { LoadingSpinner } from "../main/LoadingSpinner";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { Endpoints } from "../../config/Config";

export default function VerifyEmailPage() {
    const [verificationState, setVerificationState] = useState("verifying");
    const [countdown, setCountdown] = useState(5);
    const [medias, setMedias] = useState<Media[]>([]);
    const { token } = useParams<{ token: string }>();
    const hasVerified = useRef<boolean>(false);

    useEffect(() => {
        let countdownInterval: string | number | NodeJS.Timeout | undefined;
        async function verifyUser() {
            if (hasVerified.current) return;
            hasVerified.current = true;
            try {
                if (!token) {
                    setVerificationState("error");
                    return;
                }
                const res = await fetch(`${Endpoints.VERIFY_EMAIL}?token=${token}`);
                if (!res?.ok) {
                    setVerificationState("error");
                    return;
                }

                const data = await res.json();

                if (!data.accessToken || !data.accessToken.token || !data.accessToken.expiresIn) {
                    setVerificationState("error");
                    return;
                }

                const { token: accessToken, expiresIn } = data.accessToken;

                Cookies.set("accessToken", accessToken, {
                    expires: new Date(Date.now() + expiresIn),
                    secure: true,
                    sameSite: "Strict",
                });

                const username = Cookies.get("username");
                if (!username) {
                    setVerificationState("error");
                    return;
                }

                countdownInterval = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev <= 1) {
                            window.location.href = `/profile/${username}`;
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);

                setVerificationState("success");
            } catch (e: any) {
                setVerificationState("error");
            }
        }

        verifyUser();
        return () => clearInterval(countdownInterval);
    }, [token]);

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
                        {verificationState === "verifying" && (
                            <div className="text-center">
                                <LoadingSpinner size={64} />
                            </div>
                        )}
                        {verificationState === "success" && (
                            <div className="text-center">
                                <CheckCircle size={64} className="mx-auto" style={{ color: "#66bb6a" }} />
                            </div>
                        )}
                        {verificationState === "error" && (
                            <AlertTriangle size={64} className="mx-auto" style={{ color: "#ef5350" }} />
                        )}
                    </div>

                    <h1 className="h3 fw-bold text-white mb-2">
                        {verificationState === "verifying" && "Verifying Your Email"}
                        {verificationState === "success" && "Email Verified!"}
                        {verificationState === "error" && "Verification Failed"}
                    </h1>

                    <div className="text-white-50">
                        {verificationState === "verifying" && (
                            <div>
                                <p className="mb-3">Please wait while we're confirming your email address...</p>
                            </div>
                        )}

                        {verificationState === "success" && (
                            <div>
                                <p className="mb-2">Thank you! Your email has been successfully verified.</p>
                                <p>You will be redirected to your profile page in <span className="font-bold text-info">{countdown}</span> seconds.</p>
                            </div>
                        )}

                        {verificationState === "error" && (
                            <p>Oops! Something went wrong with your verification. Please try again or contact support.</p>
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