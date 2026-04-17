
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StickyCheckout = ({ total, itemCount }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 200);
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
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-xs text-muted-foreground">Total ({itemCount} items)</p>
                <p className="text-lg font-bold text-primary">{total}</p>
              </div>
              
              <Link to="/checkout" className="flex-1 max-w-xs">
                <Button className="w-full h-12 gradient-primary text-white rounded-lg touch-manipulation">
                  Checkout <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            <Link to="/products">
              <Button variant="outline" className="w-full h-11 rounded-lg touch-manipulation">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyCheckout;
