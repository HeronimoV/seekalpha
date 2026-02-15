"use client";

import { FC } from "react";

export const MarketCardSkeleton: FC = () => (
  <div className="rounded-xl bg-seek-card border border-seek-border p-4 md:p-5 animate-pulse">
    {/* Category + Time */}
    <div className="flex items-center justify-between mb-3">
      <div className="h-5 w-16 bg-seek-border rounded-full" />
      <div className="h-4 w-20 bg-seek-border rounded" />
    </div>
    {/* Title */}
    <div className="h-5 w-3/4 bg-seek-border rounded mb-2" />
    {/* Description */}
    <div className="h-4 w-full bg-seek-border rounded mb-1" />
    <div className="h-4 w-2/3 bg-seek-border rounded mb-4" />
    {/* Progress bar */}
    <div className="flex justify-between mb-1">
      <div className="h-3 w-16 bg-seek-border rounded" />
      <div className="h-3 w-16 bg-seek-border rounded" />
    </div>
    <div className="h-2 w-full bg-seek-border rounded-full mb-4" />
    {/* Pool + button */}
    <div className="flex justify-between mb-4">
      <div className="h-4 w-24 bg-seek-border rounded" />
      <div className="h-4 w-16 bg-seek-border rounded" />
    </div>
    <div className="h-10 w-full bg-seek-border rounded-lg" />
  </div>
);

export const MarketGridSkeleton: FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <MarketCardSkeleton key={i} />
    ))}
  </div>
);

export const StatCardSkeleton: FC = () => (
  <div className="bg-seek-card border border-seek-border rounded-xl p-4 animate-pulse">
    <div className="h-3 w-16 bg-seek-border rounded mb-2" />
    <div className="h-7 w-20 bg-seek-border rounded" />
  </div>
);

export const PortfolioSkeleton: FC = () => (
  <div className="animate-pulse space-y-4">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="bg-seek-card border border-seek-border rounded-xl p-5 flex items-center justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <div className="h-5 w-14 bg-seek-border rounded-full" />
            <div className="h-5 w-16 bg-seek-border rounded-full" />
          </div>
          <div className="h-5 w-2/3 bg-seek-border rounded" />
          <div className="h-4 w-1/2 bg-seek-border rounded" />
        </div>
        <div className="h-8 w-20 bg-seek-border rounded-lg" />
      </div>
    ))}
  </div>
);

export const LeaderboardSkeleton: FC = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-seek-card border border-seek-border rounded-xl p-5 text-center">
          <div className="h-8 w-16 bg-seek-border rounded mx-auto mb-2" />
          <div className="h-4 w-20 bg-seek-border rounded mx-auto" />
        </div>
      ))}
    </div>
    <div className="bg-seek-card border border-seek-border rounded-xl p-6">
      <div className="h-6 w-48 bg-seek-border rounded mb-6" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border border-seek-border rounded-lg">
            <div className="h-6 w-8 bg-seek-border rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 bg-seek-border rounded" />
              <div className="h-2 w-1/2 bg-seek-border rounded" />
            </div>
            <div className="h-5 w-16 bg-seek-border rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
