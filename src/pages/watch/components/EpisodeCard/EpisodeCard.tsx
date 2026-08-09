import React from "react";
import { Play } from "lucide-react";
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
    hideSpoilers?: boolean;
    onClick: (seasonNumber: number, episodeNumber: number) => void
}

const FALLBACK_STILL = "https://via.placeholder.com/300x170?text=No+Image";

export const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode, isSelected, hideSpoilers, onClick: SelectEpisode }) => {
    const select = () => SelectEpisode(episode.seasonNumber, episode.episodeNumber);

    return (
        <div className="episode-card">
            <div
                className={`episode-card-inner ${isSelected ? 'selected' : ''}`}
                onClick={select}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        select();
                    }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Play episode ${episode.episodeNumber}: ${episode.name}`}
            >
                <img
                    src={episode.stillPath || FALLBACK_STILL}
                    alt={`Episode ${episode.episodeNumber}`}
                    className={`episode-image${hideSpoilers ? ' is-blurred' : ''}`}
                    loading="lazy"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = FALLBACK_STILL;
                    }}
                />

                <span className="episode-number">EP {episode.episodeNumber}</span>
                {episode.runtime > 0 && (
                    <span className="episode-runtime">{episode.runtime}m</span>
                )}
                {isSelected && <span className="episode-now-playing">Now playing</span>}

                <div className="play-icon-wrapper">
                    <Play size={16} fill="currentColor" strokeWidth={0} />
                </div>
            </div>

            <p className="episode-title" title={episode.name}>
                {episode.name}
            </p>
        </div>
    );
};
