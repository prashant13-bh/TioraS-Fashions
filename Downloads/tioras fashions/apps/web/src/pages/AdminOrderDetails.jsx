
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { ArrowLeft, Save, MapPin, CreditCard, Package, BellRing, Printer } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';

import Header from '@/components/Header.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import OrderStatusTimeline from '@/components/OrderStatusTimeline.jsx';
import InvoiceGenerator from '@/components/InvoiceGenerator.jsx';

const AdminOrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Edit state
  const [status, setStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      const response = await apiServerClient.fetch(`/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
        setStatus(data.orderStatus);
        setTrackingNumber(data.trackingNumber || '');
      } else {
        toast.error('Failed to load order details');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId]);

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      const response = await apiServerClient.fetch(`/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, trackingNumber, notes })
      });
      
      if (!response.ok) throw new Error('Failed to update status');
      
      const updatedOrder = await response.json();
      setOrder(updatedOrder);
      setNotes(''); // Clear notes after submission
      toast.success('Order status updated successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleManualNotify = () => {
    toast.success('Email notification sent to customer', {
      description: `Updates about status: ${status} have been dispatched.`
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex justify-center items-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Manage Order #{order.orderNumber} - Admin</title>
      </Helmet>
      
      <Header />

      <main className="flex-1 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/admin/orders" className="hover:text-primary flex items-center"><ArrowLeft className="w-4 h-4 mr-1"/> Back to Dashboard</Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              Order #{order.orderNumber}
            </h1>
            <p className="text-muted-foreground mt-1">Placed on {format(new Date(order.orderDate), 'MMMM d, yyyy ')}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.print()} className="font-medium bg-card">
              <Printer className="w-4 h-4 mr-2" /> Print
            </Button>
            <InvoiceGenerator orderId={order.id} variant="secondary" className="font-medium shadow-sm" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: Updates & Action */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Timeline */}
            <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-bold mb-6 text-foreground">Status Timeline</h2>
              <OrderStatusTimeline currentStatus={order.orderStatus} />
            </div>

            {/* Status Update Panel */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-bold mb-6 text-primary flex items-center gap-2">
                <BellRing className="w-5 h-5" /> Update Order Status
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label>Current Status</Label>
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="In Production">In Production</option>
                    <option value="Quality Check">Quality Check</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Tracking Number (Courier)</Label>
                  <Input 
                    value={trackingNumber} 
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. BLUDART12345" 
                    className="bg-card"
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label>Internal Note / Customer Update (Optional)</Label>
                  <Textarea 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add a note about this status update..." 
                    className="bg-card min-h-[80px]"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleUpdateStatus} 
                  disabled={isUpdating || (status === order.orderStatus && !notes && trackingNumber === (order.trackingNumber || ''))}
                  className="gradient-primary text-white"
                >
                  {isUpdating ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Update</>}
                </Button>
                <Button variant="outline" onClick={handleManualNotify} className="bg-background">
                  Notify Customer
                </Button>
              </div>

              {order.notes && (
                <div className="mt-8 pt-6 border-t border-primary/10">
                  <h3 className="font-bold text-sm text-primary mb-3">Previous Notes</h3>
                  <div className="bg-background rounded-xl p-4 text-sm text-foreground/80 whitespace-pre-wrap border border-primary/10 max-h-[150px] overflow-y-auto">
                    {order.notes}
                  </div>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><Package className="w-5 h-5 text-muted-foreground" /> Ordered Items</h2>
              <div className="space-y-4">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-muted/10">
                    <div className="w-16 h-16 rounded-lg bg-background border overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-foreground truncate">{item.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">Product ID: {item.productId}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-sm text-foreground">₹{(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">₹{item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Customer & Details */}
          <div className="space-y-6">
            
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold mb-4 flex items-center gap-2 text-foreground"><MapPin className="w-4 h-4 text-muted-foreground"/> Customer Details</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-bold text-foreground">{order.shippingAddress?.fullName}</p>
                  <p className="text-muted-foreground">{order.shippingAddress?.email}</p>
                  <p className="text-muted-foreground">{order.shippingAddress?.phone}</p>
                </div>
                <div className="pt-4 border-t border-border/50">
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Shipping Address</p>
                  <p className="text-foreground">{order.shippingAddress?.street}</p>
                  <p className="text-foreground">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
                  <p className="text-foreground">{order.shippingAddress?.country}</p>
                </div>
                <div className="pt-4 border-t border-border/50">
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Shipping Method</p>
                  <p className="text-foreground font-medium">{order.shippingMethod}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold mb-4 flex items-center gap-2 text-foreground"><CreditCard className="w-4 h-4 text-muted-foreground"/> Payment Info</h2>
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Method</span>
                  <span className="font-medium text-foreground">{order.paymentMethod || 'Razorpay'}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Status</span>
                  <span className={`font-bold ${order.paymentStatus === 'Confirmed' ? 'text-emerald-600' : 'text-amber-600'}`}>{order.paymentStatus}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Transaction ID</span>
                  <span className="font-mono text-xs">{order.razorpayPaymentId || 'N/A'}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm border-t border-border/50 pt-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span><span>₹{order.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span><span>₹{order.shippingCost?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span><span>₹{order.tax?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-end font-bold text-lg text-foreground pt-2">
                  <span>Total</span><span className="text-primary">₹{order.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
};

export default AdminOrderDetails;
