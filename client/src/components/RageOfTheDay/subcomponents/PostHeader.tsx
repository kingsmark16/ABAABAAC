import React from "react";
import { Flame, Images, Sparkles, Video } from "lucide-react";
import { getMoodClass, formatDate } from "../../../utils/rage-of-the-day.utils";
import type { PostHeaderProps } from "../../../types/rage-of-the-day.types";

export const PostHeader: React.FC<PostHeaderProps> = ({
  caption,
  mood,
  createdAt,
  imageCount,
  videoCount,
}) => (
  <div>
    <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-700 dark:text-orange-300">
      <Flame className="h-3.5 w-3.5" />
      Rage Of The Day
    </div>

    <h2 className="mt-1 text-sm font-black leading-tight tracking-tight text-zinc-900 md:text-lg dark:text-zinc-100">
      {caption || "Untitled Campus Fury"}
    </h2>

    <div className="mt-1.5 flex flex-wrap items-center gap-1">
      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getMoodClass(mood)}`}>
        <Sparkles className="h-3.5 w-3.5" />
        {mood}
      </span>
      <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-zinc-700 ring-1 ring-black/10 dark:bg-white/5 dark:text-zinc-300 dark:ring-white/10">
        {formatDate(createdAt)}
      </span>
      <span className="inline-flex items-center gap-1 rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-zinc-700 ring-1 ring-black/10 dark:bg-white/5 dark:text-zinc-300 dark:ring-white/10">
        <Images className="h-3.5 w-3.5" />
        {imageCount}
      </span>
      <span className="inline-flex items-center gap-1 rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-zinc-700 ring-1 ring-black/10 dark:bg-white/5 dark:text-zinc-300 dark:ring-white/10">
        <Video className="h-3.5 w-3.5" />
        {videoCount}
      </span>
    </div>
  </div>
);
