
import React from 'react';
import { motion } from 'framer-motion';
import { Gift, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart.jsx';
import { toast } from 'sonner';

const giftCards = [
  {
    id: 'gift-500',
    amount: 500,
    description: 'Perfect for small gifts',
    color: 'from-[#D4AF37]/20 to-[#D4AF37]/5'
  },
  {
    id: 'gift-1000',
    amount: 1000,
    description: 'Great for medium gifts',
    color: 'from-primary/20 to-primary/5'
  },
  {
    id: 'gift-2500',
    amount: 2500,
    description: 'Ideal for large gifts',
    color: 'from-[#1a1a2e]/20 to-[#1a1a2e]/5'
  },
  {
    id: 'gift-5000',
    amount: 5000,
    description: 'Premium gift option',
    color: 'from-[#D4AF37]/30 to-[#D4AF37]/10'
  }
];

const GiftCards = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleBuyNow = async (card) => {
    // Create a virtual gift card product for cart
    const giftCardProduct = {
      id: card.id,
      title: `Gift Card - ₹${card.amount}`,
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800'
    };

    const giftCardVariant = {
      id: card.id,
      title: `₹${card.amount} Gift Card`,
      price_in_cents: card.amount * 100,
      currency: 'INR',
      currency_info: { code: 'INR', symbol: '₹' },
      price_formatted: `₹${card.amount}`,
      manage_inventory: false
    };

    try {
      await addToCart(giftCardProduct, giftCardVariant, 1, 999);
      toast.success('Gift card added to cart');
      navigate('/checkout');
    } catch (error) {
      toast.error('Failed to add gift card');
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {giftCards.map((card, idx) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          whileHover={{ y: -4 }}
        >
          <Card className={`overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300 bg-gradient-to-br ${card.color} h-full flex flex-col`}>
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Gift className="w-8 h-8 text-primary" />
                </div>
              </div>

              <div className="text-center mb-4 flex-1">
                <h3 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  ₹{card.amount}
                </h3>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={() => handleBuyNow(card)}
                  className="w-full gradient-primary text-white h-11 rounded-xl shadow-md"
                >
                  Buy Now
                </Button>
                <Button
                  variant="link"
                  className="w-full text-primary p-0 h-auto text-sm"
                >
                  Learn More <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default GiftCards;
