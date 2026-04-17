
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingBag, Users, Package, ArrowUpRight, ArrowDownRight, MessageSquare, Star } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import pb from '@/lib/pocketbaseClient';
import AdminLayout from '@/components/AdminLayout.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const mockChartData = [
  { name: 'Mon', revenue: 4000, orders: 24 },
  { name: 'Tue', revenue: 3000, orders: 18 },
  { name: 'Wed', revenue: 5000, orders: 32 },
  { name: 'Thu', revenue: 2780, orders: 15 },
  { name: 'Fri', revenue: 6890, orders: 45 },
  { name: 'Sat', revenue: 8390, orders: 55 },
  { name: 'Sun', revenue: 7490, orders: 48 },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, customers: 0, products: 0, reviews: 0, pendingReviews: 0, avgRating: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [orders, users, products, reviews] = await Promise.all([
          pb.collection('orders').getList(1, 1, { $autoCancel: false }),
          pb.collection('users').getList(1, 1, { filter: 'role="user"', $autoCancel: false }),
          pb.collection('products').getList(1, 1, { $autoCancel: false }),
          pb.collection('reviews').getFullList({ $autoCancel: false })
        ]);
        
        let pending = 0;
        let ratingSum = 0;
        reviews.forEach(r => {
          if (r.status === 'pending') pending++;
          ratingSum += r.rating;
        });

        setStats({
          revenue: 124500, // Mocked total for demo
          orders: orders.totalItems,
          customers: users.totalItems,
          products: products.totalItems,
          reviews: reviews.length,
          pendingReviews: pending,
          avgRating: reviews.length > 0 ? (ratingSum / reviews.length) : 0
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  const MetricCard = ({ title, value, icon: Icon, trend, isPositive }) => (
    <Card className="admin-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Icon className="w-6 h-6" />
          </div>
          <div className={`flex items-center gap-1 text-xs font-bold ${isPositive ? 'text-emerald-600' : 'text-destructive'}`}>
            {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {trend}
          </div>
        </div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-foreground">{value}</h3>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout>
      <Helmet>
        <title>Dashboard | Admin</title>
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground">Welcome back. Here's what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Total Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon={DollarSign} trend="+12.5%" isPositive={true} />
        <MetricCard title="Total Orders" value={stats.orders} icon={ShoppingBag} trend="+8.2%" isPositive={true} />
        <MetricCard title="Total Customers" value={stats.customers} icon={Users} trend="+2.4%" isPositive={true} />
        <MetricCard title="Active Products" value={stats.products} icon={Package} trend="-1.2%" isPositive={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="admin-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--primary))' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Overview Card */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="text-lg flex justify-between items-center">
              Reviews 
              <Link to="/admin/analytics/reviews" className="text-xs text-primary font-medium hover:underline">View Analytics</Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500"><MessageSquare className="w-6 h-6" /></div>
                <div>
                  <h4 className="text-2xl font-bold">{stats.pendingReviews}</h4>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Pending Reviews</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[hsl(var(--review-gold))]/10 flex items-center justify-center text-[hsl(var(--review-gold))]"><Star className="w-6 h-6" /></div>
                <div>
                  <h4 className="text-2xl font-bold">{stats.avgRating.toFixed(1)} / 5.0</h4>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Avg Rating ({stats.reviews} total)</p>
                </div>
              </div>
              <Link to="/admin/reviews">
                <Button className="w-full rounded-xl">Moderate Reviews</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
