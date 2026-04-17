
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, Download, Truck, RefreshCw, XCircle, FileText, ArrowRight, Phone, Mail, MessageCircle, Clock } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { format } from 'date-fns';

import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';

const PolicyCard = ({ title, desc, icon: Icon, link }) => (
  <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <h4 className="font-bold text-foreground text-sm">{title}</h4>
    </div>
    <p className="text-xs text-muted-foreground leading-relaxed mb-4">{desc}</p>
    <Link to={link} className="text-xs font-bold text-primary hover:underline flex items-center">
      View Policy <ArrowRight className="w-3 h-3 ml-1" />
    </Link>
  </div>
);

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order) {
      const fetchOrder = async () => {
        try {
          const record = await pb.collection('orders').getOne(orderId, { $autoCancel: false });
          setOrder(record);
        } catch (error) {
          console.error('Error fetching order:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [orderId, order]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
            <Link to="/"><Button className="rounded-full">Return Home</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden">
      <Helmet><title>Order Confirmed - TioraS Fashions</title></Helmet>
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full mt-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
            Order Confirmed
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Thank you for shopping with TioraS Fashions. Your order <strong className="text-foreground">#{order.orderNumber}</strong> has been successfully placed.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-10 mb-12">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card border border-border/60 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-6 border-b border-border/50 pb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Order Details</h3>
              <div className="space-y-6">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <img src={item.image || '/placeholder.svg'} className="w-16 h-16 rounded-xl object-cover border border-border/50" alt="" />
                    <div className="flex-1">
                      <p className="font-bold text-sm text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-bold text-sm text-foreground">₹{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border/60 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-6 border-b border-border/50 pb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Next Steps</h3>
              <div className="relative pl-6 border-l-2 border-primary/20 space-y-8 py-2">
                <div className="relative">
                  <div className="absolute -left-[35px] w-4 h-4 rounded-full bg-primary ring-4 ring-background"></div>
                  <h4 className="font-bold text-sm text-foreground">Order Placed</h4>
                  <p className="text-xs text-muted-foreground mt-1">{format(new Date(order.orderDate), 'MMM d, h:mm a')}</p>
                </div>
                <div className="relative opacity-60">
                  <div className="absolute -left-[35px] w-4 h-4 rounded-full bg-muted border-2 border-primary ring-4 ring-background"></div>
                  <h4 className="font-bold text-sm text-foreground">Processing</h4>
                  <p className="text-xs text-muted-foreground mt-1">Takes 1-2 business days</p>
                </div>
                <div className="relative opacity-60">
                  <div className="absolute -left-[35px] w-4 h-4 rounded-full bg-muted border-2 border-primary ring-4 ring-background"></div>
                  <h4 className="font-bold text-sm text-foreground">Shipped</h4>
                  <p className="text-xs text-muted-foreground mt-1">Estimated delivery based on location</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-muted/30 border border-border/60 rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold text-foreground mb-4">Customer Info</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">Email</span>
                  <span className="font-medium text-foreground">Email notification sent</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">Shipping Address</span>
                  <span className="font-medium text-foreground block leading-relaxed">{order.shippingAddress}</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-border/50 flex flex-col gap-3">
                <Link to={`/account/orders`} className="block">
                  <Button className="w-full rounded-xl">Go to Dashboard</Button>
                </Link>
                <Button variant="outline" className="w-full rounded-xl"><Download className="w-4 h-4 mr-2" /> Download Invoice</Button>
              </div>
            </div>

            {/* Company Contact Info */}
            <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold text-foreground mb-4">Questions About Your Order?</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <p className="text-muted-foreground mb-2">TioraS Fashions</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    PLACEHOLDER - Street Address<br />
                    PLACEHOLDER - City, State, Postal Code<br />
                    India
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                  <Phone className="w-4 h-4 text-primary" />
                  <a href="tel:+91XXXXXXXXXX" className="text-primary hover:underline">
                    +91-XXXXXXXXXX
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <a href="mailto:support@tiorasfashions.com" className="text-primary hover:underline">
                    support@tiorasfashions.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    WhatsApp Support
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">PLACEHOLDER - Business Hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Legal Information */}
        <div className="border-t border-border/60 pt-16">
          <h2 className="text-2xl font-bold mb-8 text-center text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>Important Information</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <PolicyCard 
              title="Return Policy" 
              desc="Unworn non-custom items can be returned within 7 days of delivery." 
              icon={RefreshCw} 
              link="/return-policy" 
            />
            <PolicyCard 
              title="Refund Policy" 
              desc="Approved refunds are processed within 5-7 business days." 
              icon={FileText} 
              link="/refund-policy" 
            />
            <PolicyCard 
              title="Shipping Policy" 
              desc="Processing takes 1-2 days. You'll receive tracking once shipped." 
              icon={Truck} 
              link="/shipping-policy" 
            />
            <PolicyCard 
              title="Cancellation Policy" 
              desc="Orders can be cancelled free of charge within a 24-hour window." 
              icon={XCircle} 
              link="/cancellation-policy" 
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;
