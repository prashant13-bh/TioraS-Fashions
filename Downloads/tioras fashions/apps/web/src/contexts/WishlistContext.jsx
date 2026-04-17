
import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const WishlistContext = createContext(null);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, currentUser } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated || !currentUser) {
        setWishlistItems([]);
        setLoading(false);
        return;
      }

      try {
        const records = await pb.collection('wishlist').getFullList({
          filter: `userId = "${currentUser.id}"`,
          $autoCancel: false,
        });
        setWishlistItems(records);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [isAuthenticated, currentUser]);

  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please log in to save to wishlist');
      return false;
    }

    const existingItem = wishlistItems.find(item => item.productId === productId);

    try {
      if (existingItem) {
        await pb.collection('wishlist').delete(existingItem.id, { $autoCancel: false });
        setWishlistItems(prev => prev.filter(item => item.id !== existingItem.id));
        toast.success('Removed from Wishlist');
        return false; // Not in wishlist anymore
      } else {
        const record = await pb.collection('wishlist').create({
          userId: currentUser.id,
          productId: productId
        }, { $autoCancel: false });
        setWishlistItems(prev => [...prev, record]);
        toast.success('Added to Wishlist');
        return true; // Is in wishlist
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error);
      toast.error('Failed to update wishlist');
      return !!existingItem; // Return previous state
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.productId === productId);
  };

  const value = {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    loading,
    toggleWishlist,
    isInWishlist
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
