
import React, { useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const clothTypes = [
  { 
    id: 'tshirt', 
    name: 'T-Shirt', 
    basePrice: 299, 
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400',
    material: '100% Cotton',
    weight: '180 GSM',
    care: 'Machine wash cold, tumble dry low'
  },
  { 
    id: 'hoodie', 
    name: 'Hoodie', 
    basePrice: 799, 
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400',
    material: '80% Cotton, 20% Polyester',
    weight: '320 GSM',
    care: 'Machine wash cold, hang dry'
  },
  { 
    id: 'polo', 
    name: 'Polo Shirt', 
    basePrice: 499, 
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=400',
    material: '100% Pique Cotton',
    weight: '200 GSM',
    care: 'Machine wash warm, tumble dry low'
  },
  { 
    id: 'sweatshirt', 
    name: 'Sweatshirt', 
    basePrice: 699, 
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=400',
    material: '80% Cotton, 20% Polyester',
    weight: '280 GSM',
    care: 'Machine wash cold, tumble dry low'
  },
  { 
    id: 'tank', 
    name: 'Tank Top', 
    basePrice: 249, 
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=400',
    material: '100% Cotton',
    weight: '160 GSM',
    care: 'Machine wash cold, tumble dry low'
  },
  { 
    id: 'longsleeve', 
    name: 'Long Sleeve', 
    basePrice: 399, 
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=400',
    material: '100% Cotton',
    weight: '200 GSM',
    care: 'Machine wash cold, tumble dry low'
  },
  { 
    id: 'jacket', 
    name: 'Jacket', 
    basePrice: 1299, 
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400',
    material: 'Polyester Shell, Fleece Lining',
    weight: '350 GSM',
    care: 'Machine wash cold, hang dry'
  },
  { 
    id: 'bag', 
    name: 'Tote Bag', 
    basePrice: 199, 
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=400',
    material: '100% Canvas Cotton',
    weight: '280 GSM',
    care: 'Hand wash cold, air dry'
  },
  { 
    id: 'cap', 
    name: 'Baseball Cap', 
    basePrice: 299, 
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=400',
    material: '100% Cotton Twill',
    weight: '220 GSM',
    care: 'Hand wash cold, air dry'
  }
];

const colors = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#000000' },
  { name: 'Navy Blue', hex: '#1E3A8A' },
  { name: 'Royal Blue', hex: '#2563EB' },
  { name: 'Red', hex: '#DC2626' },
  { name: 'Maroon', hex: '#7F1D1D' },
  { name: 'Green', hex: '#16A34A' },
  { name: 'Forest Green', hex: '#14532D' },
  { name: 'Yellow', hex: '#EAB308' },
  { name: 'Orange', hex: '#EA580C' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Purple', hex: '#9333EA' },
  { name: 'Gray', hex: '#6B7280' },
  { name: 'Charcoal', hex: '#374151' }
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const views = ['Front', 'Back', 'Left', 'Right'];

const ClothSelector = ({ selectedCloth, onClothChange }) => {
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedView, setSelectedView] = useState('Front');
  const [infoOpen, setInfoOpen] = useState(false);

  const currentCloth = clothTypes.find(c => c.id === selectedCloth) || clothTypes[0];

  const handleClothChange = (clothId) => {
    const cloth = clothTypes.find(c => c.id === clothId);
    if (onClothChange) {
      onClothChange({
        clothId,
        clothName: cloth.name,
        clothPrice: cloth.basePrice,
        color: selectedColor,
        size: selectedSize,
        view: selectedView
      });
    }
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    if (onClothChange) {
      onClothChange({
        clothId: selectedCloth,
        clothName: currentCloth.name,
        clothPrice: currentCloth.basePrice,
        color,
        size: selectedSize,
        view: selectedView
      });
    }
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    if (onClothChange) {
      onClothChange({
        clothId: selectedCloth,
        clothName: currentCloth.name,
        clothPrice: currentCloth.basePrice,
        color: selectedColor,
        size,
        view: selectedView
      });
    }
  };

  const handleViewChange = (view) => {
    setSelectedView(view);
    if (onClothChange) {
      onClothChange({
        clothId: selectedCloth,
        clothName: currentCloth.name,
        clothPrice: currentCloth.basePrice,
        color: selectedColor,
        size: selectedSize,
        view
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Cloth Type Selection */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-foreground">Select Product</label>
        <div className="grid grid-cols-3 gap-2">
          {clothTypes.map((cloth) => (
            <button
              key={cloth.id}
              onClick={() => handleClothChange(cloth.id)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all touch-target ${
                selectedCloth === cloth.id 
                  ? 'border-primary ring-2 ring-primary/20' 
                  : 'border-border/50 hover:border-primary/50'
              }`}
            >
              <img src={cloth.image} alt={cloth.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                <p className="text-xs font-bold text-white">{cloth.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Cloth Details */}
      <div className="bg-muted/30 rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-foreground">{currentCloth.name}</h4>
          <p className="text-lg font-bold text-primary">₹{currentCloth.basePrice}</p>
        </div>
        <p className="text-xs text-muted-foreground">{currentCloth.material} • {currentCloth.weight}</p>
      </div>

      {/* Color Selection */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-foreground">Color</label>
        <div className="grid grid-cols-7 gap-2">
          <TooltipProvider>
            {colors.map((color) => (
              <Tooltip key={color.hex}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleColorChange(color)}
                    className={`aspect-square rounded-lg border-2 transition-all touch-target ${
                      selectedColor.hex === color.hex 
                        ? 'border-primary ring-2 ring-primary/20 scale-110' 
                        : 'border-border/50 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{color.name}</p>
                  <p className="text-xs text-muted-foreground">{color.hex}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
        <p className="text-xs text-muted-foreground">Selected: {selectedColor.name}</p>
      </div>

      {/* Size Selection */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-foreground">Size</label>
        <div className="grid grid-cols-6 gap-2">
          {sizes.map((size) => (
            <Button
              key={size}
              variant={selectedSize === size ? 'default' : 'outline'}
              onClick={() => handleSizeChange(size)}
              className={`touch-target ${selectedSize === size ? 'bg-primary text-primary-foreground' : ''}`}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      {/* View Selection */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-foreground">View</label>
        <div className="grid grid-cols-4 gap-2">
          {views.map((view) => (
            <Button
              key={view}
              variant={selectedView === view ? 'default' : 'outline'}
              onClick={() => handleViewChange(view)}
              className={`touch-target ${selectedView === view ? 'bg-primary text-primary-foreground' : ''}`}
            >
              {view}
            </Button>
          ))}
        </div>
      </div>

      {/* Cloth Info (Collapsible) */}
      <Collapsible open={infoOpen} onOpenChange={setInfoOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between touch-target">
            <span className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              Product Information
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${infoOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pt-2">
          <div className="bg-muted/20 rounded-lg p-3 space-y-2 text-sm">
            <div>
              <p className="font-bold text-foreground">Material</p>
              <p className="text-muted-foreground">{currentCloth.material}</p>
            </div>
            <div>
              <p className="font-bold text-foreground">Weight</p>
              <p className="text-muted-foreground">{currentCloth.weight}</p>
            </div>
            <div>
              <p className="font-bold text-foreground">Care Instructions</p>
              <p className="text-muted-foreground">{currentCloth.care}</p>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ClothSelector;
