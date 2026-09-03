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
  const baseClasses = 'animate-pulse bg-gray-300';
  
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

// Specialized skeleton components
export const ProductCardSkeleton = () => (
  <div className="w-full">
    {/* Image skeleton - matches ProductCard aspect-square */}
    <LoadingSkeleton className="aspect-square mb-3" />
    
    {/* Product info skeleton - matches ProductCard spacing */}
    <div className="space-y-1">
      {/* Product name - 2 lines */}
      <LoadingSkeleton className="h-4 w-full" />
      <LoadingSkeleton className="h-4 w-3/4 mb-1" />
      
      {/* Price */}
      <LoadingSkeleton className="h-4 w-20" />
      
      {/* Button */}
      <LoadingSkeleton className="h-[44px] w-full mt-2" />
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
