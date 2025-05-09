import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Background } from "../main/Background";
import PrimarySearchAppBar from "../shared/TopNavBar";
import { fetchMedia } from "../../services/MediaService";
import { Media } from "../../models/Movie";
import { Edit, TriangleAlert } from "lucide-react";
import { getCurrentUser, getUsername } from "../../services/UserService";
import { Endpoints } from "../../config/Config";

export default function SettingsPage() {
    const [media, setMedias] = useState<Media[]>([]);
    const username = getUsername();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [avatarVersion, setAvatarVersion] = useState(Date.now());
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const [user, setUser] = useState<any>({
        username: username,
        avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}&backgroundType=gradientLinear,solid`,
        createdAt: new Date("2023-01-01"),
    });

    const navigate = useNavigate();

    useEffect(() => {
        const newAvatarUrl = `${Endpoints.IMG_VIEW}/${username}.webp`;
        setAvatarUrl(newAvatarUrl);
    }, [username, avatarVersion]);

    useEffect(() => {
        async function fetchUser() {
            const me = await getCurrentUser();
            if (me?.username && me?.username?.toLowerCase() === username?.toLowerCase()) {
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
            setAvatarVersion((currentEvent) => {
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

    function handleUsernameSubmit(event: FormEvent<HTMLFormElement>): void {
        throw new Error("Function not implemented.");
    }

    function handleAvatarChange(event: ChangeEvent<HTMLInputElement>): void {
        throw new Error("Function not implemented.");
    }

    function handlePasswordSubmit(event: FormEvent<HTMLFormElement>): void {
        throw new Error("Function not implemented.");
    }

    return (
        <>
            <Background url="https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true" />
            <PrimarySearchAppBar onClick={handleSearch} displaySearch={false} />
            <div className="container-xl px-4 mt-4">
                <div className="card mb-4" style={{
                    padding: "24px",
                    marginTop: "24px",
                    background: "rgba(0, 0, 0, 0.4)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "8px",
                    color: "#f5f5f5"
                }}>
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
                                    border: "1px solid white"
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
                    </div>
                </div>

                <div className="card mt-4 mb-5" style={{
                    padding: "24px",
                    marginTop: "24px",
                    background: "rgba(0, 0, 0, 0.4)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "8px",
                    color: "#f5f5f5"
                }}>
                    <div className="card-header">
                        <h5 className="font-weight-bold">Change Password</h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="mb-3">
                                <label className="small mb-1" htmlFor="currentPassword">Current Password</label>
                                <input
                                    className="form-control"
                                    id="currentPassword"
                                    type="password"
                                    placeholder="Enter current password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="small mb-1" htmlFor="newPassword">New Password</label>
                                <input
                                    className="form-control"
                                    id="newPassword"
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="small mb-1" htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    className="form-control"
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                {newPassword !== confirmPassword && newPassword && confirmPassword && (
                                    <div className="small text-danger mt-1">Passwords don't match</div>
                                )}
                            </div>
                            <button
                                className="btn btn-outline-primary"
                                type="submit"
                                disabled={!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                            >
                                Work In Progress
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
