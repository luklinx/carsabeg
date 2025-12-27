export function GallerySkeleton() {
  return (
    <div className="w-full rounded-2xl bg-gray-100 animate-pulse h-64 md:h-96" />
  );
}

export function SimilarCarsSkeleton() {
  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-40 rounded-xl bg-gray-100 animate-pulse" />
      ))}
    </div>
  );
}

export function SpecsSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-12 rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow border border-gray-100">
      <div className="h-8 bg-gray-100 rounded-lg mb-4 animate-pulse" />
      <div className="h-40 bg-gray-100 rounded-lg animate-pulse" />
    </div>
  );
}
