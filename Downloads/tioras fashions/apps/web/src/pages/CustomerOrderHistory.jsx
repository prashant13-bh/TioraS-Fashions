
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Package, Search, SlidersHorizontal, ChevronRight, FileText, CheckCircle, Clock, Truck, Download, AlertCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

import AccountLayout from '@/components/AccountLayout.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const statusColors = {
  'Pending': 'bg-amber-100 text-amber-800 border-amber-200',
  'Confirmed': 'bg-blue-100 text-blue-800 border-blue-200',
  'In Production': 'bg-purple-100 text-purple-800 border-purple-200',
  'Shipped': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Out for Delivery': 'bg-orange-100 text-orange-800 border-orange-200',
  'Delivered': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Cancelled': 'bg-destructive/10 text-destructive border-destructive/20'
};

const CustomerOrderHistory = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Detail Sheet State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;
      try {
        const records = await pb.collection('orders').getFullList({
          filter: `userId = "${currentUser.id}"`,
          sort: '-created',
          $autoCancel: false
        });
        setOrders(records);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [currentUser]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const OrderTimeline = ({ currentStatus }) => {
    const steps = ['Pending', 'Confirmed', 'In Production', 'Shipped', 'Delivered'];
    
    let currentIndex = steps.indexOf(currentStatus);
    if (currentIndex === -1) {
      if (currentStatus === 'Out for Delivery') currentIndex = 3.5;
      else if (currentStatus === 'Quality Check') currentIndex = 2.5;
      else currentIndex = 0; // Default or cancelled
    }

    if (currentStatus === 'Cancelled') {
      return (
        <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20 flex items-center gap-3 text-destructive font-bold">
          <AlertCircle className="w-5 h-5" /> Order Cancelled
        </div>
      );
    }

    return (
      <div className="relative pt-6 pb-2">
        <div className="absolute top-10 left-6 right-6 h-1 bg-border/50 rounded-full -z-10"></div>
        <div 
          className="absolute top-10 left-6 h-1 bg-emerald-500 rounded-full -z-10 transition-all duration-1000"
          style={{ width: `calc(${(Math.min(Math.floor(currentIndex), steps.length - 1) / (steps.length - 1)) * 100}% - 48px)` }}
        ></div>

        <div className="flex justify-between relative">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentIndex;
            const isCurrent = Math.floor(currentIndex) === idx;
            
            return (
              <div key={step} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-2 transition-colors ${
                  isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-background border-border/60 text-muted-foreground'
                }`}>
                  {isCompleted ? <CheckCircle className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current opacity-30" />}
                </div>
                <span className={`text-[10px] sm:text-xs font-bold text-center ${isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <AccountLayout title="Order History">
      <Helmet>
        <title>Order History | TioraS Fashions</title>
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>Order History</h2>
          <p className="text-muted-foreground mt-1">Track, manage and view your recent orders.</p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-card border border-border/50 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 mb-8 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by order ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
          {['All', 'Pending', 'In Production', 'Shipped', 'Delivered'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
                statusFilter === status 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'bg-background text-foreground border-border/60 hover:bg-muted'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full rounded-2xl" />)}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-card border border-border/50 rounded-3xl p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-primary/40" />
          </div>
          <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>No orders found</h3>
          <p className="text-muted-foreground mb-8">You don't have any orders matching these filters.</p>
          <Link to="/products">
            <Button className="gradient-primary text-white rounded-full px-8 shadow-md">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map(order => {
            const statusStyle = statusColors[order.orderStatus] || statusColors['Pending'];
            const items = order.items || [];
            
            return (
              <div key={order.id} className="bg-card border border-border/50 rounded-3xl overflow-hidden hover:border-primary/30 transition-all shadow-sm group">
                <div className="bg-muted/30 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/50">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-foreground text-lg">{order.orderNumber}</span>
                      <Badge className={`${statusStyle} border`}>{order.orderStatus}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Placed on {format(new Date(order.orderDate || order.created), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                    <div>
                      <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold mb-0.5">Total Amount</p>
                      <p className="text-xl font-bold text-primary">₹{order.totalAmount?.toFixed(2)}</p>
                    </div>
                    <Button variant="outline" size="sm" className="mt-0 sm:mt-2 rounded-xl bg-background hidden sm:flex" onClick={() => openOrderDetails(order)}>
                      View Details <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>

                <div className="p-6 cursor-pointer" onClick={() => openOrderDetails(order)}>
                  <div className="flex gap-4 overflow-x-auto pb-2 mb-4 custom-scrollbar">
                    {items.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-muted border border-border/50 relative">
                        <img src={item.image || "https://images.unsplash.com/photo-1552169113-e367653a9d5b?w=200"} alt="Product" className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 right-0 bg-background/90 text-xs font-bold px-1.5 py-0.5 rounded-tl-lg backdrop-blur-sm border-t border-l border-border/50">
                          x{item.quantity}
                        </div>
                      </div>
                    ))}
                    {items.length > 4 && (
                      <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-muted border border-border/50 flex items-center justify-center text-muted-foreground font-bold">
                        +{items.length - 4}
                      </div>
                    )}
                  </div>
                  
                  <OrderTimeline currentStatus={order.orderStatus} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Details Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl p-0 bg-background overflow-y-auto">
          {selectedOrder && (
            <div className="flex flex-col min-h-full">
              <SheetHeader className="p-6 border-b border-border/50 bg-card sticky top-0 z-10">
                <SheetTitle className="flex justify-between items-center w-full pr-8">
                  <span className="font-bold text-2xl" style={{ fontFamily: 'Playfair Display, serif' }}>Order Details</span>
                  <Badge className={`${statusColors[selectedOrder.orderStatus] || statusColors['Pending']} border text-sm py-1 px-3`}>
                    {selectedOrder.orderStatus}
                  </Badge>
                </SheetTitle>
              </SheetHeader>

              <div className="p-6 space-y-8">
                {/* Timeline */}
                <div>
                  <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-sm">Order Status</h4>
                  <OrderTimeline currentStatus={selectedOrder.orderStatus} />
                </div>

                <div className="grid sm:grid-cols-2 gap-6 bg-muted/20 p-5 rounded-2xl border border-border/50">
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Order Information</h4>
                    <p className="font-medium text-foreground">ID: {selectedOrder.orderNumber}</p>
                    <p className="text-sm text-foreground/80">Date: {format(new Date(selectedOrder.orderDate || selectedOrder.created), 'MMM d, yyyy h:mm a')}</p>
                    {selectedOrder.trackingNumber && (
                      <p className="text-sm font-medium text-primary mt-1">Tracking: {selectedOrder.trackingNumber}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Payment Details</h4>
                    <p className="font-medium text-foreground">Method: {selectedOrder.paymentMethod || 'Razorpay'}</p>
                    <p className={`text-sm font-bold ${selectedOrder.paymentStatus === 'Confirmed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      Status: {selectedOrder.paymentStatus || 'Paid'}
                    </p>
                  </div>
                </div>

                {/* Items List */}
                <div>
                  <h4 className="font-bold text-foreground mb-4 uppercase tracking-wider text-sm border-b border-border/50 pb-2">Items Ordered</h4>
                  <div className="space-y-4">
                    {(selectedOrder.items || []).map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="w-20 h-24 rounded-xl overflow-hidden bg-muted border border-border/50 shrink-0">
                          <img src={item.image || "https://images.unsplash.com/photo-1552169113-e367653a9d5b?w=200"} alt="Product" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <p className="font-bold text-foreground line-clamp-1">{item.productName || item.title}</p>
                            <p className="text-sm text-muted-foreground">Variant: {item.variantTitle || 'Standard'}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-bold text-foreground">₹{((item.price_in_cents || 0) / 100).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-card p-5 rounded-2xl border border-border/50 space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{selectedOrder.subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span>₹{selectedOrder.shippingCost?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tax</span>
                    <span>₹{selectedOrder.tax?.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-border/50 flex justify-between font-bold text-lg text-foreground">
                    <span>Total</span>
                    <span className="text-primary">₹{selectedOrder.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.shippingAddress && (
                  <div>
                    <h4 className="font-bold text-foreground mb-4 uppercase tracking-wider text-sm border-b border-border/50 pb-2">Shipping Address</h4>
                    <div className="text-sm text-foreground/80 whitespace-pre-line leading-relaxed">
                      {selectedOrder.shippingAddress}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="mt-auto p-6 border-t border-border/50 bg-muted/10 grid grid-cols-2 gap-3 sticky bottom-0">
                <Button variant="outline" className="rounded-xl font-bold border-primary/20 hover:bg-primary/5">
                  <Download className="w-4 h-4 mr-2" /> Invoice
                </Button>
                <Button className="gradient-primary text-white rounded-xl font-bold">
                  Track Shipment
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

    </AccountLayout>
  );
};

export default CustomerOrderHistory;
