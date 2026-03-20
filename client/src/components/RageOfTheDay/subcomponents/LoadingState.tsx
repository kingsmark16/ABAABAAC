import React from "react";

export const LoadingState: React.FC = () => (
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
