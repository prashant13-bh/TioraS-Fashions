
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuantitySelector from '@/components/QuantitySelector.jsx';

const StickyAddToCart = ({ 
  product, 
  selectedVariant, 
  quantity, 
  setQuantity, 
  onAddToCart, 
  onToggleWishlist, 
  isInWishlist,
  isOutOfStock 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border/50 shadow-lg lg:hidden"
        >
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{product?.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {selectedVariant?.title} • {selectedVariant?.sale_price_formatted || selectedVariant?.price_formatted}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="scale-75 origin-right">
                  <QuantitySelector
                    quantity={quantity}
                    setQuantity={setQuantity}
                    maxQuantity={selectedVariant?.inventory_quantity || 99}
                  />
                </div>
                
                <Button
                  size="icon"
                  variant="outline"
                  onClick={onToggleWishlist}
                  className="h-11 w-11 rounded-lg shrink-0 touch-manipulation"
                >
                  <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
                </Button>
                
                <Button
                  onClick={onAddToCart}
                  disabled={isOutOfStock}
                  className="h-11 px-6 gradient-primary text-white rounded-lg shrink-0 touch-manipulation"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyAddToCart;
