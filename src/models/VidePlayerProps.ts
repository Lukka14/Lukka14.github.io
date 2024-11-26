import { MediaType } from "./Movie";

export interface VideoPlayerProps {
  id: string;
  mediaType: MediaType;
  season: string | null;
  episode: string | null;
}