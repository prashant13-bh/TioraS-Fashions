
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Package, Search, SlidersHorizontal, ChevronRight, Download, XCircle, RefreshCw } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

import AccountLayout from '@/components/AccountLayout.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const OrdersPage = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

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
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in production': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-secondary/20 text-secondary-foreground border-secondary/30';
    }
  };

  return (
    <AccountLayout title="Your Orders">
      <Helmet>
        <title>Your Orders - TioraS Fashions</title>
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>Order History</h2>
          <p className="text-muted-foreground mt-1">Track, return, or buy items again.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-card border border-border/50 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 mb-8 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by Order ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background border-border/60"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="text-muted-foreground w-4 h-4" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-w-[160px]"
          >
            <option value="All">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="In Production">In Production</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-48 w-full rounded-3xl" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-card border border-border/50 rounded-3xl p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>No orders found</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {searchQuery || statusFilter !== 'All' 
              ? "We couldn't find any orders matching your filters." 
              : "You haven't placed any orders yet. Start exploring our premium collection!"}
          </p>
          <Link to="/products">
            <Button className="gradient-primary text-white rounded-full px-8 h-12 shadow-md">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Order Header */}
              <div className="bg-muted/30 border-b border-border/50 p-5 sm:px-8 flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-wrap gap-x-8 gap-y-2">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Order Placed</p>
                    <p className="font-medium text-foreground">{format(new Date(order.orderDate), 'MMM d, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Total</p>
                    <p className="font-medium text-foreground">₹{order.totalAmount?.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Order #</p>
                    <p className="font-medium text-foreground">{order.orderNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </Badge>
                  <Link to={`/account/orders/${order.id}`}>
                    <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 rounded-xl font-bold">
                      View Details <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-5 sm:p-8 flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {order.orderStatus === 'Delivered' ? 'Delivered on ' : 'Estimated Delivery: '}
                    <span className="text-primary">
                      {order.estimatedDeliveryDate ? format(new Date(order.estimatedDeliveryDate), 'MMM d, yyyy') : 'TBD'}
                    </span>
                  </h4>
                  
                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {order.items?.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted border border-border/50 shrink-0">
                        <img src={item.image || '/placeholder.svg'} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 right-0 bg-background/90 text-[10px] font-bold px-1.5 py-0.5 rounded-tl-lg border-t border-l border-border/50">
                          x{item.quantity}
                        </div>
                      </div>
                    ))}
                    {order.items?.length > 4 && (
                      <div className="w-20 h-20 rounded-xl bg-muted border border-border/50 shrink-0 flex items-center justify-center text-muted-foreground font-bold">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
                  <Link to={`/orders/${order.id}`} className="w-full">
                    <Button className="w-full gradient-primary text-white rounded-xl shadow-sm">Track Order</Button>
                  </Link>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="rounded-xl text-xs"><Download className="w-3 h-3 mr-1.5" /> Invoice</Button>
                    {order.orderStatus === 'Delivered' ? (
                      <Button variant="outline" className="rounded-xl text-xs"><RefreshCw className="w-3 h-3 mr-1.5" /> Reorder</Button>
                    ) : (
                      <Button variant="outline" className="rounded-xl text-xs text-destructive hover:text-destructive hover:bg-destructive/10"><XCircle className="w-3 h-3 mr-1.5" /> Cancel</Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AccountLayout>
  );
};

export default OrdersPage;
