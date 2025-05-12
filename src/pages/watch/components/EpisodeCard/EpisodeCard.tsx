import React from "react";
import './EpisodeCard.css';

interface Episode {
    id: number;
    tvSeriesId: number;
    name: string;
    airDate: string;
    overview: string;
    stillPath: string;
    runtime: number;
    seasonNumber: number;
    episodeNumber: number;
}

interface EpisodeCardProps {
    episode: Episode;
    isSelected: boolean;
    onClick: (seasonNumber: number, episodeNumber: number) => void
}

export const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode, isSelected, onClick: SelectEpisode }) => {
    return (
        <>
            <div className="episode-card">
                <div
                    className={`episode-card-inner ${isSelected ? 'selected' : ''}`}
                    onClick={() => SelectEpisode(episode.seasonNumber, episode.episodeNumber)}
                >
                    <span className="episode-number">EP {episode.episodeNumber}</span>
                    {episode.runtime && (
                        <span className="episode-runtime">{episode.runtime} min</span>
                    )}
                    <img
                        src={episode.stillPath || "https://via.placeholder.com/300x170?text=No+Image"}
                        alt={`Episode ${episode.episodeNumber}`}
                        className="episode-image"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/300x170?text=No+Image";
                        }}
                    />
                    <div className="play-icon-wrapper">
                        <div className="play-icon" />
                    </div>
                </div>

                <p className="episode-title" title={episode.name}>
                    {episode.name}
                </p>
            </div>
        </>
    );
};