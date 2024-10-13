export interface IMedia {
  mediaType: string;
  media_type: string;
  getName(): string;
  getImgPath(): string;
  getMediaType(): string;
}

export class Movie implements IMedia {
  mediaType!: string;
  backdrop_path!: string;
  id!: number;
  title!: string;
  original_title!: string;
  overview!: string;
  poster_path!: string;
  media_type!: string;
  adult!: boolean;
  original_language!: string;
  genre_ids!: number[];
  popularity!: number;
  release_date!: string;
  video!: boolean;
  vote_average!: number;
  vote_count!: number;

  getName(): string {
    return this.title;
  }

  getImgPath(): string {
    return this.poster_path;
  }

  getMediaType(): string {
    return this.mediaType;
  }
}

export class TVSeries implements IMedia {
  mediaType!: string;
  getMediaType(): string {
    return this.mediaType;
  }
  backdrop_path!: string;
  id!: number;
  name!: string;
  original_name!: string;
  overview!: string;
  poster_path!: string;
  media_type!: string;
  adult!: boolean;
  original_language!: string;
  genre_ids!: number[];
  popularity!: number;
  first_air_date!: string;
  vote_average!: number;
  vote_count!: number;
  origin_country!: string[];

  getName(): string {
    return this.name;
  }

  getImgPath(): string {
    return this.poster_path;
  }
}

export class Person implements IMedia {
  mediaType!: string;
  getMediaType(): string {
    return this.mediaType;
  }
  id!: number;
  name!: string;
  original_name!: string;
  media_type!: string;
  adult!: boolean;
  popularity!: number;
  gender!: number;
  known_for_department!: string;
  profile_path!: string;
  known_for!: Movie[];

  getName(): string {
    return this.name;
  }

  getImgPath(): string {
    return this.profile_path;
  }
}

export type Media = Movie | TVSeries | Person;

export interface MediaListProps {
  mediaList: Media[];
}
