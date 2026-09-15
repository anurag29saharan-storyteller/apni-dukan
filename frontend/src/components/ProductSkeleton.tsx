export default function ProductSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white">
      <div className="aspect-square animate-pulse bg-ink-100" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-16 animate-pulse rounded bg-ink-100" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-ink-100" />
        <div className="h-6 w-20 animate-pulse rounded bg-ink-100" />
      </div>
    </div>
  );
}