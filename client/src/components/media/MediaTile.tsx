import React from "react";
import { MediaImage } from "./MediaImage";
import { MediaVideo } from "./MediaVideo";
import type { MediaTileProps } from "../../types/rage-of-the-day.types";

export const MediaTile: React.FC<MediaTileProps> = ({
  media,
  isBroken,
  onClick,
  tileClass,
  remainingCount = 0,
  postCaption = "Featured post media",
}) => {
  const isOverflowTile = remainingCount > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group/media relative overflow-hidden rounded-xl border border-zinc-300/90 bg-zinc-200/70 dark:border-zinc-700/90 dark:bg-zinc-900/70 ${tileClass}`}
    >
      {media.type === "image" ? (
        <MediaImage
          src={media.src}
          alt={postCaption}
          isBroken={isBroken}
          className="h-full w-full bg-black/80 object-contain p-0.5 transition duration-500 group-hover/media:scale-[1.02]"
        />
      ) : (
        <>
          {media.poster ? (
            <MediaImage
              src={media.poster}
              alt={postCaption}
              isBroken={isBroken}
              className="h-full w-full bg-black/80 object-contain p-0.5 transition duration-500 group-hover/media:scale-[1.02]"
            />
          ) : (
            <MediaVideo
              src={media.src}
              alt={postCaption}
              isBroken={isBroken}
              className="h-full w-full object-cover"
              muted
              playsInline
              preload="metadata"
            />
          )}
        </>
      )}

      {isOverflowTile && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/55 text-3xl font-black text-white">
          +{remainingCount}
        </div>
      )}
    </button>
  );
};
