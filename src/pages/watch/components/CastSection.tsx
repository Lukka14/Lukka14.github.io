import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { CastMember } from "../../../models/Movie";
import { getInitials, isPlaceholderProfileUrl } from "../../../utils/Utils";

interface CastSectionProps {
  cast?: CastMember[] | null;
}

const CastCard: React.FC<{ member: CastMember }> = ({ member }) => {
  // profileUrl is never null, so a placeholder URL is the only signal that the
  // actor has no real photo. Broken loads fall back to the same initials tile.
  const [imageFailed, setImageFailed] = useState(false);
  const showFallback = isPlaceholderProfileUrl(member.profileUrl) || imageFailed;

  return (
    <div className="watch-cast-card">
      <div className="watch-cast-avatar">
        {showFallback ? (
          <span className="watch-cast-initials">{getInitials(member.name)}</span>
        ) : (
          <img
            src={member.profileUrl}
            alt={member.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        )}
      </div>
      <span className="watch-cast-name" title={member.name}>
        {member.name}
      </span>
      {member.character && (
        <span className="watch-cast-character" title={member.character}>
          {member.character}
        </span>
      )}
      {member.episodeCount != null && (
        <span className="watch-cast-episodes">
          {member.episodeCount} episode{member.episodeCount === 1 ? "" : "s"}
        </span>
      )}
    </div>
  );
};

const CastSection: React.FC<CastSectionProps> = ({ cast }) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const syncArrows = () => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    setCanScrollLeft(track.scrollLeft > 4);
    setCanScrollRight(track.scrollLeft < maxScroll - 4);
  };

  useEffect(() => {
    syncArrows();
    window.addEventListener("resize", syncArrows);
    return () => window.removeEventListener("resize", syncArrows);
  }, [cast]);

  // The backend caps cast at 20 and already sorts by billing order, so render
  // it as-is without re-sorting.
  if (!cast || cast.length === 0) return null;

  const scrollByPage = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="watch-cast">
      <div className="watch-cast-header">
        <h2 className="watch-cast-title">
          <Users size={18} />
          Cast
        </h2>
        <div className="watch-cast-controls">
          <button
            type="button"
            className="watch-cast-button"
            onClick={() => scrollByPage(-1)}
            disabled={!canScrollLeft}
            aria-label="Scroll cast left"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            className="watch-cast-button"
            onClick={() => scrollByPage(1)}
            disabled={!canScrollRight}
            aria-label="Scroll cast right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="watch-cast-track" ref={trackRef} onScroll={syncArrows}>
        {cast.map((member) => (
          <CastCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
};

export default CastSection;
