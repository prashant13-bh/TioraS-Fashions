
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Truck, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const BannerWrapper = ({ children, isDismissible, onDismiss, type = "info" }) => {
  const bgColors = {
    info: "bg-[hsl(var(--legal-primary))]/10 border-[hsl(var(--legal-primary))]/20 text-[hsl(var(--legal-primary))]",
    warning: "bg-[hsl(var(--legal-warning))]/10 border-[hsl(var(--legal-warning))]/20 text-[hsl(var(--legal-warning))]",
    success: "bg-[hsl(var(--legal-success))]/10 border-[hsl(var(--legal-success))]/20 text-[hsl(var(--legal-success))]"
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0, scale: 0.95 }}
      className="overflow-hidden"
    >
      <div className={`legal-banner ${bgColors[type]} mb-6 relative pr-10`}>
        <div className="flex items-center gap-3 w-full">
          {children}
        </div>
        {isDismissible && (
          <button 
            onClick={onDismiss}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-black/5 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4 opacity-70" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export const HomeBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <AnimatePresence>
      {isVisible && (
        <BannerWrapper isDismissible onDismiss={() => setIsVisible(false)} type="info">
          <Shield className="w-5 h-5 shrink-0" />
          <span>
            Shop with confidence — 
            <Link to="/return-policy" className="underline font-bold mx-1 hover:opacity-80">30-day returns</Link>, 
            secure checkout, and fast shipping.
          </span>
        </BannerWrapper>
      )}
    </AnimatePresence>
  );
};

export const CheckoutBanner = () => {
  return (
    <BannerWrapper isDismissible={false} type="info">
      <CheckCircle className="w-5 h-5 shrink-0" />
      <span>
        By placing an order, you agree to our 
        <Link to="/terms-conditions" target="_blank" className="underline font-bold mx-1 hover:opacity-80">Terms & Conditions</Link> 
        and 
        <Link to="/privacy-policy" target="_blank" className="underline font-bold ml-1 hover:opacity-80">Privacy Policy</Link>.
      </span>
    </BannerWrapper>
  );
};

export const ProductBanner = ({ isCustomized = false }) => {
  if (!isCustomized) return null;
  
  return (
    <BannerWrapper isDismissible={false} type="warning">
      <AlertTriangle className="w-5 h-5 shrink-0" />
      <span>
        <strong>Note:</strong> Customized items are non-returnable unless defective. See our 
        <Link to="/return-policy" className="underline font-bold ml-1 hover:opacity-80">Return Policy</Link>.
      </span>
    </BannerWrapper>
  );
};

export const CartBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <AnimatePresence>
      {isVisible && (
        <BannerWrapper isDismissible onDismiss={() => setIsVisible(false)} type="success">
          <Truck className="w-5 h-5 shrink-0" />
          <span>
            Free shipping on orders over ₹500! Check our 
            <Link to="/shipping-policy" className="underline font-bold ml-1 hover:opacity-80">Shipping Policy</Link>.
          </span>
        </BannerWrapper>
      )}
    </AnimatePresence>
  );
};

export const CategoryBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <AnimatePresence>
      {isVisible && (
        <BannerWrapper isDismissible onDismiss={() => setIsVisible(false)} type="info">
          <Shield className="w-5 h-5 shrink-0" />
          <span>
            All items in this category are subject to our 
            <Link to="/return-policy" className="underline font-bold ml-1 hover:opacity-80">Return Policy</Link>.
          </span>
        </BannerWrapper>
      )}
    </AnimatePresence>
  );
};
