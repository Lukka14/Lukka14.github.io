import { MediaType } from "./Movie";

export interface VideoPlayerProps {
  id: string;
  mediaType: MediaType;
  season: number | null;
  episode: number | null;
  posterURL : string;
}