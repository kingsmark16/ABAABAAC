import { MOOD_STYLES, DEFAULT_MOOD_CLASS } from "../constants/rage-of-the-day.constants";

export const formatDate = (value?: string): string => {
  if (!value) return "Unknown date";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

export const getMoodClass = (mood?: string): string => {
  if (!mood) return DEFAULT_MOOD_CLASS;
  return MOOD_STYLES[mood] ?? DEFAULT_MOOD_CLASS;
};

export const getMediaTileClass = (total: number, index: number): string => {
  if (total === 1) return "col-span-2 h-64 lg:h-80";
  if (total === 2) return "h-48 lg:h-64";
  if (total === 3 && index === 0) return "col-span-2 h-56 lg:h-72";
  return "h-48 lg:h-64";
};
