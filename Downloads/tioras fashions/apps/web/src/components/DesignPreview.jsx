
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCw, Save, ShoppingCart, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const MOCKUPS = {
  'T-shirt': 'https://images.unsplash.com/photo-1702355605400-2576c5942e9e?auto=format&fit=crop&q=80&w=800',
  'Hoodie': 'https://images.unsplash.com/photo-1697912182430-3cef507fc85d?auto=format&fit=crop&q=80&w=800',
  'Cap': 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800',
  'Bag': 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800',
  'Default': 'https://images.unsplash.com/photo-1702355605400-2576c5942e9e?auto=format&fit=crop&q=80&w=800'
};

const DesignPreview = ({ 
  designImage, 
  productType = 'T-shirt', 
  price = 1499, 
  onSave, 
  onCustomize, 
  onAddToCart,
  isSaving = false
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const mockupUrl = MOCKUPS[productType] || MOCKUPS['Default'];

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl border border-border/50 shadow-lg overflow-hidden">
      <div className="p-4 border-b border-border/50 flex justify-between items-center bg-muted/20">
        <h3 className="font-bold text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>Live Preview</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleZoomOut} className="h-8 w-8 rounded-full">
            <ZoomOut size={14} />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomIn} className="h-8 w-8 rounded-full">
            <ZoomIn size={14} />
          </Button>
          <Button variant="outline" size="icon" onClick={handleRotate} className="h-8 w-8 rounded-full">
            <RotateCw size={14} />
          </Button>
        </div>
      </div>

      <div className="relative flex-1 bg-muted/30 overflow-hidden flex items-center justify-center min-h-[400px]">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Skeleton className="w-full h-full" />
          </div>
        )}
        
        <img 
          src={mockupUrl} 
          alt={`${productType} mockup`}
          className="w-full h-full object-cover opacity-90"
          onLoad={() => setImageLoaded(true)}
        />

        {designImage && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div 
              className="relative w-1/3 h-1/3 flex items-center justify-center"
              style={{ 
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transition: 'transform 0.3s ease-out',
                marginTop: productType === 'Hoodie' ? '10%' : '-5%'
              }}
            >
              <img 
                src={designImage} 
                alt="Generated Design" 
                className="max-w-full max-h-full object-contain drop-shadow-xl mockup-overlay"
              />
            </div>
          </motion.div>
        )}

        {!designImage && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="border-2 border-dashed border-primary/30 rounded-xl w-1/3 h-1/3 flex items-center justify-center bg-background/20 backdrop-blur-sm">
              <p className="text-sm font-medium text-muted-foreground text-center px-4">
                Your design will appear here
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-background border-t border-border/50">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">Estimated Price</p>
            <p className="text-3xl font-bold text-primary">₹{price}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{productType}</p>
            <p className="text-xs text-muted-foreground">Custom AI Design</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="w-full rounded-xl border-border/80"
            onClick={onCustomize}
            disabled={!designImage}
          >
            <Edit3 className="mr-2 h-4 w-4" /> Customize
          </Button>
          <Button 
            variant="secondary" 
            className="w-full rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90"
            onClick={onSave}
            disabled={!designImage || isSaving}
          >
            <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Design'}
          </Button>
          <Button 
            className="col-span-2 w-full gradient-primary text-white rounded-xl h-12 text-lg shadow-md hover:shadow-lg transition-all"
            onClick={onAddToCart}
            disabled={!designImage}
          >
            <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DesignPreview;
