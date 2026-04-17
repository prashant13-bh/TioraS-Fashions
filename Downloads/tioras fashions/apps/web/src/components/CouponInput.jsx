
import React, { useState } from 'react';
import { Tag, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import apiServerClient from '@/lib/apiServerClient';
import { toast } from 'sonner';

const CouponInput = ({ orderAmount, cartItems = [], onApplyCoupon, onRemoveCoupon, appliedCoupon }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setLoading(true);
    try {
      const response = await apiServerClient.fetch('/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.toUpperCase(), orderAmount, cartItems })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Invalid coupon code');
      }

      const data = await response.json();
      onApplyCoupon({
        code: code.toUpperCase(),
        discountAmount: data.discountAmount,
        newTotal: data.newTotal
      });
      toast.success('Coupon applied successfully');
      setCode('');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    onRemoveCoupon();
    toast.success('Coupon removed');
  };

  if (appliedCoupon) {
    return (
      <div className="bg-[hsl(var(--legal-success))]/10 border border-[hsl(var(--legal-success))]/30 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--legal-success))]/20 flex items-center justify-center">
              <Tag className="w-5 h-5 text-[hsl(var(--legal-success))]" />
            </div>
            <div>
              <p className="font-bold text-foreground">{appliedCoupon.code}</p>
              <p className="text-sm text-muted-foreground">
                Saved ₹{appliedCoupon.discountAmount.toFixed(2)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="h-9 w-9 text-muted-foreground hover:text-destructive touch-manipulation"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-foreground">Have a coupon code?</Label>
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter code"
          className="flex-1 h-11 text-foreground uppercase"
          onKeyPress={(e) => e.key === 'Enter' && handleApply()}
        />
        <Button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="h-11 px-6 gradient-primary text-white touch-manipulation"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
        </Button>
      </div>
    </div>
  );
};

export default CouponInput;
