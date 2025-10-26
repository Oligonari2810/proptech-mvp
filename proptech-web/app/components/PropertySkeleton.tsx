export const PropertySkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border animate-pulse">
      <div className="w-full h-48 bg-gray-300 rounded-t-lg"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-6 bg-gray-300 rounded w-1/2"></div>
        <div className="flex gap-2">
          <div className="h-4 bg-gray-300 rounded w-16"></div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
      </div>
    </div>
  );
};
