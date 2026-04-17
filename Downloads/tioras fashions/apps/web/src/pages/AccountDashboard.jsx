
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Package, Heart, Paintbrush, MapPin, ArrowRight, Award, Clock } from 'lucide-react';
import { format } from 'date-fns';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useWishlist } from '@/contexts/WishlistContext.jsx';

import AccountLayout from '@/components/AccountLayout.jsx';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const AccountDashboard = () => {
  const { currentUser } = useAuth();
  const { wishlistCount } = useWishlist();
  
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) return;
      
      try {
        // Fetch Orders for stats and recent list
        const orders = await pb.collection('orders').getFullList({
          filter: `userId = "${currentUser.id}"`,
          sort: '-created',
          $autoCancel: false
        });

        const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        
        setStats({
          totalOrders: orders.length,
          totalSpent: totalSpent
        });
        
        setRecentOrders(orders.slice(0, 3)); // Get top 3
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  const quickLinks = [
    { name: 'My Orders', icon: Package, path: '/account/orders', desc: 'Track & manage orders', bg: 'bg-blue-500/10', color: 'text-blue-600' },
    { name: 'Wishlist', icon: Heart, path: '/account/wishlist', desc: `${wishlistCount} saved items`, bg: 'bg-rose-500/10', color: 'text-rose-600' },
    { name: 'Saved Designs', icon: Paintbrush, path: '/account/saved-designs', desc: 'Your custom creations', bg: 'bg-purple-500/10', color: 'text-purple-600' },
    { name: 'Addresses', icon: MapPin, path: '/account/addresses', desc: 'Manage delivery info', bg: 'bg-emerald-500/10', color: 'text-emerald-600' },
  ];

  return (
    <AccountLayout title="Dashboard">
      <Helmet>
        <title>My Account - TioraS Fashions</title>
      </Helmet>

      {/* Welcome Hero */}
      <div className="bg-primary relative overflow-hidden rounded-3xl p-8 mb-8 text-primary-foreground shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Welcome back, {currentUser?.name?.split(' ')[0] || 'there'}!
            </h2>
            <p className="text-primary-foreground/80 text-lg">Manage your premium fashion experience.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20">
              <Award className="w-6 h-6 mx-auto mb-1 text-secondary" />
              <p className="text-sm font-medium opacity-80">Loyalty Tier</p>
              <p className="text-xl font-bold text-secondary">Gold</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-1">Total Orders</p>
          {loading ? <Skeleton className="h-8 w-16" /> : <p className="text-3xl font-bold text-foreground">{stats.totalOrders}</p>}
        </div>
        <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-1">Total Spent</p>
          {loading ? <Skeleton className="h-8 w-24" /> : <p className="text-3xl font-bold text-primary">₹{stats.totalSpent.toFixed(0)}</p>}
        </div>
        <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-1">Member Since</p>
          <p className="text-lg font-bold text-foreground mt-1.5">{currentUser?.created ? format(new Date(currentUser.created), 'MMM yyyy') : 'Recently'}</p>
        </div>
        <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-1">Points</p>
          <p className="text-3xl font-bold text-secondary">{Math.floor(stats.totalSpent * 0.05)}</p>
        </div>
      </div>

      {/* Quick Links Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {quickLinks.map((link) => (
          <Link key={link.name} to={link.path} className="group">
            <div className="bg-card border border-border/50 hover:border-primary/30 rounded-2xl p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-1 h-full">
              <div className={`w-12 h-12 rounded-xl ${link.bg} ${link.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                <link.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-foreground mb-1">{link.name}</h3>
              <p className="text-sm text-muted-foreground">{link.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>Recent Orders</h3>
          <Link to="/account/orders" className="text-sm font-bold text-primary hover:underline flex items-center">
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-8 bg-muted/20 rounded-xl border border-border/50 border-dashed">
            <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-30" />
            <p className="text-muted-foreground">You haven't placed any orders yet.</p>
            <Link to="/products"><Button variant="link" className="text-primary mt-2">Start shopping</Button></Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map(order => (
              <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border border-border/50 hover:bg-muted/10 transition-colors gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {format(new Date(order.orderDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-left sm:text-right">
                    <p className="font-bold text-foreground">₹{order.totalAmount?.toFixed(2)}</p>
                    <p className={`text-xs font-bold ${order.orderStatus === 'Delivered' ? 'text-emerald-600' : 'text-primary'}`}>
                      {order.orderStatus}
                    </p>
                  </div>
                  <Link to={`/orders/${order.id}`}>
                    <Button variant="outline" size="sm" className="rounded-full">Track</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </AccountLayout>
  );
};

export default AccountDashboard;
