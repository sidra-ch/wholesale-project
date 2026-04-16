export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-5 w-20 bg-gray-200 rounded" />
        <div className="h-10 w-full bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
    </div>
  );
}
