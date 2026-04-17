
import React, { useState } from 'react';
import { Upload, X, Plus, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

const printingTypes = [
  {
    id: 'screen',
    name: 'Screen Printing',
    bestFor: 'Large orders, solid colors',
    price: 150,
    durability: 'Excellent',
    leadTime: '7-10 days'
  },
  {
    id: 'dtg',
    name: 'Digital Print (DTG)',
    bestFor: 'Full color, photo quality',
    price: 200,
    durability: 'Good',
    leadTime: '3-5 days'
  },
  {
    id: 'heat',
    name: 'Heat Transfer',
    bestFor: 'Small orders, quick turnaround',
    price: 120,
    durability: 'Fair',
    leadTime: '2-3 days'
  },
  {
    id: 'embroidery',
    name: 'Embroidery',
    bestFor: 'Premium look, durability',
    price: 250,
    durability: 'Excellent',
    leadTime: '10-14 days'
  }
];

const placements = [
  { id: 'front-chest', name: 'Front Chest' },
  { id: 'back', name: 'Back' },
  { id: 'left-sleeve', name: 'Left Sleeve' },
  { id: 'right-sleeve', name: 'Right Sleeve' },
  { id: 'full-front', name: 'Full Front' },
  { id: 'full-back', name: 'Full Back' }
];

const colorPalette = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
  '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000', '#FFC0CB'
];

const PrintingOptions = ({ onPrintingChange, clothPrice = 0 }) => {
  const [selectedType, setSelectedType] = useState('screen');
  const [selectedPlacement, setSelectedPlacement] = useState('front-chest');
  const [printSize, setPrintSize] = useState([6]);
  const [selectedColors, setSelectedColors] = useState(['#000000']);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const currentType = printingTypes.find(t => t.id === selectedType);
  const setupFee = 50;
  const pricePerColor = selectedType === 'screen' ? 30 : 0;
  const totalColorPrice = selectedColors.length * pricePerColor;
  const printingPrice = currentType.price + totalColorPrice;
  const totalPrice = clothPrice + printingPrice + setupFee;

  const handleTypeChange = (typeId) => {
    setSelectedType(typeId);
    const type = printingTypes.find(t => t.id === typeId);
    if (onPrintingChange) {
      onPrintingChange({
        type: type.name,
        placement: selectedPlacement,
        size: printSize[0],
        colors: selectedColors,
        price: printingPrice,
        setupFee
      });
    }
  };

  const handlePlacementChange = (placement) => {
    setSelectedPlacement(placement);
    if (onPrintingChange) {
      onPrintingChange({
        type: currentType.name,
        placement,
        size: printSize[0],
        colors: selectedColors,
        price: printingPrice,
        setupFee
      });
    }
  };

  const handleSizeChange = (value) => {
    setPrintSize(value);
    if (onPrintingChange) {
      onPrintingChange({
        type: currentType.name,
        placement: selectedPlacement,
        size: value[0],
        colors: selectedColors,
        price: printingPrice,
        setupFee
      });
    }
  };

  const addColor = (color) => {
    if (selectedColors.length < 6 && !selectedColors.includes(color)) {
      const newColors = [...selectedColors, color];
      setSelectedColors(newColors);
      if (onPrintingChange) {
        onPrintingChange({
          type: currentType.name,
          placement: selectedPlacement,
          size: printSize[0],
          colors: newColors,
          price: printingPrice + pricePerColor,
          setupFee
        });
      }
    } else if (selectedColors.length >= 6) {
      toast.error('Maximum 6 colors allowed');
    }
  };

  const removeColor = (index) => {
    const newColors = selectedColors.filter((_, i) => i !== index);
    setSelectedColors(newColors);
    if (onPrintingChange) {
      onPrintingChange({
        type: currentType.name,
        placement: selectedPlacement,
        size: printSize[0],
        colors: newColors,
        price: printingPrice - pricePerColor,
        setupFee
      });
    }
  };

  const handleFileUpload = (file) => {
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10 MB');
        return;
      }
      const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Only PNG, JPG, SVG, PDF files are allowed');
        return;
      }
      setUploadedFile(file);
      toast.success('Design uploaded successfully');
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
      {/* Printing Type Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-foreground">Printing Type</h3>
        <RadioGroup value={selectedType} onValueChange={handleTypeChange}>
          <div className="grid grid-cols-1 gap-3">
            {printingTypes.map((type) => (
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
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-primary font-bold">₹{type.price}</span>
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

      {/* Print Size Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Print Size</h3>
          <span className="text-sm font-bold text-primary">
            {printSize[0]}" ({(printSize[0] * 2.54).toFixed(1)} cm)
          </span>
        </div>
        <Slider
          value={printSize}
          onValueChange={handleSizeChange}
          min={2}
          max={12}
          step={0.5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>2"</span>
          <span>12"</span>
        </div>
      </div>

      {/* Color Picker (Screen Printing Only) */}
      {selectedType === 'screen' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Print Colors</h3>
            <span className="text-xs text-muted-foreground">
              {selectedColors.length}/6 colors • ₹{pricePerColor} per color
            </span>
          </div>
          
          {/* Selected Colors */}
          <div className="flex flex-wrap gap-2">
            {selectedColors.map((color, index) => (
              <div
                key={index}
                className="relative w-12 h-12 rounded-lg border-2 border-border/50"
                style={{ backgroundColor: color }}
              >
                <button
                  onClick={() => removeColor(index)}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/80"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Color Palette */}
          {selectedColors.length < 6 && (
            <div className="grid grid-cols-6 gap-2">
              {colorPalette.map((color) => (
                <button
                  key={color}
                  onClick={() => addColor(color)}
                  className="w-full aspect-square rounded-lg border-2 border-border/50 hover:border-primary transition-colors"
                  style={{ backgroundColor: color }}
                  disabled={selectedColors.includes(color)}
                />
              ))}
            </div>
          )}
        </div>
      )}

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
            id="design-upload"
            accept=".png,.jpg,.jpeg,.svg,.pdf"
            onChange={(e) => handleFileUpload(e.target.files[0])}
            className="hidden"
          />
          <label htmlFor="design-upload" className="cursor-pointer">
            <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
            <p className="font-bold text-foreground mb-1">
              {uploadedFile ? uploadedFile.name : 'Drop your design here'}
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, SVG, PDF (Max 10 MB)
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Recommended: 300 DPI
            </p>
          </label>
        </div>

        <Button
          variant="outline"
          className="w-full h-12 rounded-xl border-primary/20 text-primary font-bold touch-target"
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Browse Design Library
        </Button>
      </div>

      {/* Price Breakdown */}
      <div className="bg-muted/30 rounded-xl p-4 space-y-2">
        <h3 className="text-sm font-bold text-foreground mb-3">Price Breakdown</h3>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Base Cloth</span>
          <span className="font-medium text-foreground">₹{clothPrice}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Printing ({currentType.name})</span>
          <span className="font-medium text-foreground">₹{currentType.price}</span>
        </div>
        {selectedType === 'screen' && selectedColors.length > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Colors ({selectedColors.length})</span>
            <span className="font-medium text-foreground">₹{totalColorPrice}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Setup Fee</span>
          <span className="font-medium text-foreground">₹{setupFee}</span>
        </div>
        <div className="border-t border-border/50 pt-2 mt-2">
          <div className="flex justify-between">
            <span className="font-bold text-foreground">Total</span>
            <span className="text-lg font-bold text-primary">₹{totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintingOptions;
