export type MediaItem = {
  id: string;
  type: "image" | "video";
  src: string;
  poster?: string;
};

export type BrokenImages = Record<string, boolean>;

export interface MediaImageProps {
  src: string;
  alt: string;
  isBroken: boolean;
  className?: string;
}

export interface MediaVideoProps {
  src: string;
  poster?: string;
  alt: string;
  isBroken: boolean;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  preload?: "none" | "metadata" | "auto";
}

export interface MediaTileProps {
  media: MediaItem;
  isBroken: boolean;
  onClick: () => void;
  tileClass: string;
  remainingCount?: number;
  postCaption?: string;
}

export interface PostHeaderProps {
  caption: string;
  mood?: string;
  createdAt?: string;
  imageCount: number;
  videoCount: number;
}

export interface MediaGridProps {
  visibleItems: MediaItem[];
  brokenImages: BrokenImages;
  totalMediaCount: number;
  postCaption?: string;
  onMediaClick: (index: number) => void;
}

export interface GalleryNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  isVisible: boolean;
}

export interface GalleryThumbnailProps {
  media: MediaItem;
  isActive: boolean;
  isBroken: boolean;
  postCaption?: string;
  onClick: () => void;
}

export interface GalleryFullscreenProps {
  media: MediaItem;
  isBroken: boolean;
  postCaption?: string;
  hasMultiple: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export interface ErrorStateProps {
  onRetry: () => void;
}
