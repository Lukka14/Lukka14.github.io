import { useEffect, useState } from "react";
import { fetchMedia, fetchTrendingMedia } from "../../services/MediaService";
import { Media } from "../../models/Movie";
import PrimarySearchAppBar from "./TopNavBar";
import { useNavigate } from "react-router-dom";
import quotesData from "../../dict/404_quotes.json";
import { generateHref } from "../../utils/Utils";
import { Background } from "../watch/components/Background";

export default function UserNotFound({ username }: { username: string }) {
  const [medias, setMedias] = useState<Media[]>([]);
  const [randomMedia, setRandomMedia] = useState<Media>();
  const [randomQuote, setRandomQuote] = useState<{
    text: string;
    movie: string;
  }>();
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    fetchMedia(query)
      .then((media) => {
        setMedias(media);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchTrendingMedia()
      .then((media: Media[]) => {
        setRandomMedia(media[Math.floor(Math.random() * media.length)]);
      })
      .catch((err: any) => {
        console.error(err);
      });

    const randomQuotePick =
      quotesData.quotes[Math.floor(Math.random() * quotesData.quotes.length)];
    setRandomQuote(randomQuotePick);
  }, []);

  const handleGoHome = () => {
    navigate("/");
  };

  const textStyle = {
    color: "#f5f5f5",
  };

  return (
    <div>
      <Background url={randomMedia?.backDropUrl!} />
      {/* <Background url="https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true" /> */}
      <PrimarySearchAppBar onClick={handleSearch} displaySearch={false} />
      <div className="container-xl px-4 py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 text-center">
            <div
              className="card-container"
              style={{ position: "relative", overflow: "hidden" }}
            >
              <p
                className="h1 fw-bold mb-4"
                style={{
                  color: "#f5f5f5",
                  fontSize: "70px",
                }}
              >
                404
              </p>

              <div
                className="card border-0 shadow-lg"
                style={{
                  position: "relative",
                  zIndex: 2,
                  padding: "24px",
                  margin: "0px auto 0px auto",
                  // background: "transparent",
                  backdropFilter: "blur(8px)",
                  background: "rgba(0, 0, 0, 0.7)",
                }}
              >
                <div className="card-body p-1" style={textStyle}>
                  <div className="mb-4">
                    <i
                      className="bi bi-person-x-fill text-danger"
                      style={{ fontSize: "4rem" }}
                    ></i>
                  </div>
                  <blockquote className="blockquote text-white mb-4">
                    <p className="mb-2 fst-italic">"{randomQuote?.text}"</p>
                    <footer className="blockquote-footer text-white-50">
                      {randomQuote?.movie}
                    </footer>
                  </blockquote>

                  <h6 className="mb-3">Here's a recommended movie from us: </h6>
                  <div
                    onClick={() =>
                      navigate(
                        "/" +
                          generateHref(randomMedia as Media)
                            .split("#")[1]
                            .split("/")[1]
                      )
                    }
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <div
                      className="card border-0 shadow-lg overflow-hidden rounded-4"
                      style={{
                        background: "transparent",
                        maxWidth: "320px",
                        margin: "0 auto",
                      }}
                    >
                      <div className="position-relative">
                        <img
                          src={randomMedia?.posterUrl || "poster-url-here"}
                          className="card-img-top"
                          alt="Movie poster"
                          style={{ objectFit: "cover", height: "400px" }}
                        />
                      </div>
                      <div className="card-body text-center text-white p-3">
                        <h5 className="mb-2">
                          {randomMedia?.title || "Movie Title"}
                        </h5>
                        <div className="d-flex justify-content-center gap-2 mb-3">
                          <span className="badge border border-warning text-warning fs-6">
                            ⭐ {randomMedia?.rating?.toFixed(1) || "N/A"}
                          </span>
                          <span className="badge border border-light text-light fs-6">
                            {randomMedia?.releaseYear || "N/A"}
                          </span>
                        </div>
                        <p className="mb-1 small">
                          <strong>
                            {randomMedia?.originalLanguage?.toUpperCase() ||
                              "N/A"}
                          </strong>
                        </p>
                        <p className="small">
                          Genres: {randomMedia?.genreList?.join(" | ") || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
