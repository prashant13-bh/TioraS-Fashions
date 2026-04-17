
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Type, Layers, Maximize, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PLACEMENTS = [
  { id: 'left-chest', label: 'Left Chest', icon: <div className="w-3 h-3 bg-current rounded-sm absolute top-2 left-2" /> },
  { id: 'center-chest', label: 'Center Chest', icon: <div className="w-4 h-3 bg-current rounded-sm absolute top-2 left-1/2 -translate-x-1/2" /> },
  { id: 'full-front', label: 'Full Front', icon: <div className="w-6 h-8 bg-current rounded-sm absolute top-2 left-1/2 -translate-x-1/2" /> },
  { id: 'back', label: 'Full Back', icon: <div className="w-6 h-8 bg-current rounded-sm absolute top-2 left-1/2 -translate-x-1/2 opacity-50" /> },
];

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const DesignCustomizer = ({ 
  basePrice = 1499, 
  onChange, 
  initialValues = {} 
}) => {
  const [placement, setPlacement] = useState(initialValues.placement || 'center-chest');
  const [size, setSize] = useState(initialValues.size || 'L');
  const [quantity, setQuantity] = useState(initialValues.quantity || 1);
  const [textOverlay, setTextOverlay] = useState(initialValues.textOverlay || '');
  const [primaryColor, setPrimaryColor] = useState(initialValues.primaryColor || '#1E3A8A');

  // Calculate dynamic price
  const currentPrice = basePrice 
    + (placement === 'full-front' || placement === 'back' ? 300 : 0)
    + (textOverlay.length > 0 ? 150 : 0);

  useEffect(() => {
    onChange({
      placement,
      size,
      quantity,
      textOverlay,
      primaryColor,
      totalPrice: currentPrice * quantity,
      unitPrice: currentPrice
    });
  }, [placement, size, quantity, textOverlay, primaryColor, currentPrice, onChange]);

  return (
    <div className="space-y-8">
      {/* Placement Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Layers size={16} /> Design Placement
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PLACEMENTS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlacement(p.id)}
              className={`relative h-24 rounded-xl border-2 transition-all flex flex-col items-center justify-end pb-3 ${
                placement === p.id 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-border bg-card hover:border-primary/30 text-muted-foreground'
              }`}
            >
              <div className="absolute top-3 w-10 h-12 border-2 border-current rounded-md opacity-50">
                {p.icon}
              </div>
              <span className="text-xs font-medium">{p.label}</span>
              {placement === p.id && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-0.5">
                  <Check size={12} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Maximize size={16} /> Garment Size
        </Label>
        <div className="flex flex-wrap gap-3">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`w-12 h-12 rounded-xl font-bold transition-all ${
                size === s 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'bg-card border border-border hover:bg-muted text-foreground'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Text Overlay */}
      <div className="space-y-3">
        <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Type size={16} /> Add Custom Text (+₹150)
        </Label>
        <Input 
          placeholder="e.g., Team Name, Year, or Quote" 
          value={textOverlay}
          onChange={(e) => setTextOverlay(e.target.value)}
          className="h-12 rounded-xl bg-card border-border/80 text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Quantity & Color */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Hash size={16} /> Quantity
          </Label>
          <div className="flex items-center border border-border rounded-xl bg-card h-12 overflow-hidden">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 h-full hover:bg-muted transition-colors text-foreground"
            >
              -
            </button>
            <div className="flex-1 text-center font-bold text-foreground">{quantity}</div>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 h-full hover:bg-muted transition-colors text-foreground"
            >
              +
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Garment Color
          </Label>
          <div className="flex items-center gap-3 h-12">
            <input 
              type="color" 
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-12 h-12 rounded-xl cursor-pointer border-0 p-0 bg-transparent"
            />
            <span className="text-sm font-medium text-foreground uppercase">{primaryColor}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignCustomizer;
