
import React, { useState } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const NotifyMeModal = ({ isOpen, onClose, productId }) => {
  const { currentUser } = useAuth();
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    if (!phone) return true; // Optional field
    return /^\d{10}$/.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (phone && !validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      await pb.collection('wishlist_notifications').create({
        userId: currentUser?.id || '',
        type: 'back_in_stock',
        productId: productId,
        // Store contact info in metadata or separate fields if needed
      }, { $autoCancel: false });

      toast.success("We'll notify you when this product is back in stock");
      onClose();
      setEmail(currentUser?.email || '');
      setPhone('');
      setErrors({});
    } catch (error) {
      console.error('Failed to create notification:', error);
      toast.error('Failed to set up notification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
            <Bell className="w-5 h-5 text-primary" />
            Notify Me When Available
          </DialogTitle>
          <DialogDescription>
            Enter your contact details and we'll notify you when this product is back in stock.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="notify-email" className="text-foreground">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="notify-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({ ...errors, email: '' });
              }}
              className="text-foreground"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notify-phone" className="text-foreground">
              Phone Number (Optional)
            </Label>
            <Input
              id="notify-phone"
              type="tel"
              placeholder="10-digit number"
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                setPhone(value);
                setErrors({ ...errors, phone: '' });
              }}
              maxLength={10}
              className="text-foreground"
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 gradient-primary text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Notify Me'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NotifyMeModal;
