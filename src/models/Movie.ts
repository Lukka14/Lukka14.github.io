export enum MediaType {
  MOVIE = "MOVIE",
  TV_SERIES = "TV_SERIES",
  PERSON = "PERSON"
}

export class Media {
  id?: number;
  title?: string;
  posterUrl?: string;
  backDropUrl!: string;
  overview?: string;
  releaseDate?: string;
  mediaType?: MediaType;
  rating?: number;
  genres?: string[];
  originalLanguage?: string;

  constructor(data?: Partial<Media>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export interface MediaListProps {
  mediaList: Media[];
}

export class ImdbMedia extends Media {
  imdbId?: string;
  imdbRating?: string;
  imdbVotes?: string;

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
  seasons?: Season[];

  constructor(data?: Partial<TvSeries>) {
    super(data);
    if (data) {
      this.seasons = data.seasons?.map(season => new Season(season)) || [];
    }
  }
}
