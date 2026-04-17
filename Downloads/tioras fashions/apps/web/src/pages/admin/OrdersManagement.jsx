
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Filter, MoreHorizontal, Eye } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import AdminLayout from '@/components/AdminLayout.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const records = await pb.collection('orders').getFullList({ sort: '-created', expand: 'userId', $autoCancel: false });
        setOrders(records);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <AdminLayout>
      <Helmet>
        <title>Orders | Admin</title>
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>Orders</h1>
        <p className="text-muted-foreground mt-1">Manage and fulfill customer orders.</p>
      </div>

      <div className="admin-card p-4 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search orders by ID or customer..." className="pl-9" />
        </div>
        <Button variant="outline" className="shrink-0">
          <Filter className="w-4 h-4 mr-2" /> Filters
        </Button>
      </div>

      <div className="admin-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8">Loading orders...</TableCell></TableRow>
            ) : orders.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8">No orders found.</TableCell></TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{format(new Date(order.created), 'MMM d, yyyy')}</TableCell>
                  <TableCell>{order.expand?.userId?.name || order.expand?.userId?.email || 'Guest'}</TableCell>
                  <TableCell>₹{order.totalAmount}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={order.paymentStatus === 'Confirmed' ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : ''}>
                      {order.paymentStatus || 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                      {order.orderStatus || 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm"><Eye className="w-4 h-4 mr-2" /> View</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default OrdersManagement;
