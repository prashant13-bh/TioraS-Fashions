
import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart as ShoppingCartIcon, X, Plus, Minus, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart.jsx';
import { Button } from '@/components/ui/button';
import { initializeCheckout } from '@/api/EcommerceApi';
import { useToast } from '@/hooks/use-toast';

const ShoppingCart = ({ isCartOpen, setIsCartOpen }) => {
  const { toast } = useToast();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = useCallback(async () => {
    if (cartItems.length === 0) {
      toast({
        title: 'Your cart is empty',
        description: 'Add some products to your cart before checking out.',
        variant: 'destructive',
      });
      return;
    }

    setIsCheckingOut(true);
    try {
      const items = cartItems.map(item => ({
        variant_id: item.variant.id,
        quantity: item.quantity,
      }));

      const successUrl = `${window.location.origin}/success`;
      const cancelUrl = window.location.href;

      const { url } = await initializeCheckout({ items, successUrl, cancelUrl });

      clearCart();
      window.location.href = url;
    } catch (error) {
      toast({
        title: 'Checkout Error',
        description: 'There was a problem initializing checkout. Please try again.',
        variant: 'destructive',
      });
      setIsCheckingOut(false);
    }
  }, [cartItems, clearCart, toast]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card/95 backdrop-blur-xl border-l text-card-foreground shadow-2xl flex flex-col z-50"
          >
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <h2 className="text-2xl font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
                Your Cart
              </h2>
              <Button onClick={() => setIsCartOpen(false)} variant="ghost" size="icon" className="hover:bg-muted rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-grow p-6 overflow-y-auto space-y-6">
              {cartItems.length === 0 ? (
                <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center opacity-70">
                  <ShoppingCartIcon size={64} className="mb-4 text-primary/40" />
                  <p className="text-lg font-medium" style={{ fontFamily: 'Playfair Display, serif' }}>Your cart is beautifully empty.</p>
                  <p className="text-sm mt-2">Time to add some premium items!</p>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.variant.id} className="flex gap-4 bg-background p-4 rounded-xl border border-border shadow-sm relative group">
                    <img 
                      src={item.product.image || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K"} 
                      alt={item.product.title} 
                      className="w-24 h-24 object-cover rounded-lg bg-muted" 
                    />
                    <div className="flex-grow flex flex-col justify-between">
                      <div className="pr-6">
                        <h3 className="font-bold text-foreground leading-tight">{item.product.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{item.variant.title}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-base text-primary font-bold">
                          {item.variant.sale_price_formatted || item.variant.price_formatted}
                        </p>
                        
                        <div className="flex items-center border border-border rounded-lg overflow-hidden bg-muted/50">
                          <button onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))} className="p-1.5 hover:bg-background transition-colors">
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.variant.id, item.quantity + 1)} className="p-1.5 hover:bg-background transition-colors">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.variant.id)}
                      className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
            
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-border/50 bg-muted/10">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg text-muted-foreground">Subtotal</span>
                  <span className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {getCartTotal()}
                  </span>
                </div>
                <Button 
                  onClick={handleCheckout} 
                  disabled={isCheckingOut}
                  className="w-full gradient-primary text-white font-bold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
                >
                  {isCheckingOut ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-4">
                  Taxes and shipping calculated at checkout.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;
