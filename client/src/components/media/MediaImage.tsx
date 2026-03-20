import React from "react";
import type { MediaImageProps } from "../../../types/rage-of-the-day.types";

export const MediaImage: React.FC<MediaImageProps> = ({ src, alt, isBroken, className = "" }) => {
  if (isBroken) {
    return (
      <div className={`flex items-center justify-center bg-zinc-200/80 text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-300 ${className}`}>
        Media unavailable
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} />;
};
