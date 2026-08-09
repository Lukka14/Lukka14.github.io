import React, { Dispatch, useEffect, useState } from "react";
import axios from "axios";
import { ImdbMedia, MediaType, Season, TvSeries } from "../../../models/Movie";
import { SeasonEpisode } from "../WatchPage";
import { Endpoints } from "../../../config/Config";
import EpisodeCarousel from "./EpisodeCarousel/EpisodeCarousel";
import { useSearchParams } from "react-router-dom";

interface EpisodeSectionProps {
  media: ImdbMedia | TvSeries | null;
  setSeasonEpisode: (seasonEpisode: SeasonEpisode) => void;
  setIsPlaying: Dispatch<React.SetStateAction<boolean>>;
}

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

const EpisodeSection: React.FC<EpisodeSectionProps> = ({
  media,
  setSeasonEpisode,
  setIsPlaying,
}) => {
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);
  const [queryParams] = useSearchParams();
  const seasonFromQuery = Number(queryParams.get("s"));
  const episodeFromQuery = Number(queryParams.get("e"));

  const loadEpisodes = async (seriesId?: number | null, seasonNumber?: number) => {
    if (!seriesId || seasonNumber === undefined) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `${Endpoints.EPISODES}?id=${seriesId}&seasonNumber=${seasonNumber}`
      );
      if (response.data) {
        setEpisodes(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (media && media.mediaType === MediaType.TV_SERIES) {
      const tvSeason = (media as TvSeries).seasonList?.find(
        (season) => season.seasonNumber === seasonFromQuery
      );
      if (tvSeason) {
        setSelectedSeason(tvSeason);
        setSelectedEpisode(episodeFromQuery || 1);
        if (tvSeason.seasonNumber !== undefined) {
          setSeasonEpisode(new SeasonEpisode(tvSeason.seasonNumber, episodeFromQuery || 1));
          loadEpisodes(media.id, tvSeason.seasonNumber);
        }
      }
    }
  }, [media]);

  if (!media || media.mediaType !== MediaType.TV_SERIES || !selectedSeason) {
    return null;
  }

  const handleSeasonClick = (season: Season) => {
    setSelectedSeason(season);
    setSelectedEpisode(null);
    if (season.seasonNumber !== undefined && media.id) {
      loadEpisodes(media.id, season.seasonNumber);
    }
  };

  const handleEpisodeClick = (seasonNumber: number, episodeNumber: number) => {
    setSelectedEpisode(episodeNumber);
    setSeasonEpisode(new SeasonEpisode(seasonNumber, episodeNumber));
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsPlaying(true);
  };

  return (
    <div className="watch-episodes-panel">
      {episodes.length > 0 ? (
        <EpisodeCarousel
          episodes={episodes}
          selectedEpisode={selectedEpisode}
          onEpisodeClick={handleEpisodeClick}
          seasonNumber={selectedSeason.seasonNumber}
          seasonName={selectedSeason.name}
          media={media}
          selectedSeason={selectedSeason}
          handleSeasonClick={handleSeasonClick}
          loading={loading}
        />
      ) : (
        <div className="watch-empty-note">
          No episode data available for this season.
        </div>
      )}
    </div>
  );
};

export default EpisodeSection;
