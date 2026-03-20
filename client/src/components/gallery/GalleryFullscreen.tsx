import React from "react";
import { MediaImage } from "../media/MediaImage";
import { MediaVideo } from "../media/MediaVideo";
import { GalleryNavigation } from "./GalleryNavigation";
import type { GalleryFullscreenProps } from "../../types/rage-of-the-day.types";

export const GalleryFullscreen: React.FC<GalleryFullscreenProps> = ({
  media,
  isBroken,
  postCaption = "",
  hasMultiple,
  onPrevious,
  onNext,
}) => (
  <div className="relative flex h-[72vh] w-full min-w-0 items-center justify-center overflow-hidden rounded-xl bg-black">
    {media.type === "image" ? (
      <MediaImage
        src={media.src}
        alt={postCaption || "Featured post media fullscreen"}
        isBroken={isBroken}
        className="h-full w-full object-contain"
      />
    ) : (
      <MediaVideo
        src={media.src}
        poster={media.poster}
        alt={postCaption || "Featured post video"}
        isBroken={isBroken}
        className="h-full w-full object-contain"
        controls
        autoPlay
      />
    )}

    <GalleryNavigation onPrevious={onPrevious} onNext={onNext} isVisible={hasMultiple} />
  </div>
);
