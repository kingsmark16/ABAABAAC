import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useFeatureRage } from "@/hooks/featuredPost/use-featureRage";
import { MediaGrid } from "../media/MediaGrid";
import { GalleryFullscreen } from "../gallery/GalleryFullscreen";
import { GalleryThumbnail } from "../gallery/GalleryThumbnail";
import { PostHeader } from "./subcomponents/PostHeader";
import { LoadingState } from "./subcomponents/LoadingState";
import { ErrorState } from "./subcomponents/ErrorState";
import { EmptyState } from "./subcomponents/EmptyState";
import { useGalleryState } from "../../hooks/featuredPost/useGalleryState";
import { useMediaItems } from "../../hooks/featuredPost/useMediaItems";
import { VISIBLE_MEDIA_ITEMS } from "../../constants/rage-of-the-day.constants";
import type { BrokenImages } from "../../types/rage-of-the-day.types";

// ============================================================================
// Main Component
// ============================================================================

const RageOfTheDay: React.FC = () => {
  const { data: post, isLoading, isError, refetch } = useFeatureRage();
  const [brokenImages] = useState<BrokenImages>({});

  const mediaItems = useMediaItems(post);
  const { isOpen, setIsOpen, activeIndex, goToPrevious, goToNext, openAt } = useGalleryState(mediaItems.length);

  const visibleMediaItems = mediaItems.slice(0, VISIBLE_MEDIA_ITEMS);
  const activeMedia = mediaItems[activeIndex];

  // Render states
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={refetch} />;
  if (!post) return <EmptyState />;

  const imageCount = post.picture?.url ? 1 : 0;
  const videoCount = post.video?.url ? 1 : 0;

  return (
    <section className="w-full mb-8 px-2.5 pb-5 md:px-3">
      <div className="group relative mx-auto max-w-2xl lg:max-w-4xl overflow-hidden rounded-xl border border-zinc-200/60 bg-linear-to-br from-amber-50 via-rose-50 to-orange-100 p-2 shadow-lg shadow-orange-500/10 md:p-2.5 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 dark:shadow-black/40">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-linear-to-br from-orange-400/35 to-rose-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 h-56 w-56 rounded-full bg-linear-to-tr from-red-400/25 to-amber-400/5 blur-3xl" />

        <div className="relative z-10 space-y-2">
          <PostHeader
            caption={post.caption || ""}
            mood={post.mood}
            createdAt={post.createdAt}
            imageCount={imageCount}
            videoCount={videoCount}
          />

          <div className="relative -mx-1 overflow-hidden rounded-xl border border-zinc-300/80 bg-white/40 p-0 backdrop-blur-sm md:-mx-1.5 dark:border-zinc-700/80 dark:bg-zinc-950/40">
            <MediaGrid
              visibleItems={visibleMediaItems}
              brokenImages={brokenImages}
              totalMediaCount={mediaItems.length}
              postCaption={post.caption || ""}
              onMediaClick={openAt}
            />
          </div>
        </div>
      </div>

      {/* Gallery Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          showCloseButton={true}
          className="w-[96vw] max-w-6xl overflow-hidden border-zinc-600/70 bg-zinc-950/95 p-3 text-white shadow-2xl shadow-black/60 backdrop-blur-md sm:p-4"
        >
          <DialogTitle className="sr-only">Featured media gallery</DialogTitle>

          {activeMedia ? (
            <div className="min-w-0 space-y-3">
              <GalleryFullscreen
                media={activeMedia}
                isBroken={brokenImages[activeMedia.id] ?? false}
                postCaption={post.caption || ""}
                hasMultiple={mediaItems.length > 1}
                onPrevious={goToPrevious}
                onNext={goToNext}
              />

              {/* Thumbnail strip */}
              <div className="w-full max-w-full min-w-0 overflow-x-auto pb-1 [scrollbar-width:thin]">
                <div className="flex w-max min-w-full gap-2">
                  {mediaItems.map((media, index) => (
                    <GalleryThumbnail
                      key={`thumb-${media.id}`}
                      media={media}
                      isActive={index === activeIndex}
                      isBroken={brokenImages[media.id] ?? false}
                      postCaption={post.caption || ""}
                      onClick={() => openAt(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default RageOfTheDay;