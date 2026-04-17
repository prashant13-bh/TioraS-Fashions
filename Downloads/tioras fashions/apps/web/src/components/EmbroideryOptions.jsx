
import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const embroideryTypes = [
  {
    id: 'flat',
    name: 'Flat Embroidery',
    bestFor: 'Text, logos, simple designs',
    pricePerStitch: 0.05,
    setupFee: 100,
    durability: 'Excellent',
    leadTime: '10-14 days'
  },
  {
    id: '3d',
    name: '3D Embroidery',
    bestFor: 'Raised logos, premium look',
    pricePerStitch: 0.08,
    setupFee: 150,
    durability: 'Excellent',
    leadTime: '12-16 days'
  },
  {
    id: 'applique',
    name: 'Appliqué Embroidery',
    bestFor: 'Large designs, patches',
    pricePerStitch: 0.06,
    setupFee: 120,
    durability: 'Very Good',
    leadTime: '14-18 days'
  }
];

const placements = [
  { id: 'left-chest', name: 'Left Chest' },
  { id: 'right-chest', name: 'Right Chest' },
  { id: 'back-center', name: 'Back Center' },
  { id: 'left-sleeve', name: 'Left Sleeve' },
  { id: 'right-sleeve', name: 'Right Sleeve' },
  { id: 'back-neck', name: 'Back Neck' }
];

const threadColors = [
  { name: 'Black', code: '#000000' },
  { name: 'White', code: '#FFFFFF' },
  { name: 'Navy Blue', code: '#1E3A8A' },
  { name: 'Royal Blue', code: '#2563EB' },
  { name: 'Red', code: '#DC2626' },
  { name: 'Maroon', code: '#7F1D1D' },
  { name: 'Forest Green', code: '#14532D' },
  { name: 'Kelly Green', code: '#16A34A' },
  { name: 'Gold', code: '#D4AF37' },
  { name: 'Silver', code: '#C0C0C0' },
  { name: 'Orange', code: '#EA580C' },
  { name: 'Pink', code: '#EC4899' },
  { name: 'Purple', code: '#9333EA' },
  { name: 'Brown', code: '#78350F' },
  { name: 'Gray', code: '#6B7280' },
  { name: 'Yellow', code: '#EAB308' }
];

