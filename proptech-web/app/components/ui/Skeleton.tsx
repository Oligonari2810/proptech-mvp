import React from "react";

export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse rounded-lg bg-gray-200 ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-4">
      <Skeleton className="aspect-[4/3]" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export default Skeleton;
