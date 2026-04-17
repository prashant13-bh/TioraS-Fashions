
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus } from 'lucide-react';

const QuantitySelector = ({ quantity, setQuantity, maxQuantity = 99, minQuantity = 1 }) => {
  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > minQuantity) {
      setQuantity(quantity - 1);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || minQuantity;
    if (value >= minQuantity && value <= maxQuantity) {
      setQuantity(value);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={quantity <= minQuantity}
        className="h-11 w-11 rounded-lg border-border/60 hover:bg-muted disabled:opacity-50 touch-manipulation"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        min={minQuantity}
        max={maxQuantity}
        className="w-16 h-11 text-center text-foreground font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={quantity >= maxQuantity}
        className="h-11 w-11 rounded-lg border-border/60 hover:bg-muted disabled:opacity-50 touch-manipulation"
      >
        <Plus className="h-4 w-4" />
      </Button>
      {maxQuantity < 99 && (
        <span className="text-xs text-muted-foreground ml-2">Max: {maxQuantity}</span>
      )}
    </div>
  );
};

export default QuantitySelector;
