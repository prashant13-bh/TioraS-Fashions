
import React from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const VariantSelector = ({ product, selectedVariant, onVariantChange }) => {
  if (!product || !product.variants || product.variants.length === 0) {
    return null;
  }

  // Extract unique sizes and colors from variants
  const sizes = [...new Set(product.variants.map(v => {
    const sizeOption = v.options?.find(opt => opt.value.match(/^(XS|S|M|L|XL|XXL|One Size)$/i));
    return sizeOption?.value;
  }).filter(Boolean))];

  const colors = [...new Set(product.variants.map(v => {
    const colorOption = v.options?.find(opt => !opt.value.match(/^(XS|S|M|L|XL|XXL|One Size)$/i));
    return colorOption ? { name: colorOption.value, hex: getColorHex(colorOption.value) } : null;
  }).filter(Boolean))];

  const selectedSize = selectedVariant?.options?.find(opt => opt.value.match(/^(XS|S|M|L|XL|XXL|One Size)$/i))?.value;
  const selectedColor = selectedVariant?.options?.find(opt => !opt.value.match(/^(XS|S|M|L|XL|XXL|One Size)$/i))?.value;

  const handleSizeChange = (size) => {
    const newVariant = product.variants.find(v => {
      const variantSize = v.options?.find(opt => opt.value.match(/^(XS|S|M|L|XL|XXL|One Size)$/i))?.value;
      const variantColor = v.options?.find(opt => !opt.value.match(/^(XS|S|M|L|XL|XXL|One Size)$/i))?.value;
      return variantSize === size && (!selectedColor || variantColor === selectedColor);
    });
    if (newVariant) onVariantChange(newVariant);
  };

  const handleColorChange = (colorName) => {
    const newVariant = product.variants.find(v => {
      const variantSize = v.options?.find(opt => opt.value.match(/^(XS|S|M|L|XL|XXL|One Size)$/i))?.value;
      const variantColor = v.options?.find(opt => !opt.value.match(/^(XS|S|M|L|XL|XXL|One Size)$/i))?.value;
      return variantColor === colorName && (!selectedSize || variantSize === selectedSize);
    });
    if (newVariant) onVariantChange(newVariant);
  };

  const getStockStatus = () => {
    if (!selectedVariant?.manage_inventory) {
      return { status: 'In Stock', color: 'text-[hsl(var(--legal-success))]', showWarning: false };
    }
    
    const stock = selectedVariant.inventory_quantity || 0;
    if (stock === 0) {
      return { status: 'Out of Stock', color: 'text-destructive', showWarning: false };
    }
    if (stock < 5) {
      return { status: 'Low Stock', color: 'text-[hsl(var(--legal-warning))]', showWarning: true, count: stock };
    }
    return { status: 'In Stock', color: 'text-[hsl(var(--legal-success))]', showWarning: false };
  };

  const stockStatus = getStockStatus();
  const price = selectedVariant?.sale_price_formatted || selectedVariant?.price_formatted;
  const originalPrice = selectedVariant?.sale_price_in_cents ? selectedVariant?.price_formatted : null;
  const discountPercentage = originalPrice && selectedVariant?.sale_price_in_cents 
    ? Math.round(((selectedVariant.price_in_cents - selectedVariant.sale_price_in_cents) / selectedVariant.price_in_cents) * 100)
    : null;

  return (
    <div className="space-y-6">
      {/* Price Display */}
      <div className="flex items-end gap-4">
        <span className="text-4xl font-bold text-foreground">{price}</span>
        {originalPrice && (
          <>
            <span className="text-xl text-muted-foreground line-through mb-1">{originalPrice}</span>
            {discountPercentage && (
              <Badge className="mb-1 bg-destructive text-white border-none">
                -{discountPercentage}% OFF
              </Badge>
            )}
          </>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <span className={`font-bold ${stockStatus.color}`}>{stockStatus.status}</span>
        {stockStatus.showWarning && (
          <div className="flex items-center gap-1 text-[hsl(var(--legal-warning))] text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Only {stockStatus.count} left</span>
          </div>
        )}
      </div>

      {/* Color Selector */}
      {colors.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-bold text-foreground">Color: <span className="font-normal text-muted-foreground">{selectedColor || 'Select'}</span></h4>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => handleColorChange(color.name)}
                className="group relative"
                title={color.name}
              >
                <div 
                  className={`w-11 h-11 rounded-lg border-2 transition-all hover:scale-110 ${
                    selectedColor === color.name 
                      ? 'border-primary ring-2 ring-primary/20 scale-110' 
                      : 'border-border/50 hover:border-primary'
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  {selectedColor === color.name && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white drop-shadow-md" />
                    </div>
                  )}
                </div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-background px-2 py-1 rounded shadow-md">
                  {color.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selector */}
      {sizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-foreground">Size: <span className="font-normal text-muted-foreground">{selectedSize || 'Select'}</span></h4>
            <Button variant="link" className="text-primary p-0 h-auto text-sm">
              Size Guide
            </Button>
          </div>
          <div className="flex flex-wrap gap-3">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeChange(size)}
                className={`min-w-[44px] min-h-[44px] px-4 rounded-lg border-2 font-bold text-sm transition-all hover:border-primary ${
                  selectedSize === size
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border/50 text-foreground hover:bg-muted'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to map color names to hex codes
function getColorHex(colorName) {
  const colorMap = {
    'White': '#FFFFFF',
    'Black': '#000000',
    'Navy': '#1a1a2e',
    'Red': '#DC2626',
    'Green': '#16A34A',
    'Blue': '#2563EB',
    'Yellow': '#EAB308',
    'Gray': '#6B7280',
    'Grey': '#6B7280',
    'Pink': '#EC4899',
    'Purple': '#9333EA',
    'Orange': '#EA580C',
    'Brown': '#92400E',
    'Beige': '#D4C5B9',
    'Charcoal': '#36454F',
    'Maroon': '#800000',
    'Olive': '#808000',
    'Teal': '#008080',
    'Coral': '#FF7F50',
    'Lavender': '#E6E6FA'
  };
  return colorMap[colorName] || '#D4AF37'; // Default to gold if not found
}

export default VariantSelector;
