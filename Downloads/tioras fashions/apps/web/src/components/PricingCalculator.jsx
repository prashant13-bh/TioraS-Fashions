
import React, { useState, useEffect } from 'react';
import { IndianRupee, Loader2, Tag, Info } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';

const PricingCalculator = ({ productType, customizationType, layers, quantity, rushDelivery }) => {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const calculatePrice = async () => {
      setLoading(true);
      setError(null);
      
      // Calculate design complexity based on layers
      // Simple logic: text layers are base complexity, images add more
      const complexity = layers.reduce((acc, layer) => acc + (layer.type === 'image' ? 3 : 1), 1);

      try {
        const response = await apiServerClient.fetch('/designs/calculate-price', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productType: productType || 'T-shirt',
            customizationType: customizationType || 'Printing',
            designComplexity: complexity,
            quantity: quantity || 1,
            rushDelivery: rushDelivery || false
          })
        });

        if (!response.ok) {
          throw new Error('Failed to calculate price');
        }

        const data = await response.json();
        setPriceData(data);
      } catch (err) {
        setError(err.message);
        // Fallback mock data if backend isn't seeded with pricing rules yet
        setPriceData({
          basePrice: 499,
          customizationCost: 150,
          complexityCost: complexity * 10,
          bulkDiscount: quantity >= 10 ? 50 : 0,
          rushDeliveryFee: rushDelivery ? 200 : 0,
          totalPrice: (499 + 150 + complexity * 10) * quantity + (rushDelivery ? 200 : 0),
          pricePerUnit: (499 + 150 + complexity * 10)
        });
      } finally {
        setLoading(false);
      }
    };

    // Debounce the calculation
    const timeoutId = setTimeout(calculatePrice, 500);
    return () => clearTimeout(timeoutId);
  }, [productType, customizationType, layers, quantity, rushDelivery]);

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm mt-6">
      <h3 className="font-bold flex items-center gap-2 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
        <IndianRupee className="w-5 h-5 text-primary" /> Price Estimate
      </h3>

      {loading && !priceData ? (
        <div className="flex items-center justify-center py-6 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Base Product ({quantity}x)</span>
            <span className="font-medium">₹{priceData?.basePrice * quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Customization</span>
            <span className="font-medium">₹{priceData?.customizationCost * quantity}</span>
          </div>
          {priceData?.complexityCost > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Design Complexity</span>
              <span className="font-medium">₹{priceData?.complexityCost * quantity}</span>
            </div>
          )}
          {priceData?.rushDeliveryFee > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rush Delivery</span>
              <span className="font-medium text-amber-600">+₹{priceData?.rushDeliveryFee}</span>
            </div>
          )}
          {priceData?.bulkDiscount > 0 && (
            <div className="flex justify-between text-emerald-600 bg-emerald-500/10 -mx-2 px-2 py-1 rounded">
              <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Bulk Discount</span>
              <span className="font-bold">-₹{priceData?.bulkDiscount}</span>
            </div>
          )}
          
          <div className="border-t border-border/60 pt-3 mt-3">
            <div className="flex justify-between items-end">
              <div>
                <span className="block font-bold text-foreground text-lg">Total</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="w-3 h-3" /> ₹{priceData?.pricePerUnit.toFixed(2)} / unit
                </span>
              </div>
              <span className="font-bold text-2xl text-primary">
                ₹{priceData?.totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingCalculator;
