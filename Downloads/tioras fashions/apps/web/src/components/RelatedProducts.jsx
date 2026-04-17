
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart.jsx';
import { useWishlist } from '@/contexts/WishlistContext.jsx';
import { toast } from 'sonner';
import { getProducts } from '@/api/EcommerceApi';

const placeholderImage = "https://images.unsplash.com/photo-1552169113-e367653a9d5b?auto=format&fit=crop&q=80&w=800";

const RelatedProducts = ({ currentProductId, category }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts({ limit: '8' });
        
        // Filter by category and exclude current product
        const filtered = (response.products || [])
          .filter(p => p.id !== currentProductId)
          .slice(0, 6);
        
        setProducts(filtered);
      } catch (error) {
        console.error('Failed to fetch related products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentProductId) {
      fetchRelatedProducts();
    }
  }, [currentProductId, category]);

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.variants?.length) return;
    try {
      await addToCart(product, product.variants[0], 1, product.variants[0].inventory_quantity);
      toast.success('Added to Cart');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleWishlist = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(productId);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Related Products
          </h2>
          <p className="text-muted-foreground">You might also like</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-[400px] rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No related products found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          Related Products
        </h2>
        <p className="text-muted-foreground">You might also like</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, idx) => {
          const variant = product.variants?.[0];
          const price = variant?.sale_price_formatted || variant?.price_formatted;
          const originalPrice = variant?.sale_price_in_cents ? variant?.price_formatted : null;
          const isWishlisted = isInWishlist(product.id);

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col"
            >
              <Link to={`/product/${product.id}`} className="relative aspect-[4/5] bg-muted overflow-hidden block">
                <img 
                  src={product.image || placeholderImage} 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                <button
                  onClick={(e) => handleWishlist(e, product.id)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-md transition-transform hover:scale-110 z-10"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground'}`} />
                </button>

                {product.discountPercentage && (
                  <Badge className="absolute top-3 left-3 bg-destructive text-white border-none shadow-md">
                    -{product.discountPercentage}%
                  </Badge>
                )}
              </Link>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < Math.floor(product.rating || 4.5) ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">({(product.rating || 4.5).toFixed(1)})</span>
                </div>

                <Link to={`/product/${product.id}`}>
                  <h3 className="text-base font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                </Link>

                <div className="mt-auto pt-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    {originalPrice && <span className="text-xs text-muted-foreground line-through">{originalPrice}</span>}
                    <span className="text-lg font-bold text-primary">{price}</span>
                  </div>
                  <Button
                    size="icon"
                    onClick={(e) => handleAddToCart(e, product)}
                    className="rounded-full h-10 w-10 bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;
