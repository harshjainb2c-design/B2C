import { useState, useEffect } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  aspectRatio?: 'square' | 'auto';
  onError?: () => void;
}

export const ProductImage = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  aspectRatio = 'square',
  onError,
}: ProductImageProps) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [imageSrc, setImageSrc] = useState<string>(src);

  useEffect(() => {
    setImageState('loading');
    setImageSrc(src);
  }, [src]);

  const handleLoad = () => {
    setImageState('loaded');
  };

  const handleError = () => {
    setImageState('error');
    onError?.();
  };

  const aspectClass = aspectRatio === 'square' ? 'aspect-square' : '';

  return (
    <div className={`relative ${aspectClass} bg-sand overflow-hidden ${className}`}>
      {/* Blur placeholder - shown while loading */}
      {imageState === 'loading' && (
        <div className="absolute inset-0 bg-gradient-to-br from-sand via-beige-200 to-beige-300 animate-pulse" />
      )}

      {/* Actual image */}
      {imageState !== 'error' && (
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageState === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
          loading={loading}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {/* Error state */}
      {imageState === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-sand text-taupe">
          <svg
            className="w-12 h-12 sm:w-16 sm:h-16 mb-2 text-beige-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-[10px] sm:text-xs font-medium">Image unavailable</span>
        </div>
      )}
    </div>
  );
};
