import { EmailOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export function Footer() {
    const navigate = useNavigate();

    const currentPath = window.location.hash;
    const isHelpPage = currentPath.includes('/help');

    const SUPPORT_EMAIL = "team@movieplus.live"
    return (
        <footer className="footer-dark text-light py-3 mt-4">
            <div className="container">
                {isHelpPage && (
                    <div className="row">
                        <div className="col-12">
                            <div className="p-3 rounded-lg text-center">
                                <h6 className="mb-0 d-flex justify-content-center align-items-center flex-wrap gap-2">
                                    Have questions, feedback, or need support? Feel free to reach out to us at:
                                    <a
                                        href={`mailto:${SUPPORT_EMAIL}`}
                                        className="d-inline-flex align-items-center text-decoration-none"
                                    >
                                        <EmailOutlined style={{ marginRight: "5px", fontSize: "16px" }} />
                                        <span className="small">team@movieplus.live</span>
                                    </a>
                                </h6>
                            </div>
                        </div>
                    </div>
                )}
                {!isHelpPage && (
                    <div className="row gy-3 align-items-center justify-content-between text-center text-md-start flex-column flex-md-row">
                        <div className="col d-flex flex-column flex-md-row align-items-center justify-content-center justify-content-md-start">
                            <img
                                src="/assets/movieplus-logo-no-bg.png?raw=true"
                                alt="Movie Plus Logo"
                                style={{ height: "40px", cursor: "pointer", transition: "transform 0.2s ease" }}
                                onClick={() => navigate("/")}
                                className="me-md-2 mb-2 mb-md-0 footer-logo"
                            />
                            <span className="small">© 2025 MoviePlus</span>
                        </div>

                        <div className="col d-flex justify-content-center">
                            <nav className="d-flex flex-wrap justify-content-center">
                                <a href="/#/multiSearch" className="mx-2">Search</a>
                                <a href="/#/movies" className="mx-2">Movies</a>
                                <a href="/#/tv-shows" className="mx-2">TV Shows</a>
                                <a href="/#/help" className="mx-2">Help</a>
                            </nav>
                        </div>

                        <div className="col d-flex flex-column align-items-center align-items-md-end">
                            <a href={`mailto:${SUPPORT_EMAIL}`} className="d-flex align-items-center justify-content-center justify-content-md-end mb-1">
                                <EmailOutlined style={{ marginRight: "5px", fontSize: "16px" }} />
                                <span className="small">team@movieplus.live</span>
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </footer>
    );
}
