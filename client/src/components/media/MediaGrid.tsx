import React from "react";
import { MediaTile } from "./MediaTile";
import { VISIBLE_MEDIA_ITEMS } from "../../constants/rage-of-the-day.constants";
import { getMediaTileClass } from "../../utils/rage-of-the-day.utils";
import type { MediaGridProps } from "../../types/rage-of-the-day.types";

export const MediaGrid: React.FC<MediaGridProps> = ({
  visibleItems,
  brokenImages,
  totalMediaCount,
  postCaption = "",
  onMediaClick,
}) => {
  return (
    <div className="grid grid-cols-2 gap-px">
      {visibleItems.length > 0 ? (
        visibleItems.map((media, index) => {
          const remainingCount = Math.max(totalMediaCount - VISIBLE_MEDIA_ITEMS, 0);
          const isOverflowTile = index === 3 && remainingCount > 0;
          const tileClass = getMediaTileClass(totalMediaCount, index);

          return (
            <MediaTile
              key={media.id}
              media={media}
              isBroken={brokenImages[media.id] ?? false}
              onClick={() => onMediaClick(index)}
              tileClass={tileClass}
              remainingCount={isOverflowTile ? remainingCount : 0}
              postCaption={postCaption}
            />
          );
        })
      ) : (
        <div className="col-span-2 flex h-28 items-center justify-center rounded-xl bg-zinc-200/70 text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-300">
          No media preview
        </div>
      )}
    </div>
  );
};
