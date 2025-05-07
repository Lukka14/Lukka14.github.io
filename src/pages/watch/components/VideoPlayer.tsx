import React, { useEffect, useState, useRef } from "react";
import { MDBContainer } from "mdb-react-ui-kit";
import { VideoPlayerProps } from "../../../models/VidePlayerProps";
import Cookies from "js-cookie";
import {  fetchMovie } from "../../../services/MediaService";
import { Endpoints } from "../../../config/Config";
import axios from "axios";
import { MediaType } from "../../../models/Movie";
import { getCurrentUser } from "../../../services/UserService";

interface WatchedList {
  [key: string]: any;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  id,
  playerUrl,
  mediaType,
  season,
  episode,
  posterURL,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [runtime, setRuntime] = useState<number | null>(null);

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

  const mediaURL = playerUrl
    .replace("{id}", id)
    .replace("{season}", season?.toString() || "")
    .replace("{episode}", episode?.toString() || "");

  const handlePlay = () => {
    setIsPlaying(true);
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

  return (
    <MDBContainer breakpoint="xl">
      <div className="ratio ratio-16x9" style={{ position: "relative" }}>
        {!isPlaying ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${posterURL})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              cursor: "pointer",
            }}
            onClick={handlePlay}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                borderRadius: "50%",
                padding: "10px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                fill="white"
                viewBox="0 0 16 16"
              >
                <path d="M4.268 1.438a.5.5 0 0 1 .518-.04l10 6a.5.5 0 0 1 0 .884l-10 6A.5.5 0 0 1 4 14.5V1.5a.5.5 0 0 1 .268-.062z" />
              </svg>
            </div>
          </div>
        ) : (
          <iframe
            sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation"
            src={mediaURL}
            title="Video Player"
            allowFullScreen
            style={{ border: 0, width: "100%", height: "100%" }}
          ></iframe>
        )}
      </div>
    </MDBContainer>
  );
};

export default VideoPlayer;