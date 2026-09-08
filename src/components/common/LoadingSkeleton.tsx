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
  const baseClasses = 'animate-pulse bg-neutral-900';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
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
  <div className="flex flex-col bg-transparent select-none font-inter w-full animate-pulse">
    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 rounded-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full animate-shimmer" />
    </div>
    <div className="pt-2 px-0.5 text-left font-inter space-y-1.5">
      <div className="h-3.5 bg-neutral-900 rounded w-3/4" />
      <div className="h-3.5 bg-neutral-900 rounded w-1/3" />
    </div>
  </div>
);

export const OrderCardSkeleton = () => (
  <div className="bg-neutral-950 rounded-lg p-4 space-y-3 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="space-y-1.5 flex-1">
        <div className="h-4 bg-neutral-900 rounded w-28" />
        <div className="h-3 bg-neutral-900 rounded w-20" />
      </div>
      <div className="h-5 bg-neutral-900 rounded w-16" />
    </div>
    <div className="flex gap-2 pt-1">
      <div className="w-10 h-12 bg-neutral-900 rounded" />
      <div className="w-10 h-12 bg-neutral-900 rounded" />
    </div>
  </div>
);

export const TableRowSkeleton = ({ columns = 5 }: { columns?: number }) => (
  <tr>
    {Array.from({ length: columns }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-neutral-900 rounded w-full animate-pulse" />
      </td>
    ))}
  </tr>
);
