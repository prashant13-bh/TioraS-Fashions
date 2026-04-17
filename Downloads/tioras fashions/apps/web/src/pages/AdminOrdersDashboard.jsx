
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Search, Download, ExternalLink, Activity } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';

import Header from '@/components/Header.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const AdminOrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      let query = `/admin/orders?page=${page}&limit=20`;
      if (filter !== 'All') query += `&status=${encodeURIComponent(filter)}`;
      if (search) query += `&searchQuery=${encodeURIComponent(search)}`;
      
      const response = await apiServerClient.fetch(query);
      if (response.ok) {
        const data = await response.json();
        // Backend returns paginated response, assuming { items, page, totalPages } format
        // If it returns array directly due to missing paginated wrapper, we'll adapt:
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders(data.items || data.data || []);
          setPagination({ page: data.page || 1, totalPages: data.totalPages || 1 });
        }
      }
    } catch (error) {
      console.error('Failed to fetch admin orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search slightly
    const timeoutId = setTimeout(() => fetchOrders(1), 300);
    return () => clearTimeout(timeoutId);
  }, [filter, search]);

  const handleExportCSV = () => {
    if (!orders.length) return;
    
    const headers = ['Order ID', 'Date', 'Customer Name', 'Email', 'Status', 'Payment', 'Total Amount', 'Items'];
    const csvContent = orders.map(o => {
      const itemsStr = (o.items || []).map(i => `${i.quantity}x ${i.name}`).join('; ');
      return [
        o.orderNumber,
        format(new Date(o.orderDate), 'yyyy-MM-dd'),
        o.shippingAddress?.fullName || 'N/A',
        o.shippingAddress?.email || 'N/A',
        o.orderStatus,
        o.paymentStatus,
        o.totalAmount,
        `"${itemsStr}"` // quote to handle commas
      ].join(',');
    });
    
    const csv = [headers.join(','), ...csvContent].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_export_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      case 'Shipped': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'Cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Pending': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      default: return 'bg-primary/10 text-primary border-primary/20'; 
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Admin Orders - TioraS Fashions</title>
      </Helmet>
      
      <Header />

      <main className="flex-1 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-border/50 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Activity className="text-primary w-8 h-8" /> Orders Command Center
            </h1>
            <p className="text-muted-foreground mt-1">Manage, update, and track all customer orders.</p>
          </div>
          <Button variant="outline" onClick={handleExportCSV} className="bg-card shadow-sm font-medium">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
          
          <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row gap-4 justify-between bg-muted/10">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search order #, customer name..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background border-border/60 shadow-sm"
              />
            </div>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm font-medium shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-full sm:w-48"
            >
              <option value="All">All Statuses</option>
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

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="font-bold w-[120px]">Order #</TableHead>
                  <TableHead className="font-bold">Date</TableHead>
                  <TableHead className="font-bold">Customer</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Payment</TableHead>
                  <TableHead className="font-bold text-right">Total</TableHead>
                  <TableHead className="font-bold text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <div className="flex justify-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      No orders found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id} className="border-border/50 hover:bg-muted/20 transition-colors">
                      <TableCell className="font-mono font-medium text-primary">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(order.orderDate), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-foreground">{order.shippingAddress?.fullName || 'N/A'}</div>
                        <div className="text-xs text-muted-foreground">{order.shippingAddress?.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`font-bold ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${order.paymentStatus === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {order.paymentStatus}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-bold text-foreground">
                        ₹{order.totalAmount?.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Link to={`/admin/orders/${order.id}`}>
                          <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                            Manage <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {pagination.totalPages > 1 && (
            <div className="p-4 border-t border-border/50 flex justify-center gap-2 bg-muted/10">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={pagination.page <= 1}
                onClick={() => fetchOrders(pagination.page - 1)}
              >
                Previous
              </Button>
              <div className="flex items-center text-sm font-medium px-4">
                Page {pagination.page} of {pagination.totalPages}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchOrders(pagination.page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminOrdersDashboard;
