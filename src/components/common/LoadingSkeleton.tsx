interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
}

export const LoadingSkeleton = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
}: LoadingSkeletonProps) => {
  const baseClasses = 'animate-pulse bg-neutral-800';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

export const ProductCardSkeleton = () => (
  <div className="flex flex-col bg-transparent animate-pulse w-full">
    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 rounded-sm">
      <div className="absolute top-2.5 left-2.5 w-16 h-3 bg-neutral-800 rounded-sm" />
      <div className="absolute top-2.5 right-2.5 w-6 h-6 bg-neutral-800 rounded-full" />
      <div className="absolute bottom-2.5 left-2.5 w-24 h-3.5 bg-neutral-800 rounded-sm" />
    </div>
    <div className="pt-3 pb-2 px-1 text-left space-y-1.5">
      <div className="h-3.5 bg-neutral-800 rounded w-4/5" />
      <div className="h-2.5 bg-neutral-800/70 rounded w-1/2" />
      <div className="h-3.5 bg-neutral-800 rounded w-1/3 pt-0.5" />
    </div>
  </div>
);

export const OrderCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-2 flex-1">
        <LoadingSkeleton className="h-5 w-32" />
        <LoadingSkeleton className="h-4 w-48" />
      </div>
      <LoadingSkeleton className="h-6 w-24" />
    </div>
    <div className="space-y-2">
      <LoadingSkeleton className="h-4 w-full" />
      <LoadingSkeleton className="h-4 w-3/4" />
    </div>
    <div className="mt-4 pt-4 border-t border-gray-200">
      <LoadingSkeleton className="h-6 w-32" />
    </div>
  </div>
);

export const TableRowSkeleton = ({ columns = 5 }: { columns?: number }) => (
  <tr>
    {Array.from({ length: columns }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <LoadingSkeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);
