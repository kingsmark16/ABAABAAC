import React from "react";
import { RefreshCcw } from "lucide-react";
import type { ErrorStateProps } from "../../../types/rage-of-the-day.types";

export const ErrorState: React.FC<ErrorStateProps> = ({ onRetry }) => (
  <section className="w-full px-2.5 pb-3 md:px-3">
    <div className="mx-auto max-w-2xl lg:max-w-3xl rounded-xl border border-rose-400/30 bg-rose-500/10 p-2 text-rose-700 dark:text-rose-300">
      <p className="text-sm font-semibold uppercase tracking-[0.2em]">Rage Of The Day</p>
      <p className="mt-2 text-sm font-semibold">Could not load featured post.</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-medium transition hover:bg-rose-500/20"
      >
        <RefreshCcw className="h-4 w-4" />
        Try again
      </button>
    </div>
  </section>
);
