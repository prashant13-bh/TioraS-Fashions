
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Package, Truck, CheckCircle2, Clock, MapPin, ArrowLeft, MessageCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
          <Skeleton className="h-32 w-full rounded-3xl mb-8" />
          <Skeleton className="h-96 w-full rounded-3xl" />
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
            <p className="text-muted-foreground mb-6">We couldn't find tracking information for this order.</p>
            <Link to="/"><Button className="rounded-full">Return Home</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const steps = [
    { id: 'Pending', label: 'Order Placed', icon: Package, desc: 'We have received your order' },
    { id: 'Confirmed', label: 'Payment Confirmed', icon: CheckCircle2, desc: 'Payment has been verified' },
    { id: 'In Production', label: 'In Production', icon: Clock, desc: 'Your items are being customized' },
    { id: 'Shipped', label: 'Shipped', icon: Truck, desc: 'Order is on the way' },
    { id: 'Delivered', label: 'Delivered', icon: MapPin, desc: 'Package has arrived' }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === order.orderStatus);
  const activeIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Track Order #{order.orderNumber} - TioraS Fashions</title>
      </Helmet>
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <Link to="/account/orders" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-medium text-sm">
          <ArrowLeft size={16} /> Back to Orders
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
            Track Your Order
          </h1>
          <p className="text-lg text-muted-foreground">
            Order #{order.orderNumber}
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 md:p-10 shadow-sm mb-8 border border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 pb-8 border-b border-border/50">
            <div className="text-center md:text-left">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Estimated Delivery</p>
              <p className="text-2xl font-bold text-primary">
                {order.estimatedDeliveryDate ? format(new Date(order.estimatedDeliveryDate), 'MMMM d, yyyy') : 'To be determined'}
              </p>
            </div>
            {order.trackingNumber && (
              <div className="text-center md:text-right">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Tracking Number</p>
                <p className="text-lg font-bold text-foreground">{order.trackingNumber}</p>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-border/50 -translate-x-1/2 hidden md:block"></div>
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border/50 md:hidden"></div>

            <div className="space-y-8 md:space-y-0 relative">
              {steps.map((step, index) => {
                const isCompleted = index <= activeIndex;
                const isCurrent = index === activeIndex;
                const Icon = step.icon;

                return (
                  <div key={step.id} className={`relative flex items-center md:justify-between ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} md:h-32`}>
                    
                    {/* Mobile Line */}
                    {index !== steps.length - 1 && (
                      <div className={`absolute left-6 top-12 bottom-[-2rem] w-0.5 md:hidden ${isCompleted ? 'bg-primary' : 'bg-border/50'}`}></div>
                    )}
                    
                    {/* Desktop Line */}
                    {index !== steps.length - 1 && (
                      <div className={`absolute left-1/2 top-1/2 bottom-[-4rem] w-0.5 -translate-x-1/2 hidden md:block ${isCompleted ? 'bg-primary' : 'bg-border/50'}`}></div>
                    )}

                    <div className={`w-full md:w-5/12 pl-16 md:pl-0 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                      <h3 className={`text-lg font-bold ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>{step.label}</h3>
                      <p className={`text-sm mt-1 ${isCompleted ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}>{step.desc}</p>
                      {isCurrent && index === 0 && <p className="text-xs font-medium text-primary mt-2">{format(new Date(order.orderDate), 'MMM d, h:mm a')}</p>}
                    </div>

                    <div className={`absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-4 flex items-center justify-center z-10 transition-colors duration-300 ${
                      isCurrent ? 'bg-primary border-primary/20 text-primary-foreground shadow-lg shadow-primary/30 scale-110' :
                      isCompleted ? 'bg-primary border-background text-primary-foreground' :
                      'bg-background border-border/50 text-muted-foreground'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="hidden md:block w-5/12"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card rounded-3xl p-6 shadow-sm border border-border/50">
            <h3 className="text-lg font-bold mb-4 border-b border-border/50 pb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Order Items</h3>
            <div className="space-y-4">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0">
                    <img src={item.image || '/placeholder.svg'} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground truncate">{item.title}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 shadow-sm border border-border/50 flex flex-col justify-center items-center text-center">
            <MessageCircle className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Need Help?</h3>
            <p className="text-muted-foreground mb-6">Have questions about your order or need to make a change?</p>
            <a href="https://wa.me/917353676454" target="_blank" rel="noopener noreferrer" className="w-full">
              <Button className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl shadow-md">
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderTrackingPage;
