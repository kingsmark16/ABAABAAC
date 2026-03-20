import React from "react";
import type { GalleryThumbnailProps } from "../../types/rage-of-the-day.types";

export const GalleryThumbnail: React.FC<GalleryThumbnailProps> = ({
  media,
  isActive,
  isBroken,
  postCaption = "",
  onClick,
}) => (
  <button
    key={`thumb-${media.id}`}
    type="button"
    onClick={onClick}
    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border sm:h-20 sm:w-20 ${isActive ? "border-orange-400" : "border-zinc-700"}`}
  >
    {media.type === "image" ? (
      !isBroken ? (
        <img
          src={media.src}
          alt={postCaption || "Media thumbnail"}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-[10px] text-zinc-300">
          Error
        </div>
      )
    ) : (
      <>
        {media.poster ? (
          <img
            src={media.poster}
            alt={postCaption || "Video thumbnail"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-[10px] text-zinc-300">
            Video
          </div>
        )}
      </>
    )}
  </button>
);
