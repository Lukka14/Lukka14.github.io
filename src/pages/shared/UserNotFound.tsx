import { useState } from "react";
import { fetchMedia } from "../../services/MediaService";
import { Background } from "../main/Background";
import { Media } from "../../models/Movie";
import PrimarySearchAppBar from "../shared/SearchMUI_EXPERIMENTAL";
import { useNavigate } from "react-router-dom";

export default function UserNotFound({ username }: {
    username: string;
}) {
    const [medias, setMedias] = useState<Media[]>([]);
    const navigate = useNavigate();

    const handleSearch = (query: string) => {
        fetchMedia(query)
            .then(setMedias)
            .catch((err) => console.error(err));
    };

    const handleGoHome = () => {
        navigate("/");
    };

    const textStyle = {
        color: "#f5f5f5"
    };

    return <div>
        <Background url="https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true" />
        <PrimarySearchAppBar onClick={handleSearch} displaySearch={false} />
        <div className="container-xl px-4 py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6 text-center">
                    <div className="card border-0 shadow-lg" style={{
                        margin: "24px auto 0px auto",
                        padding: "24px",
                        marginTop: "24px",
                        background: "rgba(0, 0, 0, 0.4)",
                        backdropFilter: "blur(8px)"
                    }}>
                        <div className="card-body p-5" style={textStyle}>
                            <div className="mb-4">
                                <i className="bi bi-person-x-fill text-danger" style={{ fontSize: "4rem" }}></i>
                            </div>
                            <h1 className="display-5 fw-bold mb-3" style={textStyle}>404</h1>
                            {/* <h1 className="display-5 fw-bold mb-3" style={textStyle}>User Not Found</h1> */}
                            <p className="lead mb-4" style={textStyle}>
                                We couldn't find any user with the username <strong style={textStyle}>"{username}"</strong>.
                                The user may have changed their username or deleted their account.
                            </p>
                            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary btn-lg px-4"
                                    onClick={() => navigate("/")}
                                    style={textStyle}
                                >
                                    <i className="bi bi-arrow-left"></i>
                                    Go to Homepage
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}