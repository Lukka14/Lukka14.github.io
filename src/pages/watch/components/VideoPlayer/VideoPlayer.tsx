import React, { useEffect, useState, useRef } from "react";
import { VideoPlayerProps } from "../../../../models/VidePlayerProps";
import Cookies from "js-cookie";
import { fetchMovie } from "../../../../services/MediaService";
import { Endpoints } from "../../../../config/Config";
import axios from "axios";
import { MediaType } from "../../../../models/Movie";
import { getCurrentUser } from "../../../../services/UserService";
import "./VideoPlayer.css";

interface WatchedList {
  [key: string]: any;
}

// Videasy and Vidking both refuse to play inside a sandboxed frame, and they
// detect the attribute rather than the individual permissions -- even granting
// every token still trips "Iframe Sandbox Detected". So this is opt-in per
// server and unused by default. allow-presentation keeps casting working.
const IFRAME_SANDBOX =
  "allow-scripts allow-same-origin allow-forms allow-presentation";

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  id,
  playerUrl,
  mediaType,
  season,
  episode,
  posterURL,
  isPlaying,
  setIsPlaying,
  sandboxed = false
}) => {
  const [runtime, setRuntime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (mediaType == MediaType.MOVIE) {
      fetchMovie(id).then((data) => {
        if (data?.runtime) {
          setRuntime(data.runtime);
        }
      });
    }
  }, [id]);

  const rntime = runtime ? runtime * 60 : null;
  const [timer, setTimer] = useState(() => {
    const savedProgress = Cookies.get(`m${id}`);
    return savedProgress ? parseInt(savedProgress, 10) : 0;
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [watched, setWatched] = useState<WatchedList>({});
  const [user, setUser] = useState({
    username: Cookies.get("username") ?? null,
    isAuthed: false
  });
  const [alreadyAddedToWatched, setAlreadyAddedToWatched] = useState(false);
  const addingToWatchedRef = useRef(false);

  useEffect(() => {
    async function fetchUserData() {
      if (user.username) {
        try {
          const me = await getCurrentUser();
          if (me?.username === user?.username) {
            setUser((prev) => ({ ...prev, isAuthed: true }));

            const watchedResponse = await axios.get(
              `${Endpoints.WATCHED}?username=${user.username}`
            );

            if (watchedResponse.data && watchedResponse.data.content) {
              setWatched(watchedResponse.data);

              const isAlreadyWatched = watchedResponse.data.content.some(
                (item: any) => item.id === id
              );

              if (isAlreadyWatched) {
                setAlreadyAddedToWatched(true);
              }
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    }

    fetchUserData();
  }, [id, user.username]);

  const mediaURL = (playerUrl ?? "")
    .replace("{id}", id)
    .replace("{season}", season?.toString() || "")
    .replace("{episode}", episode?.toString() || "");

  const handlePlay = () => {
    setIsPlaying(true);
    setIsLoading(true);
  };


  const startWatchTracker = () => {
    if (!rntime || !user.isAuthed || alreadyAddedToWatched) {
      return;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        const updated = prev + 1;
        Cookies.set(`m${id}`, updated.toString());

        if (updated >= rntime / 2 && !alreadyAddedToWatched && !addingToWatchedRef.current) {
          addToWatchedList();
        }

        return updated;
      });
    }, 1000);
  };

  const addToWatchedList = async () => {
    if (addingToWatchedRef.current) return;
    addingToWatchedRef.current = true;

    try {
      // await refreshAccessToken();
      const token = Cookies.get("accessToken");
      if (!token) return;

      await axios.post(
        `${Endpoints.HANDLE_WATCHED}?id=${id}&type=${mediaType}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAlreadyAddedToWatched(true);
      setWatched(prev => ({
        ...prev,
        content: [...(prev.content || []), { id, type: mediaType }]
      }));

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

    } catch (error) {
      console.error(error);
    } finally {
      addingToWatchedRef.current = false;
    }
  };


  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      startWatchTracker();
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [isPlaying]);

  useEffect(() => {
    setIsLoading(true);
  }, [id, playerUrl]);

  return (
    <div className="ratio ratio-16x9" style={{ position: "relative" }}>
      {!isPlaying ? (
        <div
          className="watch-poster-overlay"
          style={{ backgroundImage: `url(${posterURL})` }}
          onClick={handlePlay}
          role="button"
          aria-label="Play"
        >
          <button type="button" className="watch-play-btn" onClick={handlePlay}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M4.268 1.438a.5.5 0 0 1 .518-.04l10 6a.5.5 0 0 1 0 .884l-10 6A.5.5 0 0 1 4 14.5V1.5a.5.5 0 0 1 .268-.062z" />
            </svg>
            Play now
          </button>
        </div>
      ) : (
        <>
          {isLoading && <div className="watch-skeleton" style={{ zIndex: 10 }} />}

          <iframe
            src={mediaURL}
            title="Video Player"
            allowFullScreen
            // Off unless a server opts in -- see IFRAME_SANDBOX above.
            sandbox={sandboxed ? IFRAME_SANDBOX : undefined}
            // Denies camera, microphone and geolocation, which an embed would
            // otherwise inherit by default. This does not trip the providers'
            // sandbox detection.
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            referrerPolicy="origin"
            onLoad={() => setIsLoading(false)}
            style={{ border: 0, width: "100%", height: "100%" }}
          ></iframe>
        </>
      )}
    </div>
  );
};

export default VideoPlayer;