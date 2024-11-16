export class Media{
  id!: number;
  title!: string;
  posterUrl!: string;
  backDropUrl!: string;
  overview!: string;
  releaseDate!: string;
  mediaType!: string;
  rating!: number;
  genres!: string[];
  originalLanguage!: string;
}

export interface MediaListProps {
  mediaList: Media[];
}
