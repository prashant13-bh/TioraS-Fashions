
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Edit3, Share2, Trash2, ShoppingCart, AlertCircle, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useCart } from '@/hooks/useCart.jsx';

import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ShareDesignModal from '@/components/ShareDesignModal.jsx';

const DesignHistory = () => {
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [activeShareId, setActiveShareId] = useState('');

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const records = await pb.collection('customDesigns').getFullList({
          filter: `userId = "${currentUser.id}"`,
          sort: '-updated',
          $autoCancel: false
        });
        setDesigns(records);
      } catch (error) {
        console.error('Error fetching designs:', error);
        toast.error('Failed to load design history');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) fetchDesigns();
  }, [currentUser]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this custom design?')) return;

    try {
      await pb.collection('customDesigns').delete(id, { $autoCancel: false });
      setDesigns(prev => prev.filter(d => d.id !== id));
      toast.success('Design deleted successfully');
    } catch (error) {
      toast.error('Failed to delete design');
    }
  };

  const handleOrder = async (design) => {
    const customProduct = {
      id: `custom-order-${design.id}`,
      title: `${design.productType} (Custom Design)`,
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkN1c3RvbTwvdGV4dD4KPC9zdmc+",
      price: design.price || 1499,
      isCustom: true
    };

    const customVariant = {
      id: `var-${design.id}`,
      title: `Size ${design.size || 'L'}`,
      price_in_cents: (design.price || 1499) * 100,
      price_formatted: `₹${design.price || 1499}`,
      inventory_quantity: 999,
      manage_inventory: false,
      currency_info: { symbol: '₹', code: 'INR' }
    };

    try {
      await addToCart(customProduct, customVariant, 1, 999);
      toast.success('Custom design added to cart!');
      navigate('/cart');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const openShare = (shareId) => {
    setActiveShareId(shareId);
    setShareModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Design History - TioraS Fashions</title>
      </Helmet>
      
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              My Custom Designs
            </h1>
            <p className="text-muted-foreground">Resume editing, share, or order your studio creations.</p>
          </div>
          <Link to="/customize">
            <Button className="gradient-primary text-white rounded-full px-6 shadow-md hover:shadow-lg transition-all">
              <Palette className="w-4 h-4 mr-2" /> New Studio Design
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-60 w-full rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                </div>
              </div>
            ))}
          </div>
        ) : designs.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-3xl border border-border/50">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>No studio designs yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              You haven't created any custom designs using the Design Studio yet.
            </p>
            <Link to="/customize">
              <Button size="lg" className="gradient-primary text-white rounded-full px-8">
                Open Design Studio
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {designs.map((design) => (
              <div
                key={design.id}
                className="premium-card bg-card border border-border/50 overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-muted/30 p-6 flex flex-col items-center justify-center border-b border-border/50">
                  <div className="w-full max-w-[150px] aspect-square rounded-full border-4 border-background shadow-inner flex items-center justify-center text-4xl" style={{ backgroundColor: design.productColor }}>
                    {design.productType === 'Hoodie' ? '🧥' : design.productType === 'Cap' ? '🧢' : '👕'}
                  </div>
                  <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                    {design.productType}
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-lg leading-tight truncate">Studio Creation</p>
                    <p className="font-bold text-primary whitespace-nowrap">₹{design.price || 1499}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Last updated: {format(new Date(design.updated), 'MMM d, yyyy')}
                  </p>
                  
                  <div className="mt-auto grid grid-cols-2 gap-2">
                    <Button 
                      className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl"
                      onClick={() => handleOrder(design)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" /> Order
                    </Button>
                    <Link to={`/customize/${design.id}`}>
                      <Button variant="outline" className="w-full rounded-xl border-border/80 hover:bg-muted">
                        <Edit3 className="mr-2 h-4 w-4" /> Edit
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button 
                      variant="ghost" 
                      className="w-full rounded-xl text-muted-foreground hover:text-foreground bg-muted/50"
                      onClick={() => openShare(design.shareId)}
                    >
                      <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full rounded-xl text-destructive hover:bg-destructive/10 bg-muted/50"
                      onClick={() => handleDelete(design.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
      
      <ShareDesignModal 
        shareId={activeShareId} 
        isOpen={shareModalOpen} 
        onOpenChange={setShareModalOpen} 
      />
    </div>
  );
};

export default DesignHistory;
