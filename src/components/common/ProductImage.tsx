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
    <div className={`relative ${aspectClass} bg-neutral-900 overflow-hidden ${className}`}>
      {imageState === 'loading' && (
        <div className="absolute inset-0 bg-neutral-800 animate-pulse" />
      )}

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

      {imageState === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 text-neutral-500">
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 mb-2 text-neutral-600"
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
          <span className="text-[10px] sm:text-xs font-mono font-medium">Image unavailable</span>
        </div>
      )}
    </div>
  );
};
