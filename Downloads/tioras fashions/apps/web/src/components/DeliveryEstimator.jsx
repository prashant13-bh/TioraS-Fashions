
import React, { useState } from 'react';
import { Truck, MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const DeliveryEstimator = () => {
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [error, setError] = useState('');

  const validatePincode = (value) => {
    return /^\d{6}$/.test(value);
  };

  const handleCheckDelivery = async () => {
    setError('');
    setDeliveryInfo(null);

    if (!validatePincode(pincode)) {
      setError('Please enter a valid 6-digit pincode');
      return;
    }

    setLoading(true);

    try {
      const zones = await pb.collection('deliveryZones').getFullList({
        filter: `pincode = "${pincode}" && active = true`,
        $autoCancel: false
      });

      if (zones.length === 0) {
        setError('Delivery not available for this pincode');
        toast.error('Delivery not available for this pincode');
        return;
      }

      const zone = zones[0];
      const today = new Date();
      const estimatedDate = new Date(today);
      estimatedDate.setDate(estimatedDate.getDate() + zone.deliveryDays);

      const formattedDate = estimatedDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short'
      });

      setDeliveryInfo({
        estimatedDate: formattedDate,
        deliveryCost: zone.deliveryCost,
        shippingMethod: zone.shippingMethod,
        isFreeShipping: zone.deliveryCost === 0
      });

      toast.success('Delivery available for your location');
    } catch (err) {
      console.error('Failed to check delivery:', err);
      setError('Failed to check delivery. Please try again.');
      toast.error('Failed to check delivery');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-muted/30 border border-border/50 rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-foreground">Check Delivery</h3>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="text"
          placeholder="Enter pincode"
          value={pincode}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
            setPincode(value);
            setError('');
            setDeliveryInfo(null);
          }}
          maxLength={6}
          className="flex-1 text-foreground"
        />
        <Button
          onClick={handleCheckDelivery}
          disabled={loading || !pincode}
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            'Check Delivery'
          )}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {deliveryInfo && (
        <div className="bg-background border border-border/50 rounded-xl p-4 space-y-3">
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-[hsl(var(--legal-success))] shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-foreground">
                Delivery by {deliveryInfo.estimatedDate}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {deliveryInfo.shippingMethod} Shipping
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <span className="text-sm font-medium text-foreground">Delivery Charges:</span>
            <div className="flex items-center gap-2">
              {deliveryInfo.isFreeShipping ? (
                <Badge className="bg-[hsl(var(--legal-success))] text-white border-none">
                  FREE
                </Badge>
              ) : (
                <span className="font-bold text-foreground">₹{deliveryInfo.deliveryCost}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryEstimator;
