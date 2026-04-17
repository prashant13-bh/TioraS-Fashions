
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

const AdvancedFilters = ({ currentFilters, onFilterChange, onClearAll }) => {
  
  const handleCheckboxChange = (category, value, checked) => {
    const current = currentFilters[category] ? currentFilters[category].split(',') : [];
    let updated;
    if (checked) {
      updated = [...current, value];
    } else {
      updated = current.filter(v => v !== value);
    }
    onFilterChange({ [category]: updated.length > 0 ? updated.join(',') : null });
  };

  const handleRadioChange = (category, value) => {
    onFilterChange({ [category]: value });
  };

  const categories = [
    { id: 'dresses', label: 'Dresses', count: 120 },
    { id: 'tops', label: 'Tops & Shirts', count: 85 },
    { id: 'bottoms', label: 'Bottoms', count: 64 },
    { id: 'outerwear', label: 'Outerwear', count: 32 },
    { id: 'accessories', label: 'Accessories', count: 150 }
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  
  const colors = [
    { id: 'black', hex: '#000000' },
    { id: 'white', hex: '#FFFFFF' },
    { id: 'red', hex: '#EF4444' },
    { id: 'blue', hex: '#3B82F6' },
    { id: 'green', hex: '#10B981' },
    { id: 'gold', hex: '#D4AF37' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Filters</h3>
        {Object.keys(currentFilters).length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearAll} className="text-muted-foreground hover:text-foreground h-auto p-0">
            Clear All
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={['category', 'price', 'size']} className="w-full">
        
        {/* Category Filter */}
        <AccordionItem value="category" className="border-b border-border">
          <AccordionTrigger className="hover:no-underline py-4 font-semibold">Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1 pb-2">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`cat-${cat.id}`} 
                      checked={currentFilters.category?.includes(cat.id)}
                      onCheckedChange={(c) => handleCheckboxChange('category', cat.id, c)}
                    />
                    <Label htmlFor={`cat-${cat.id}`} className="text-sm font-normal cursor-pointer">{cat.label}</Label>
                  </div>
                  <span className="text-xs text-muted-foreground">{cat.count}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Filter */}
        <AccordionItem value="price" className="border-b border-border">
          <AccordionTrigger className="hover:no-underline py-4 font-semibold">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2 pb-2">
              <RadioGroup 
                value={currentFilters.price || ''} 
                onValueChange={(v) => handleRadioChange('price', v)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="under-500" id="p1" />
                  <Label htmlFor="p1" className="text-sm font-normal cursor-pointer">Under ₹500</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="500-1000" id="p2" />
                  <Label htmlFor="p2" className="text-sm font-normal cursor-pointer">₹500 - ₹1000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1000-5000" id="p3" />
                  <Label htmlFor="p3" className="text-sm font-normal cursor-pointer">₹1000 - ₹5000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="over-5000" id="p4" />
                  <Label htmlFor="p4" className="text-sm font-normal cursor-pointer">Over ₹5000</Label>
                </div>
              </RadioGroup>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Size Filter */}
        <AccordionItem value="size" className="border-b border-border">
          <AccordionTrigger className="hover:no-underline py-4 font-semibold">Size</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-3 gap-2 pt-1 pb-2">
              {sizes.map((size) => {
                const isSelected = currentFilters.size?.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => handleCheckboxChange('size', size, !isSelected)}
                    className={`py-2 text-sm text-center rounded-md border transition-colors ${
                      isSelected 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-card text-foreground border-border hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Color Filter */}
        <AccordionItem value="color" className="border-b border-border">
          <AccordionTrigger className="hover:no-underline py-4 font-semibold">Color</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-3 pt-1 pb-2">
              {colors.map((color) => {
                const isSelected = currentFilters.color?.includes(color.id);
                return (
                  <button
                    key={color.id}
                    onClick={() => handleCheckboxChange('color', color.id, !isSelected)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      isSelected ? 'border-primary scale-110' : 'border-transparent hover:scale-110'
                    }`}
                    style={{ backgroundColor: color.hex, boxShadow: color.id === 'white' ? 'inset 0 0 0 1px #e5e7eb' : 'none' }}
                    title={color.id}
                    aria-label={`Select ${color.id}`}
                  />
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Rating Filter */}
        <AccordionItem value="rating" className="border-b border-border">
          <AccordionTrigger className="hover:no-underline py-4 font-semibold">Rating</AccordionTrigger>
          <AccordionContent>
            <RadioGroup 
              value={currentFilters.rating || ''} 
              onValueChange={(v) => handleRadioChange('rating', v)}
              className="space-y-3 pt-1 pb-2"
            >
              {[4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <RadioGroupItem value={rating.toString()} id={`r${rating}`} />
                  <Label htmlFor={`r${rating}`} className="flex items-center text-sm font-normal cursor-pointer">
                    <div className="flex mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-accent text-accent' : 'text-muted'}`} />
                      ))}
                    </div>
                    & Up
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
      
      <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold">
        Apply Filters
      </Button>
    </div>
  );
};

export default AdvancedFilters;
