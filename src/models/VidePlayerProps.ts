import { Dispatch } from "react";
import { MediaType } from "./Movie";

export interface VideoPlayerProps {
  id: string;
  playerUrl: string;
  mediaType: MediaType;
  season: number;
  episode: number;
  posterURL: string;
  isPlaying: boolean,
  setIsPlaying: Dispatch<React.SetStateAction<boolean>>;
}