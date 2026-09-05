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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div 
        className="bg-neutral-950 border border-neutral-900 text-white max-w-md w-full animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-neutral-900">
          <h3 className="text-base font-mono uppercase tracking-wider font-bold text-white">Select Size</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-neutral-900 text-neutral-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-xs font-mono text-neutral-400 mb-4 uppercase">{productName}</p>
          
          <div className="grid grid-cols-4 gap-2.5 mb-6">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-3 px-4 text-xs font-mono font-bold border transition-all duration-200 ${
                  selectedSize === size
                    ? 'border-white bg-white text-black'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-700 hover:text-white'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 border border-neutral-800 hover:bg-neutral-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedSize}
              className="flex-1 py-3 px-4 text-xs font-mono font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 disabled:bg-neutral-900 disabled:text-neutral-600 disabled:border-neutral-800 disabled:cursor-not-allowed transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
