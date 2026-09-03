import { useState } from 'react';
import { X } from 'lucide-react';

interface SizeSelectorProps {
  sizes: string[];
  productName: string;
  onSelect: (size: string) => void;
  onClose: () => void;
}

export const SizeSelector = ({ sizes, productName, onSelect, onClose }: SizeSelectorProps) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selectedSize) {
      onSelect(selectedSize);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-beige-200">
          <h3 className="text-lg font-bold text-warmBrown">Select Size</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-sand rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-taupe" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-taupe mb-4">{productName}</p>
          
          {/* Size Grid */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-3 px-4 text-sm font-semibold rounded-lg border-2 transition-all duration-200 ${
                  selectedSize === size
                    ? 'border-warmBrown bg-warmBrown text-white'
                    : 'border-beige-300 text-warmBrown hover:border-warmBrown hover:bg-sand'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 text-sm font-semibold text-warmBrown border-2 border-beige-300 rounded-lg hover:bg-sand transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedSize}
              className="flex-1 py-3 px-4 text-sm font-semibold text-white bg-warmBrown rounded-lg hover:bg-taupe disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
