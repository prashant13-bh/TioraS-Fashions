
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProductCarousel = ({ items, renderItem, itemsPerView = { desktop: 4, tablet: 2, mobile: 1 }, autoPlay = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(itemsPerView.desktop);
  const [isHovered, setIsHovered] = useState(false);

  const updateVisibleItems = useCallback(() => {
    if (window.innerWidth < 768) {
      setVisibleItems(itemsPerView.mobile);
    } else if (window.innerWidth < 1024) {
      setVisibleItems(itemsPerView.tablet);
    } else {
      setVisibleItems(itemsPerView.desktop);
    }
  }, [itemsPerView]);

  useEffect(() => {
    updateVisibleItems();
    window.addEventListener('resize', updateVisibleItems);
    return () => window.removeEventListener('resize', updateVisibleItems);
  }, [updateVisibleItems]);

  const maxIndex = Math.max(0, items.length - visibleItems);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    if (!autoPlay || isHovered) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [autoPlay, isHovered, nextSlide]);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden px-2 py-4">
        <motion.div 
          className="flex gap-6"
          animate={{ x: `calc(-${currentIndex * (100 / visibleItems)}% - ${currentIndex * (24 / visibleItems)}px)` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {items.map((item, index) => (
            <div 
              key={index} 
              className="flex-shrink-0"
              style={{ width: `calc(${100 / visibleItems}% - ${((visibleItems - 1) * 24) / visibleItems}px)` }}
            >
              {renderItem(item)}
            </div>
          ))}
        </motion.div>
      </div>

      {maxIndex > 0 && (
        <>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={prevSlide}
            className="absolute top-1/2 -left-4 -translate-y-1/2 h-10 w-10 rounded-full bg-background shadow-md border-border/50 z-10 hidden md:flex hover:bg-primary hover:text-primary-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={nextSlide}
            className="absolute top-1/2 -right-4 -translate-y-1/2 h-10 w-10 rounded-full bg-background shadow-md border-border/50 z-10 hidden md:flex hover:bg-primary hover:text-primary-foreground"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          <div className="flex justify-center gap-2 mt-8">
            {[...Array(maxIndex + 1)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === i ? 'w-8 bg-primary' : 'w-2 bg-border'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductCarousel;
