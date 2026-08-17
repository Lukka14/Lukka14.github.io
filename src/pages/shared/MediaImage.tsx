import React, { useEffect, useState } from "react";
import { Film, Image as ImageIcon, User } from "lucide-react";
import { getInitials, isPlaceholderImageUrl } from "../../utils/Utils";
import "./MediaImage.css";

export type MediaImageKind = "poster" | "still" | "person";

const KIND_ICON: Record<MediaImageKind, React.ElementType> = {
  poster: Film,
  still: ImageIcon,
  person: User,
};

interface MediaImageProps {
  src?: string | null;
  alt: string;
  /** Drives the fallback tile: a film icon, a still icon, or the person's initials. */
  kind?: MediaImageKind;
  /** Title or name. Shown inside the tile so an image-less card is still readable. */
  label?: string | null;
  /** Applied to both the image and the fallback tile, so layout CSS keeps working. */
  className?: string;
  loading?: "lazy" | "eager";
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
}

/**
 * Renders an image, or a styled in-app tile when the source is missing, is one of
 * the known "no image" placeholder URLs, or fails to load.
 */
export const MediaImage: React.FC<MediaImageProps> = ({
  src,
  alt,
  kind = "poster",
  label,
  className = "",
  loading = "lazy",
  onLoad,
}) => {
  const [failed, setFailed] = useState(false);

  // A recycled card can be handed a new src after the old one failed.
  useEffect(() => setFailed(false), [src]);

  if (isPlaceholderImageUrl(src) || failed) {
    const Icon = KIND_ICON[kind];
    const initials = kind === "person" ? getInitials(label) : null;

    return (
      <span
        className={`media-image-fallback media-image-fallback--${kind} ${className}`.trim()}
        role="img"
        aria-label={alt}
      >
        {initials ? (
          <span className="media-image-fallback-initials">{initials}</span>
        ) : (
          <>
            <Icon className="media-image-fallback-icon" aria-hidden="true" />
            {label ? (
              <span className="media-image-fallback-label">{label}</span>
            ) : null}
          </>
        )}
      </span>
    );
  }

  return (
    <img
      src={src as string}
      alt={alt}
      className={className || undefined}
      loading={loading}
      onLoad={onLoad}
      onError={() => setFailed(true)}
    />
  );
};

export default MediaImage;