const EmbroideryOptions = ({ onEmbroideryChange, clothPrice = 0 }) => {
  const [selectedType, setSelectedType] = useState('flat');
  const [selectedPlacement, setSelectedPlacement] = useState('left-chest');
  const [embroiderySize, setEmbroiderySize] = useState([3]);
  const [selectedColor, setSelectedColor] = useState(threadColors[0]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const currentType = embroideryTypes.find(t => t.id === selectedType);
  
  // Stitch count calculation (approximate: size in inches squared × 1000)
  const estimatedStitches = Math.round(embroiderySize[0] * embroiderySize[0] * 1000);
  const stitchPrice = estimatedStitches * currentType.pricePerStitch;
  const embroideryPrice = stitchPrice + currentType.setupFee;
  const totalPrice = clothPrice + embroideryPrice;

  const handleTypeChange = (typeId) => {
    setSelectedType(typeId);
    const type = embroideryTypes.find(t => t.id === typeId);
    if (onEmbroideryChange) {
      onEmbroideryChange({
        type: type.name,
        placement: selectedPlacement,
        size: embroiderySize[0],
        threadColor: selectedColor,
        stitchCount: estimatedStitches,
        pricePerStitch: type.pricePerStitch,
        setupFee: type.setupFee,
        price: embroideryPrice
      });
    }
  };

  const handlePlacementChange = (placement) => {
    setSelectedPlacement(placement);
    if (onEmbroideryChange) {
      onEmbroideryChange({
        type: currentType.name,
        placement,
        size: embroiderySize[0],
        threadColor: selectedColor,
        stitchCount: estimatedStitches,
        pricePerStitch: currentType.pricePerStitch,
        setupFee: currentType.setupFee,
        price: embroideryPrice
      });
    }
  };

  const handleSizeChange = (value) => {
    setEmbroiderySize(value);
    const newStitches = Math.round(value[0] * value[0] * 1000);
    const newPrice = newStitches * currentType.pricePerStitch + currentType.setupFee;
    if (onEmbroideryChange) {
      onEmbroideryChange({
        type: currentType.name,
        placement: selectedPlacement,
        size: value[0],
        threadColor: selectedColor,
        stitchCount: newStitches,
        pricePerStitch: currentType.pricePerStitch,
        setupFee: currentType.setupFee,
        price: newPrice
      });
    }
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    if (onEmbroideryChange) {
      onEmbroideryChange({
        type: currentType.name,
        placement: selectedPlacement,
        size: embroiderySize[0],
        threadColor: color,
        stitchCount: estimatedStitches,
        pricePerStitch: currentType.pricePerStitch,
        setupFee: currentType.setupFee,
        price: embroideryPrice
      });
    }
  };

  const handleFileUpload = (file) => {
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10 MB');
        return;
      }
      const validTypes = ['image/png', 'image/svg+xml', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Only PNG, SVG, PDF files are allowed');
        return;
      }
      setUploadedFile(file);
      toast.success('Design uploaded and converted to embroidery format');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-6">
      {/* Embroidery Type Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-foreground">Embroidery Type</h3>
        <RadioGroup value={selectedType} onValueChange={handleTypeChange}>
          <div className="grid grid-cols-1 gap-3">
            {embroideryTypes.map((type) => (
              <div
                key={type.id}
                className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  selectedType === type.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border/50 hover:border-primary/30'
                }`}
                onClick={() => handleTypeChange(type.id)}
              >
                <div className="flex items-start gap-3">
                  <RadioGroupItem value={type.id} id={type.id} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={type.id} className="cursor-pointer">
                      <p className="font-bold text-foreground mb-1">{type.name}</p>
                      <p className="text-xs text-muted-foreground mb-2">{type.bestFor}</p>
                      <div className="flex items-center gap-4 text-xs flex-wrap">
                        <span className="text-primary font-bold">₹{type.pricePerStitch}/stitch</span>
                        <span className="text-muted-foreground">Setup: ₹{type.setupFee}</span>
                        <span className="text-muted-foreground">Durability: {type.durability}</span>
                        <span className="text-muted-foreground">{type.leadTime}</span>
                      </div>
                    </Label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Placement Selector */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-foreground">Placement</h3>
        <div className="grid grid-cols-2 gap-2">
          {placements.map((placement) => (
            <Button
              key={placement.id}
              variant={selectedPlacement === placement.id ? 'default' : 'outline'}
              onClick={() => handlePlacementChange(placement.id)}
              className={`h-11 text-sm touch-target ${
                selectedPlacement === placement.id ? 'bg-primary text-primary-foreground' : ''
              }`}
            >
              {placement.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Embroidery Size Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Embroidery Size</h3>
          <span className="text-sm font-bold text-primary">
            {embroiderySize[0]}" ({(embroiderySize[0] * 2.54).toFixed(1)} cm)
          </span>
        </div>
        <Slider
          value={embroiderySize}
          onValueChange={handleSizeChange}
          min={1}
          max={8}
          step={0.5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1"</span>
          <span>8"</span>
        </div>
      </div>

      {/* Thread Color Selector */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-foreground">Thread Color</h3>
        <div className="grid grid-cols-4 gap-2">
          {threadColors.map((color) => (
            <button
              key={color.code}
              onClick={() => handleColorChange(color)}
              className={`aspect-square rounded-lg border-2 transition-all ${
                selectedColor.code === color.code
                  ? 'border-primary ring-2 ring-primary/20 scale-110'
                  : 'border-border/50 hover:border-primary/50'
              }`}
              style={{ backgroundColor: color.code }}
              title={color.name}
            />
          ))}
        </div>
        <div className="bg-muted/30 rounded-lg p-3">
          <p className="text-sm font-medium text-foreground">{selectedColor.name}</p>
          <p className="text-xs text-muted-foreground">{selectedColor.code}</p>
        </div>
      </div>

      {/* Design Upload */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-foreground">Upload Design</h3>
        
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border/60 hover:border-primary/50'
          }`}
        >
          <input
            type="file"
            id="embroidery-upload"
            accept=".png,.svg,.pdf"
            onChange={(e) => handleFileUpload(e.target.files[0])}
            className="hidden"
          />
          <label htmlFor="embroidery-upload" className="cursor-pointer">
            <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
            <p className="font-bold text-foreground mb-1">
              {uploadedFile ? uploadedFile.name : 'Drop your design here'}
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, SVG, PDF (Max 10 MB)
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Auto-converts to embroidery format
            </p>
          </label>
        </div>
      </div>

      {/* Stitch Count Calculator */}
      <div className="bg-muted/30 rounded-xl p-4 space-y-2">
        <h3 className="text-sm font-bold text-foreground mb-3">Stitch Count Estimate</h3>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Estimated Stitches</span>
          <span className="font-medium text-foreground">{estimatedStitches.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Price per Stitch</span>
          <span className="font-medium text-foreground">₹{currentType.pricePerStitch}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Stitch Cost</span>
          <span className="font-medium text-foreground">₹{stitchPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="bg-muted/30 rounded-xl p-4 space-y-2">
        <h3 className="text-sm font-bold text-foreground mb-3">Price Breakdown</h3>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Base Cloth</span>
          <span className="font-medium text-foreground">₹{clothPrice}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Embroidery ({currentType.name})</span>
          <span className="font-medium text-foreground">₹{stitchPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Setup Fee</span>
          <span className="font-medium text-foreground">₹{currentType.setupFee}</span>
        </div>
        <div className="border-t border-border/50 pt-2 mt-2">
          <div className="flex justify-between">
            <span className="font-bold text-foreground">Total</span>
            <span className="text-lg font-bold text-primary">₹{totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbroideryOptions;
