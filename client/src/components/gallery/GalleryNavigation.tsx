import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryNavigationProps } from "../../types/rage-of-the-day.types";

export const GalleryNavigation: React.FC<GalleryNavigationProps> = ({ onPrevious, onNext, isVisible }) => {
  if (!isVisible) return null;

  return (
    <>
      <button
        type="button"
        onClick={onPrevious}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80"
        aria-label="Previous media"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={onNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80"
        aria-label="Next media"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </>
  );
};
