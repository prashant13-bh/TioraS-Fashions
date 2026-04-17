
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Calendar, CreditCard, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id') || 'ORD-' + Math.floor(1000000 + Math.random() * 9000000);
  
  // Mock estimated delivery date (7 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);
  const formattedDate = deliveryDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <>
      <Helmet>
        <title>Order Successful - TioraS Fashions Studio</title>
        <meta name="description" content="Thank you for your purchase. Your order has been confirmed." />
      </Helmet>
      
      <Header />
      
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-3xl"
        >
          <Card className="premium-card overflow-hidden border-none shadow-2xl rounded-2xl">
            <div className="bg-primary p-10 text-center text-primary-foreground relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                className="relative z-10 inline-flex items-center justify-center w-24 h-24 rounded-full bg-secondary text-secondary-foreground mb-6 shadow-xl ring-4 ring-primary-foreground/20"
              >
                <CheckCircle className="w-12 h-12" />
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 relative z-10" style={{ fontFamily: 'Playfair Display, serif' }}>
                Payment Successful!
              </h1>
              <p className="text-primary-foreground/90 text-lg relative z-10 max-w-lg mx-auto">
                Thank you for your premium order. We are getting everything ready for you.
              </p>
            </div>
            
            <CardContent className="p-8 md:p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/40 border border-border/50">
                  <div className="p-3 bg-primary/10 rounded-full mb-4 text-primary">
                    <Package className="w-6 h-6" />
                  </div>
                  <span className="text-sm text-muted-foreground mb-1 font-medium">Order Reference</span>
                  <span className="font-bold text-foreground text-lg tracking-wide">{sessionId.substring(0, 12)}</span>
                </div>
                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/40 border border-border/50">
                  <div className="p-3 bg-primary/10 rounded-full mb-4 text-primary">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <span className="text-sm text-muted-foreground mb-1 font-medium">Est. Delivery</span>
                  <span className="font-bold text-foreground text-[15px]">{formattedDate}</span>
                </div>
                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/40 border border-border/50">
                  <div className="p-3 bg-primary/10 rounded-full mb-4 text-primary">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <span className="text-sm text-muted-foreground mb-1 font-medium">Payment Status</span>
                  <span className="font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full text-sm">Paid Successfully</span>
                </div>
              </div>

              <div className="bg-background border-2 border-border/60 rounded-2xl p-8 space-y-6">
                <h3 className="font-bold text-xl border-b border-border/50 pb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  What happens next?
                </h3>
                <ul className="space-y-5 text-muted-foreground">
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-secondary/20 text-secondary-foreground flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold border border-secondary/30">1</div>
                    <p className="leading-relaxed"><strong className="text-foreground">Confirmation Email:</strong> You will receive an email shortly with details of your order and receipt.</p>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-secondary/20 text-secondary-foreground flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold border border-secondary/30">2</div>
                    <p className="leading-relaxed"><strong className="text-foreground">Processing:</strong> Our expert team will begin processing and customizing your premium items.</p>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-secondary/20 text-secondary-foreground flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold border border-secondary/30">3</div>
                    <p className="leading-relaxed"><strong className="text-foreground">Shipping:</strong> We'll notify you with tracking information as soon as your order has left our facility.</p>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 justify-center pt-4">
                <Link to="/products" className="flex-1">
                  <Button className="w-full gradient-primary text-white h-14 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all">
                    Continue Shopping
                  </Button>
                </Link>
                <Link to="/account" className="flex-1">
                  <Button variant="outline" className="w-full h-14 text-lg rounded-xl border-border/80 group">
                    View Orders <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </>
  );
};

export default SuccessPage;
