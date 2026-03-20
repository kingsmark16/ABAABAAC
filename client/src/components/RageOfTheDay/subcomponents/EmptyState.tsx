import React from "react";

export const EmptyState: React.FC = () => (
  <section className="w-full px-2.5 pb-3 md:px-3">
    <div className="mx-auto max-w-2xl lg:max-w-3xl rounded-xl border border-border/50 bg-card p-2">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Rage Of The Day</p>
      <p className="mt-2 text-sm font-semibold text-foreground">No featured post available yet.</p>
    </div>
  </section>
);
