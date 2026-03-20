import React from "react";
import type { MediaVideoProps } from "../../../types/rage-of-the-day.types";

export const MediaVideo: React.FC<MediaVideoProps> = ({
  src,
  poster,
  isBroken,
  className = "",
  controls = false,
  autoPlay = false,
  muted = true,
  playsInline = true,
  preload = "metadata",
}) => {
  if (isBroken) {
    return (
      <div className={`flex items-center justify-center bg-zinc-200/80 text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-300 ${className}`}>
        Media unavailable
      </div>
    );
  }

  return (
    <video
      src={src}
      poster={poster}
      className={className}
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      playsInline={playsInline}
      preload={preload}
    />
  );
};
