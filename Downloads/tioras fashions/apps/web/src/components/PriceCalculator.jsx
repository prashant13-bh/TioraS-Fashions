
import React from 'react';
import { DollarSign, Package, Truck, Shield } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const PriceCalculator = ({ 
  clothPrice = 0, 
  clothName = '', 
  printingPrice = 0, 
  printingType = '', 
  printingSetupFee = 0,
  printingColorCount = 0,
  embroideryPrice = 0, 
  embroideryType = '', 
  embroideryStitchCount = 0,
  embroideryPricePerStitch = 0,
  embroiderySetupFee = 0,
  additionalOptions = {},
  onAdditionalOptionsChange
}) => {
  const giftWrapping = additionalOptions.giftWrapping || false;
  const giftMessage = additionalOptions.giftMessage || false;
  const expressShipping = additionalOptions.expressShipping || false;
  const insurance = additionalOptions.insurance || false;

  const additionalCosts = {
    giftWrapping: giftWrapping ? 50 : 0,
    giftMessage: giftMessage ? 25 : 0,
    expressShipping: expressShipping ? 200 : 0,
    insurance: insurance ? 50 : 0
  };

  const subtotal = clothPrice + printingPrice + embroideryPrice + 
    Object.values(additionalCosts).reduce((sum, cost) => sum + cost, 0);
  
  const tax = subtotal * 0.18; // 18% GST
  const shipping = expressShipping ? 0 : 100; // Free with express
  const total = subtotal + tax + shipping;

  const handleOptionChange = (option, checked) => {
    if (onAdditionalOptionsChange) {
      onAdditionalOptionsChange({
        ...additionalOptions,
        [option]: checked
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Price Breakdown</h3>
      </div>

      {/* Base Cloth Price */}
      {clothPrice > 0 && (
        <div className="flex justify-between items-center py-2">
          <div>
            <p className="text-sm font-medium text-foreground">{clothName || 'Base Cloth'}</p>
            <p className="text-xs text-muted-foreground">Base price</p>
          </div>
          <p className="text-sm font-bold text-foreground">₹{clothPrice.toFixed(2)}</p>
        </div>
      )}

      {/* Printing Price */}
      {printingPrice > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-foreground">{printingType}</p>
                <p className="text-xs text-muted-foreground">Printing service</p>
              </div>
              <p className="text-sm font-bold text-foreground">₹{(printingPrice - printingSetupFee).toFixed(2)}</p>
            </div>
            {printingSetupFee > 0 && (
              <div className="flex justify-between items-center pl-4">
                <p className="text-xs text-muted-foreground">Setup fee</p>
                <p className="text-xs text-muted-foreground">₹{printingSetupFee.toFixed(2)}</p>
              </div>
            )}
            {printingColorCount > 0 && (
              <div className="flex justify-between items-center pl-4">
                <p className="text-xs text-muted-foreground">{printingColorCount} colors</p>
                <p className="text-xs text-muted-foreground">Included</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Embroidery Price */}
      {embroideryPrice > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-foreground">{embroideryType}</p>
                <p className="text-xs text-muted-foreground">Embroidery service</p>
              </div>
              <p className="text-sm font-bold text-foreground">₹{(embroideryPrice - embroiderySetupFee).toFixed(2)}</p>
            </div>
            {embroideryStitchCount > 0 && (
              <div className="flex justify-between items-center pl-4">
                <p className="text-xs text-muted-foreground">{embroideryStitchCount.toLocaleString()} stitches @ ₹{embroideryPricePerStitch}/stitch</p>
                <p className="text-xs text-muted-foreground">₹{(embroideryStitchCount * embroideryPricePerStitch).toFixed(2)}</p>
              </div>
            )}
            {embroiderySetupFee > 0 && (
              <div className="flex justify-between items-center pl-4">
                <p className="text-xs text-muted-foreground">Setup fee</p>
                <p className="text-xs text-muted-foreground">₹{embroiderySetupFee.toFixed(2)}</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Additional Options */}
      <Separator />
      <div className="space-y-3">
        <p className="text-sm font-bold text-foreground mb-2">Additional Options</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox 
              id="giftWrapping" 
              checked={giftWrapping}
              onCheckedChange={(checked) => handleOptionChange('giftWrapping', checked)}
              className="touch-target"
            />
            <Label htmlFor="giftWrapping" className="text-sm cursor-pointer flex items-center gap-2">
              <Package className="w-4 h-4 text-muted-foreground" />
              Gift Wrapping
            </Label>
          </div>
          <p className="text-sm text-muted-foreground">+₹50</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox 
              id="giftMessage" 
              checked={giftMessage}
              onCheckedChange={(checked) => handleOptionChange('giftMessage', checked)}
              className="touch-target"
            />
            <Label htmlFor="giftMessage" className="text-sm cursor-pointer">
              Gift Message
            </Label>
          </div>
          <p className="text-sm text-muted-foreground">+₹25</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox 
              id="expressShipping" 
              checked={expressShipping}
              onCheckedChange={(checked) => handleOptionChange('expressShipping', checked)}
              className="touch-target"
            />
            <Label htmlFor="expressShipping" className="text-sm cursor-pointer flex items-center gap-2">
              <Truck className="w-4 h-4 text-muted-foreground" />
              Express Shipping
            </Label>
          </div>
          <p className="text-sm text-muted-foreground">+₹200</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox 
              id="insurance" 
              checked={insurance}
              onCheckedChange={(checked) => handleOptionChange('insurance', checked)}
              className="touch-target"
            />
            <Label htmlFor="insurance" className="text-sm cursor-pointer flex items-center gap-2">
              <Shield className="w-4 h-4 text-muted-foreground" />
              Insurance
            </Label>
          </div>
          <p className="text-sm text-muted-foreground">+₹50</p>
        </div>
      </div>

      {/* Totals */}
      <Separator />
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">Subtotal</p>
          <p className="text-sm font-medium text-foreground">₹{subtotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">Tax (GST 18%)</p>
          <p className="text-sm font-medium text-foreground">₹{tax.toFixed(2)}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">Shipping</p>
          <p className="text-sm font-medium text-foreground">
            {expressShipping ? 'Free' : `₹${shipping.toFixed(2)}`}
          </p>
        </div>
      </div>

      <Separator className="bg-primary/20" />
      <div className="flex justify-between items-center py-2 bg-primary/5 px-4 rounded-lg">
        <p className="text-base font-bold text-foreground">Total</p>
        <p className="text-2xl font-bold text-primary">₹{total.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default PriceCalculator;
