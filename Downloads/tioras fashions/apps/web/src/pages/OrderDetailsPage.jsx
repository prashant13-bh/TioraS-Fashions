
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import { ArrowLeft, Package, Truck, CreditCard, Download, CheckCircle2, Clock, RotateCcw } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

import AccountLayout from '@/components/AccountLayout.jsx';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const record = await pb.collection('orders').getOne(orderId, { $autoCancel: false });
        if (record.userId !== currentUser.id && currentUser.role !== 'admin') {
          navigate('/account/orders');
          return;
        }
        setOrder(record);
      } catch (error) {
        console.error('Error fetching order:', error);
        navigate('/account/orders');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) fetchOrder();
  }, [orderId, currentUser, navigate]);

  if (loading) {
    return (
      <AccountLayout title="Order Details">
        <div className="space-y-8">
          <Skeleton className="h-32 w-full rounded-3xl" />
          <div className="grid md:grid-cols-3 gap-8">
            <Skeleton className="h-64 w-full rounded-3xl md:col-span-2" />
            <Skeleton className="h-64 w-full rounded-3xl" />
          </div>
        </div>
      </AccountLayout>
    );
  }

  if (!order) return null;

  const orderDate = new Date(order.orderDate);
  const isEligibleForReturn = differenceInDays(new Date(), orderDate) <= 30;

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in production': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-secondary/20 text-secondary-foreground border-secondary/30';
    }
  };

  const handleDownloadInvoice = () => {
    toast.success("Downloading invoice...");
    // Mock logic for downloading
  };

  const handleReturnInitiate = () => {
    navigate(`/account/return-item?order=${order.orderNumber}`);
  };

  return (
    <AccountLayout title="Order Details">
      <Helmet>
        <title>Order #{order.orderNumber} - TioraS Fashions</title>
      </Helmet>

      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/account/orders')} className="text-muted-foreground hover:text-foreground -ml-2">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
        </Button>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="rounded-xl border-border/60 shadow-sm flex-1 sm:flex-none" onClick={handleDownloadInvoice}>
            <Download className="w-4 h-4 mr-2" /> Invoice
          </Button>
          <Link to={`/orders/${order.id}`} className="flex-1 sm:flex-none">
            <Button size="sm" className="w-full gradient-primary text-white rounded-xl shadow-sm">Track Order</Button>
          </Link>
        </div>
      </div>

      {/* Header Card */}
      <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
              Order #{order.orderNumber}
            </h2>
            <Badge variant="outline" className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border ${getStatusColor(order.orderStatus)}`}>
              {order.orderStatus}
            </Badge>
          </div>
          <p className="text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" /> Placed on {format(orderDate, 'MMMM d, yyyy at h:mm a')}
          </p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Order Total</p>
          <p className="text-3xl font-bold text-primary">₹{order.totalAmount?.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Items */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border/50 bg-muted/10 flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                <Package className="w-5 h-5 text-primary" /> Order Items
              </h3>
            </div>
            <div className="divide-y divide-border/50">
              {order.items?.map((item, idx) => (
                <div key={idx} className="p-6 flex flex-col sm:flex-row gap-6 group">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-muted border border-border/50 shrink-0">
                    <img src={item.image || '/placeholder.svg'} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h4 className="font-bold text-lg text-foreground">{item.title}</h4>
                      <p className="font-bold text-foreground">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1 mb-4">
                      <p>Variant: {item.variantTitle}</p>
                      <p>Qty: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link to={`/product/${item.productId}`}>
                        <Button variant="outline" size="sm" className="rounded-xl text-xs border-border/60">View Product</Button>
                      </Link>
                      {isEligibleForReturn && (
                        <Button variant="secondary" size="sm" className="rounded-xl text-xs" onClick={handleReturnInitiate}>
                          <RotateCcw className="w-3 h-3 mr-1" /> Return Item
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground bg-muted/20 border border-border/50 rounded-2xl p-4">
            <p><strong>Note on Returns:</strong> Unworn items can be returned within 30 days. Read our <Link to="/return-policy" className="text-primary hover:underline">Return Policy</Link> or <Link to="/refund-policy" className="text-primary hover:underline">Refund Policy</Link> for details.</p>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="space-y-8">
          {/* Summary */}
          <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 border-b border-border/50 pb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground font-medium">₹{order.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping ({order.shippingMethod})</span>
                <span className="text-foreground font-medium">₹{order.shippingCost?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax</span>
                <span className="text-foreground font-medium">₹{order.tax?.toFixed(2)}</span>
              </div>
              <div className="pt-3 mt-3 border-t border-border/50 flex justify-between items-center">
                <span className="font-bold text-foreground">Total</span>
                <span className="text-xl font-bold text-primary">₹{order.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 border-b border-border/50 pb-4 flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              <Truck className="w-5 h-5 text-primary" /> Shipping Info
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-bold text-foreground mb-1">Delivery Address</p>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {order.shippingAddress}
                </p>
              </div>
              {order.trackingNumber && (
                <div className="pt-4 border-t border-border/50">
                  <p className="font-bold text-foreground mb-1">Tracking Number</p>
                  <p className="text-primary font-medium">{order.trackingNumber}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 border-b border-border/50 pb-4 flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              <CreditCard className="w-5 h-5 text-primary" /> Payment Info
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Method</span>
                <span className="font-medium text-foreground">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <span className="flex items-center gap-1 font-medium text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" /> {order.paymentStatus}
                </span>
              </div>
              {order.razorpayPaymentId && (
                <div className="pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Transaction ID</p>
                  <p className="font-mono text-xs text-foreground break-all">{order.razorpayPaymentId}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
};

export default OrderDetailsPage;
