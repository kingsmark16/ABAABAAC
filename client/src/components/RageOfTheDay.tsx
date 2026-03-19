import { useFeatureRage } from "@/hooks/featuredPost/use-featureRage"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Flame, Images, RefreshCcw, Sparkles, Video } from "lucide-react";
import { useMemo, useState } from "react";

const moodStyles: Record<string, string> = {
  HAPPY: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:text-emerald-300",
  SAD: "bg-sky-500/15 text-sky-700 ring-sky-500/30 dark:text-sky-300",
  RAGE: "bg-rose-500/15 text-rose-700 ring-rose-500/30 dark:text-rose-300",
};

const formatDate = (value?: string) => {
  if (!value) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

type MediaItem = {
  id: string;
  type: "image" | "video";
  src: string;
  poster?: string;
};

const getMediaTileClass = (total: number, index: number) => {
  if (total === 1) {
    return "col-span-2 h-64 lg:h-80";
  }

  if (total === 2) {
    return "h-48 lg:h-64";
  }

  if (total === 3 && index === 0) {
    return "col-span-2 h-56 lg:h-72";
  }

  return "h-48 lg:h-64";
};

const RageOfTheDay = () => {
  const { data: post, isLoading, isError, refetch } = useFeatureRage();
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const mediaItems = useMemo<MediaItem[]>(() => {
    if (!post) return [];

    const images: MediaItem[] = post.pictures
      .filter((picture) => Boolean(picture.url))
      .map((picture) => ({
        id: `image-${picture.id}`,
        type: "image",
        src: picture.url,
      }));

    const videos: MediaItem[] = post.videos
      .filter((video) => Boolean(video.url))
      .map((video) => ({
        id: `video-${video.id}`,
        type: "video",
        src: video.url,
        poster: video.thumbnailUrl || undefined,
      }));

    return [...images, ...videos];
  }, [post]);

  const visibleMediaItems = mediaItems.slice(0, 4);
  const remainingCount = Math.max(mediaItems.length - 4, 0);
  const activeMedia = mediaItems[activeMediaIndex];

  const openGalleryAt = (index: number) => {
    setActiveMediaIndex(index);
    setIsGalleryOpen(true);
  };

  const goToPrevious = () => {
    if (!mediaItems.length) return;
    setActiveMediaIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  const goToNext = () => {
    if (!mediaItems.length) return;
    setActiveMediaIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const moodClass = moodStyles[post?.mood ?? ""] ?? "bg-zinc-500/15 text-zinc-700 ring-zinc-500/30 dark:text-zinc-300";

  if (isLoading) {
    return (
      <section className="w-full px-2.5 pb-3 md:px-3">
        <div className="relative mx-auto max-w-2xl lg:max-w-3xl overflow-hidden rounded-xl border border-border/40 bg-linear-to-br from-zinc-100 to-zinc-200 p-2 md:p-2.5 dark:from-zinc-900 dark:to-zinc-800">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-40 rounded bg-zinc-300/70 dark:bg-zinc-700/70" />
            <div className="h-7 w-2/3 rounded bg-zinc-300/70 dark:bg-zinc-700/70" />
            <div className="h-4 w-full rounded bg-zinc-300/70 dark:bg-zinc-700/70" />
            <div className="h-4 w-5/6 rounded bg-zinc-300/70 dark:bg-zinc-700/70" />
            <div className="h-24 w-full rounded-xl bg-zinc-300/70 dark:bg-zinc-700/70" />
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="w-full px-2.5 pb-3 md:px-3">
        <div className="mx-auto max-w-2xl lg:max-w-3xl rounded-xl border border-rose-400/30 bg-rose-500/10 p-2 text-rose-700 dark:text-rose-300">
          <p className="text-sm font-semibold uppercase tracking-[0.2em]">Rage Of The Day</p>
          <p className="mt-2 text-sm font-semibold">Could not load featured post.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-medium transition hover:bg-rose-500/20"
          >
            <RefreshCcw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="w-full px-2.5 pb-3 md:px-3">
        <div className="mx-auto max-w-2xl lg:max-w-3xl rounded-xl border border-border/50 bg-card p-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Rage Of The Day</p>
          <p className="mt-2 text-sm font-semibold text-foreground">No featured post available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full mb-8 px-2.5 pb-5 md:px-3">
      <div className="group relative mx-auto max-w-2xl lg:max-w-4xl overflow-hidden rounded-xl border border-zinc-200/60 bg-linear-to-br from-amber-50 via-rose-50 to-orange-100 p-2 shadow-lg shadow-orange-500/10 md:p-2.5 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 dark:shadow-black/40">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-linear-to-br from-orange-400/35 to-rose-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 h-56 w-56 rounded-full bg-linear-to-tr from-red-400/25 to-amber-400/5 blur-3xl" />

        <div className="relative z-10 space-y-2">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-700 dark:text-orange-300">
              <Flame className="h-3.5 w-3.5" />
              Rage Of The Day
            </div>

            <h2 className="mt-1 text-sm font-black leading-tight tracking-tight text-zinc-900 md:text-lg dark:text-zinc-100">
              {post.caption || "Untitled Campus Fury"}
            </h2>

            <div className="mt-1.5 flex flex-wrap items-center gap-1">
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${moodClass}`}>
                <Sparkles className="h-3.5 w-3.5" />
                {post.mood}
              </span>
              <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-zinc-700 ring-1 ring-black/10 dark:bg-white/5 dark:text-zinc-300 dark:ring-white/10">
                {formatDate(post.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-zinc-700 ring-1 ring-black/10 dark:bg-white/5 dark:text-zinc-300 dark:ring-white/10">
                <Images className="h-3.5 w-3.5" />
                {post.pictures.filter((picture) => !!picture.url).length}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-zinc-700 ring-1 ring-black/10 dark:bg-white/5 dark:text-zinc-300 dark:ring-white/10">
                <Video className="h-3.5 w-3.5" />
                {post.videos.filter((video) => !!video.url).length}
              </span>
            </div>
          </div>

          <div className="relative -mx-1 overflow-hidden rounded-xl border border-zinc-300/80 bg-white/40 p-0 backdrop-blur-sm md:-mx-1.5 dark:border-zinc-700/80 dark:bg-zinc-950/40">
            <div className="grid grid-cols-2 gap-px">
              {visibleMediaItems.length > 0 ? (
                visibleMediaItems.map((media, index) => {
                  const isOverflowTile = index === 3 && remainingCount > 0;

                  return (
                  <button
                    key={media.id}
                    type="button"
                    onClick={() => openGalleryAt(index)}
                    className={`group/media relative overflow-hidden rounded-xl border border-zinc-300/90 bg-zinc-200/70 dark:border-zinc-700/90 dark:bg-zinc-900/70 ${getMediaTileClass(mediaItems.length, index)}`}
                  >
                    {media.type === "image" && !brokenImages[media.id] ? (
                      <img
                        src={media.src}
                        alt={post.caption || "Featured post media"}
                        className="h-full w-full bg-black/80 object-contain p-0.5 transition duration-500 group-hover/media:scale-[1.02]"
                        onError={() =>
                          setBrokenImages((prev) => ({
                            ...prev,
                            [media.id]: true,
                          }))
                        }
                      />
                    ) : media.type === "video" ? (
                      media.poster ? (
                        <img
                          src={media.poster}
                          alt={post.caption || "Featured post video"}
                          className="h-full w-full bg-black/80 object-contain p-0.5 transition duration-500 group-hover/media:scale-[1.02]"
                          onError={() =>
                            setBrokenImages((prev) => ({
                              ...prev,
                              [media.id]: true,
                            }))
                          }
                        />
                      ) : (
                        <video
                          src={media.src}
                          className="h-full w-full object-cover"
                          muted
                          playsInline
                          preload="metadata"
                        />
                      )
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-zinc-200/80 text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-300">
                        Media unavailable
                      </div>
                    )}

                    {isOverflowTile && (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/55 text-3xl font-black text-white">
                        +{remainingCount}
                      </div>
                    )}
                  </button>
                )})
              ) : (
                <div className="col-span-2 flex h-28 items-center justify-center rounded-xl bg-zinc-200/70 text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-300">
                  No media preview
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent
          showCloseButton={true}
          className="w-[96vw] max-w-6xl overflow-hidden border-zinc-600/70 bg-zinc-950/95 p-3 text-white shadow-2xl shadow-black/60 backdrop-blur-md sm:p-4"
        >
          <DialogTitle className="sr-only">Featured media gallery</DialogTitle>

          {activeMedia ? (
            <div className="min-w-0 space-y-3">
              <div className="relative flex h-[72vh] w-full min-w-0 items-center justify-center overflow-hidden rounded-xl bg-black">
                {activeMedia.type === "image" && !brokenImages[activeMedia.id] ? (
                  <img
                    src={activeMedia.src}
                    alt={post.caption || "Featured post media fullscreen"}
                    className="h-full w-full object-contain"
                    onError={() =>
                      setBrokenImages((prev) => ({
                        ...prev,
                        [activeMedia.id]: true,
                      }))
                    }
                  />
                ) : activeMedia.type === "video" ? (
                  <video
                    src={activeMedia.src}
                    poster={activeMedia.poster}
                    className="h-full w-full object-contain"
                    controls
                    playsInline
                    autoPlay
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-zinc-300">
                    Media unavailable
                  </div>
                )}

                {mediaItems.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={goToPrevious}
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80"
                      aria-label="Previous media"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={goToNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80"
                      aria-label="Next media"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              <div className="w-full max-w-full min-w-0 overflow-x-auto pb-1 [scrollbar-width:thin]">
                <div className="flex w-max min-w-full gap-2">
                {mediaItems.map((media, index) => (
                  <button
                    key={`thumb-${media.id}`}
                    type="button"
                    onClick={() => setActiveMediaIndex(index)}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border sm:h-20 sm:w-20 ${index === activeMediaIndex ? "border-orange-400" : "border-zinc-700"}`}
                  >
                    {media.type === "image" && !brokenImages[media.id] ? (
                      <img
                        src={media.src}
                        alt={post.caption || "Media thumbnail"}
                        className="h-full w-full object-cover"
                        onError={() =>
                          setBrokenImages((prev) => ({
                            ...prev,
                            [media.id]: true,
                          }))
                        }
                      />
                    ) : media.type === "video" ? (
                      media.poster ? (
                        <img
                          src={media.poster}
                          alt={post.caption || "Video thumbnail"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-[10px] text-zinc-300">
                          Video
                        </div>
                      )
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-[10px] text-zinc-300">
                        Error
                      </div>
                    )}
                  </button>
                ))}
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default RageOfTheDay