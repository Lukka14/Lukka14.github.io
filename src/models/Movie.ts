export enum MediaType {
  MOVIE = "MOVIE",
  TV_SERIES = "TV_SERIES",
  PERSON = "PERSON"
}

export enum ReleaseStatus {
  UPCOMING = "UPCOMING",
  RELEASED = "RELEASED",
  UNKNOWN = "UNKNOWN"
}

export class Media {
  id?: number;
  title?: string;
  posterUrl?: string;
  backDropUrl!: string;
  overview?: string;
  releaseYear?: string;
  release_date?: string;
  mediaType?: MediaType;
  rating?: number;
  genreList?: string[];
  originalLanguage?: string;
  similar?: Media[];
  releaseStatus?: ReleaseStatus;
  
  constructor(data?: Partial<Media>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export interface MediaListProps {
  mediaList: Media[];
}

export interface CastMember {
  /** TMDB person id — not a movie/series id. */
  id: number;
  name: string;
  character: string | null;
  /** Already a full URL. Never null: actors without a photo get a placeholder. */
  profileUrl: string;
  /** Series only, always null for movies. */
  episodeCount: number | null;
}

export class ImdbMedia extends Media {
  imdbId?: string;
  /** Null when the IMDb data provider is unavailable. Always a string, never a number. */
  imdbRating?: string | null;
  /** Null when the IMDb data provider is unavailable. */
  imdbVotes?: string | null;
  /** Never null — an empty array when TMDB has no credits. Pre-sorted by billing order. */
  cast?: CastMember[];

  constructor(data?: Partial<ImdbMedia>) {
    super(data); // Call the parent class constructor
    if (data) {
      Object.assign(this, data); // Assign additional ImdbMedia-specific fields
    }
  }
}


export class Season {
  id?: number;
  name?: string;
  airDate?: string;
  episodeCount?: number;
  posterUrl?: string;
  seasonNumber?: number;

  constructor(data?: Partial<Season>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class TvSeries extends ImdbMedia {
  numberOfEpisodes?: number;
  numberOfSeasons?: number;
  seasonList?: Season[];

  constructor(data?: Partial<TvSeries>) {
    super(data);
    if (data) {
      this.seasonList = data.seasonList?.map(season => new Season(season)) || [];
    }
  }
}

export class Movie extends ImdbMedia {

  runtime?: number;
  budget?: number;

  constructor(data?: Partial<Movie>) {
    super(data);
  }
}