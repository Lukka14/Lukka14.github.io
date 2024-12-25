import React, { useEffect, useState } from "react";
import { ImdbMedia, TvSeries, MediaType, Season } from "../../../models/Movie";
import { SeasonEpisode } from "../WatchPage";

interface MediaInfoProps {
  media: ImdbMedia | TvSeries | null;
  setSeasonEpisode: (seasonEpisode: SeasonEpisode) => void;
}

const MediaInfo: React.FC<MediaInfoProps> = ({ media, setSeasonEpisode }) => {
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);

  const queryParams = new URLSearchParams(window.location.hash.split("?")[1]); // Use `window.location.hash` for HashRouter
  const seasonFromQuery = Number(queryParams.get("s"));
  const episodeFromQuery = Number(queryParams.get("e"));

  useEffect(() => {
    if (media && media.mediaType === MediaType.TV_SERIES) {
      // Set default selected season to season 1 (seasonNumber === 1)
      const tvSeason = (media as TvSeries).seasonList?.find(
        (season) => season.seasonNumber === seasonFromQuery
      );
      if (tvSeason) {
        setSelectedSeason(tvSeason);
        // Set the first episode of season 1 as default
        setSelectedEpisode(1);
        if (tvSeason.seasonNumber !== undefined) {
          setSeasonEpisode(new SeasonEpisode(tvSeason.seasonNumber, episodeFromQuery || 1));
          setSelectedEpisode(episodeFromQuery);
        }
      }
    }
  }, [media]);

  if (!media) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          Unable to display media information. Please try again later.
        </div>
      </div>
    );
  }

  const isTvSeries = media.mediaType === MediaType.TV_SERIES;
  const genres = media.genreList?.join(", ") || "Unknown";

  const handleSeasonClick = (season: Season) => {
    setSelectedSeason(season);
    setSelectedEpisode(null); // Reset the episode selection when season is clicked
  };

  const handleEpisodeClick = (seasonNumber: number, episodeNumber: number) => {
    setSelectedEpisode(episodeNumber); // Set the selected episode
    setSeasonEpisode(new SeasonEpisode(seasonNumber, episodeNumber)); // Notify parent component about the selected episode
  };

  return (
    <div className="container">
      <div
        className="card shadow-lg"
        style={{
          backgroundImage: `url(${media.backDropUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
        }}
      >
        <div
          className="card-body p-4"
          style={{
            backdropFilter: "blur(8px)",
            background: "rgba(0, 0, 0, 0.7)",
          }}
        >
          <div className="row">
            <div className="col-md-4">
              <img
                src={media.posterUrl}
                alt={media.title}
                className="img-fluid rounded shadow"
              />
            </div>
            <div className="col-md-8">
            <h1 style={{ paddingTop: '0px' }}>{media.title}</h1>
            <p className="text-muted">
                ({media.originalLanguage?.toUpperCase()})
              </p>
              <p>{media.overview}</p>
              <p>
                <strong>Genres:</strong> {genres}
              </p>
              <p>
                <strong>Release Date:</strong> {media.releaseDate}
              </p>
              {media.imdbId && (
                <p>
                  <strong>IMDb: ⭐</strong>{" "}
                  <a
                    href={`https://www.imdb.com/title/${media.imdbId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-warning"
                  >
                    {media.imdbRating} ({media.imdbVotes} votes)
                  </a>
                </p>
              )}
              {isTvSeries && (
                <>
                  <p>
                    <strong>Number of Seasons:</strong>{" "}
                    {(media as TvSeries).numberOfSeasons}
                  </p>
                  <p>
                    <strong>Number of Episodes:</strong>{" "}
                    {(media as TvSeries).numberOfEpisodes}
                  </p>
                  <div className="mt-4">
                    <h5>Seasons:</h5>
                    <div className="d-flex flex-wrap gap-3">
                      {(media as TvSeries).seasonList?.map((season) =>
                        season.episodeCount == undefined || season.episodeCount > 0 ? (
                          <button
                            key={season.id}
                            className={`btn btn-outline-warning ${
                              selectedSeason?.id === season.id ? "active" : ""
                            }`}
                            onClick={() => handleSeasonClick(season)}
                            style={{
                              border: selectedSeason?.id === season.id ? "2px solid orange" : "2px solid rgba(255, 165, 0, 0.5)", // Orange border when unselected
                              backgroundColor: selectedSeason?.id === season.id ? "orange" : "transparent",
                              color: selectedSeason?.id === season.id ? "black" : "",
                            }}
                          >
                            {season.name}
                          </button>
                        ) : null
                      )}
                    </div>
                  </div>
                  {selectedSeason && (
                    <div className="mt-4">
                      <h5>Episodes in {selectedSeason.name}</h5>
                      <div className="d-flex flex-wrap gap-2">
                        {Array.from(
                          { length: selectedSeason.episodeCount || 0 },
                          (_, index) => (
                            <button
                              key={index}
                              className={`btn btn-outline-info ${
                                selectedEpisode === index + 1 ? "active" : ""
                              }`}
                              onClick={() => selectedSeason?.seasonNumber && handleEpisodeClick(selectedSeason.seasonNumber, index + 1)}
                              style={{
                                border: selectedEpisode === index + 1 ? "2px solid #17a2b8" : "2px solid rgba(23, 162, 184, 0.5)", // Cyan border when unselected
                                backgroundColor: selectedEpisode === index + 1 ? "#17a2b8" : "transparent",
                                color: selectedEpisode === index + 1 ? "black" : "",
                              }}
                            >
                              {index + 1}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaInfo;
