
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '@/hooks/useCart.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { CartBanner } from '@/components/LegalBanners.jsx';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <>
        <Helmet>
          <title>Shopping Cart - TioraS Fashions Studio</title>
        </Helmet>
        
        <Header />
        
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground opacity-50" />
            <h2 className="text-3xl font-bold mb-4 text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
              Your cart is empty
            </h2>
            <p className="text-muted-foreground mb-8">
              Start adding products to your cart to see them here
            </p>
            <Link to="/products">
              <Button className="gradient-primary text-white rounded-full px-8 py-6 text-lg shadow-md">
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shopping Cart - TioraS Fashions Studio</title>
      </Helmet>
      
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full mt-10">
        <CartBanner />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
            Shopping Cart
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.variant.id} className="premium-card overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                        <img
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-xl text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
                              {item.product.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Variant: {item.variant.title}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.variant.id)}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between pt-4">
                          <div className="flex items-center space-x-2 border border-border/60 rounded-lg bg-background">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))}
                              className="h-8 w-8 rounded-none rounded-l-lg hover:bg-muted text-foreground"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-10 text-center font-medium text-foreground">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                              className="h-8 w-8 rounded-none rounded-r-lg hover:bg-muted text-foreground"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <p className="text-xl font-bold text-primary">
                              {item.variant.sale_price_formatted || item.variant.price_formatted}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="premium-card sticky top-28 bg-muted/20">
                <CardContent className="p-8 space-y-6">
                  <h3 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Order Summary
                  </h3>

                  <Separator className="bg-border/60" />

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</span>
                      <span className="font-medium text-foreground">{getCartTotal()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping & Taxes</span>
                      <span className="font-medium text-muted-foreground">Calculated at checkout</span>
                    </div>
                  </div>

                  <Separator className="bg-border/60" />

                  <div className="flex justify-between text-xl font-bold text-foreground">
                    <span>Total Estimate</span>
                    <span className="text-primary">{getCartTotal()}</span>
                  </div>

                  <p className="text-xs text-muted-foreground text-center px-4">
                    By proceeding, you'll enter our secure checkout environment.
                  </p>

                  <div className="pt-2 flex flex-col gap-3">
                    <Link to="/checkout" className="block w-full">
                      <Button className="w-full gradient-primary text-white py-6 text-lg rounded-xl shadow-md transition-transform active:scale-[0.98]">
                        Proceed to Checkout
                      </Button>
                    </Link>

                    <Link to="/products" className="block">
                      <Button variant="outline" className="w-full py-6 rounded-xl border-border/60">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Before You Checkout Bento */}
          <div className="border-t border-border/50 pt-16 mb-8">
            <h2 className="text-2xl font-bold mb-8 text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
              Before You Checkout
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-[hsl(var(--legal-primary))]/5 border border-[hsl(var(--legal-primary))]/20 rounded-3xl p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 transition-all hover:bg-[hsl(var(--legal-primary))]/10">
                <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--legal-primary))]/10 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-8 h-8 text-[hsl(var(--legal-primary))]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Return Guarantee</h3>
                  <p className="text-muted-foreground text-sm mb-3">Shop with confidence. We offer a 30-day hassle-free return window for all unworn items in their original condition.</p>
                  <Link to="/return-policy" className="text-sm font-bold text-[hsl(var(--legal-primary))] hover:underline">Read Return Policy &rarr;</Link>
                </div>
              </div>
              
              <div className="bg-[hsl(var(--legal-success))]/5 border border-[hsl(var(--legal-success))]/20 rounded-3xl p-8 flex flex-col items-start gap-4 transition-all hover:bg-[hsl(var(--legal-success))]/10">
                <div className="w-12 h-12 rounded-xl bg-[hsl(var(--legal-success))]/10 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-[hsl(var(--legal-success))]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">Secure Checkout</h3>
                  <p className="text-muted-foreground text-sm mb-3">Your payment data is protected and encrypted.</p>
                  <Link to="/privacy-policy" className="text-xs font-bold text-[hsl(var(--legal-success))] hover:underline">Privacy Policy</Link>
                </div>
              </div>

              <div className="bg-muted/30 border border-border/60 rounded-3xl p-8 flex flex-col items-start gap-4 transition-all hover:bg-muted/50">
                <div className="w-12 h-12 rounded-xl bg-background border border-border/50 flex items-center justify-center">
                  <Truck className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">Fast Shipping</h3>
                  <p className="text-muted-foreground text-sm mb-3">Free shipping on orders over ₹500 across India.</p>
                  <Link to="/shipping-policy" className="text-xs font-bold text-foreground hover:underline">Shipping Details</Link>
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>

      <Footer />
    </>
  );
};

export default Cart;
