
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Trash2, ShoppingCart, Eye, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import { useCart } from '@/hooks/useCart.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const SavedDesigns = () => {
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDesigns = async () => {
      if (!currentUser) return;
      
      try {
        const records = await pb.collection('generatedDesigns').getFullList({
          filter: `userId = "${currentUser.id}"`,
          sort: '-created',
          $autoCancel: false
        });
        setDesigns(records);
      } catch (error) {
        console.error('Error fetching designs:', error);
        toast.error('Failed to load saved designs');
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, [currentUser]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this design?')) return;

    try {
      await pb.collection('generatedDesigns').delete(id, { $autoCancel: false });
      setDesigns(prev => prev.filter(d => d.id !== id));
      toast.success('Design deleted successfully');
    } catch (error) {
      toast.error('Failed to delete design');
    }
  };

  const handleReorder = async (design) => {
    const customProduct = {
      id: `custom-${design.id}`,
      title: `Custom AI ${design.productType}`,
      image: design.designImage,
      price: design.price || 1499,
      isCustom: true,
      description: `Custom design: ${design.prompt?.substring(0, 50)}...`
    };

    const customVariant = {
      id: `var-${design.id}`,
      title: `Custom / Standard`,
      price_in_cents: (design.price || 1499) * 100,
      price_formatted: `₹${design.price || 1499}`,
      inventory_quantity: 999,
      manage_inventory: false,
      currency_info: { symbol: '₹', code: 'INR' }
    };

    try {
      await addToCart(customProduct, customVariant, 1, 999);
      toast.success('Design added to cart!');
      navigate('/cart');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>My Saved Designs - TioraS Fashions Studio</title>
      </Helmet>
      
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            My Saved Designs
          </h1>
          <p className="text-muted-foreground">Manage and reorder your custom AI-generated creations.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
            ))}
          </div>
        ) : designs.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-3xl border border-border/50">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>No saved designs yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              You haven't saved any custom designs. Head over to the AI Design Studio to create your first masterpiece!
            </p>
            <Button onClick={() => navigate('/design-generator')} className="gradient-primary text-white rounded-full px-8 h-12">
              Go to Design Studio
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {designs.map((design, index) => (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="premium-card bg-card border border-border/50 overflow-hidden flex flex-col"
              >
                <div className="relative aspect-square bg-muted p-4 flex items-center justify-center">
                  <img 
                    src={design.designImage} 
                    alt="Saved design" 
                    className="max-w-full max-h-full object-contain drop-shadow-md"
                  />
                  <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                    {design.productType}
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-1 pr-4">
                      {design.prompt || 'Custom AI Design'}
                    </p>
                    <p className="font-bold text-primary whitespace-nowrap">
                      ₹{design.price || 1499}
                    </p>
                  </div>
                  
                  <div className="mt-auto pt-4 flex gap-2">
                    <Button 
                      className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl"
                      onClick={() => handleReorder(design)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" /> Order
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="rounded-xl border-border/80 hover:bg-muted"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="rounded-xl border-border/80 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                      onClick={() => handleDelete(design.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SavedDesigns;
