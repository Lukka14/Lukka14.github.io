import React from "react";
import { Play } from "lucide-react";
import { MediaImage } from "../../../shared/MediaImage";
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

export const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode, isSelected, hideSpoilers, onClick: SelectEpisode }) => {
    const select = () => SelectEpisode(episode.seasonNumber, episode.episodeNumber);

    return (
        <div className="episode-card">
            {isSelected && episode.stillPath && (
                <img
                    src={episode.stillPath}
                    alt=""
                    aria-hidden="true"
                    className="episode-ambient-glow"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                    }}
                />
            )}
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
                <MediaImage
                    src={episode.stillPath}
                    alt={`Episode ${episode.episodeNumber}`}
                    kind="still"
                    className={`episode-image${hideSpoilers ? ' is-blurred' : ''}`}
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
