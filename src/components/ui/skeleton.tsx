import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('rounded-sm skeleton-shimmer bg-sandal', className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-md border border-hairline bg-ivory overflow-hidden">
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <div className="p-4 space-y-2.5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3.5 w-1/2" />
        <Skeleton className="h-4 w-1/3 mt-2" />
      </div>
    </div>
  );
}

