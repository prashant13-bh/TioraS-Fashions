
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, ShoppingCart, Heart, Star, ChevronRight } from 'lucide-react';
import { getProducts } from '@/api/EcommerceApi';
import { useCart } from '@/hooks/useCart.jsx';
import { useWishlist } from '@/contexts/WishlistContext.jsx';
import { toast } from 'sonner';

import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { CategoryBanner } from '@/components/LegalBanners.jsx';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const placeholderImage = "https://images.unsplash.com/photo-1605760719369-be714c32a7f6?auto=format&fit=crop&q=80&w=800";

const ProductCategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const normalizedCategory = useMemo(() => {
    if (!categoryName) return '';
    return categoryName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }, [categoryName]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getProducts();
        const filtered = (response.products || []).filter(p => 
          p.category && p.category.toLowerCase().includes(categoryName.replace('-', ' ').toLowerCase())
        );
        setProducts(filtered);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Failed to load category products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryName]);

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
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
    await toggleWishlist(productId);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>{normalizedCategory} | TioraS Fashions</title>
      </Helmet>
      <Header />

      <div className="bg-primary/5 border-b border-border/50 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center text-sm font-medium text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
            <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
            <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
            <span className="text-foreground">{normalizedCategory}</span>
          </nav>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            {normalizedCategory}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore our exclusive collection of {normalizedCategory.toLowerCase()} designed for perfect fit and premium quality.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <CategoryBanner />

        <div className="flex justify-between items-center mb-8">
          <p className="text-sm font-medium text-muted-foreground">
            Showing {products.length} products
          </p>
          <Button variant="outline" className="rounded-xl border-border/60 bg-background text-foreground">
            <SlidersHorizontal className="w-4 h-4 mr-2" /> Sort By
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-[400px] rounded-2xl" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-card border border-border/50 rounded-3xl p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>No {normalizedCategory} found</h3>
            <p className="text-muted-foreground mb-8">We couldn't find any products in this category right now.</p>
            <Link to="/products">
              <Button className="rounded-full px-8">Browse All Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {products.map((product, idx) => {
              const variant = product.variants?.[0];
              const price = variant?.sale_price_formatted || variant?.price_formatted;
              const isWishlisted = isInWishlist(product.id);

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                  key={product.id} 
                  className="bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col"
                >
                  <Link to={`/product/${product.id}`} className="relative aspect-[4/5] bg-muted block overflow-hidden">
                    <img src={product.image || placeholderImage} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    
                    <button 
                      onClick={(e) => handleWishlist(e, product.id)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-md transition-transform hover:scale-110 z-10"
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground hover:text-rose-500'}`} />
                    </button>
                    
                    {product.discountPercentage && (
                      <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground border-none shadow-md px-3 font-bold">
                        -{product.discountPercentage}%
                      </Badge>
                    )}
                  </Link>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center text-amber-500 text-xs font-bold bg-amber-500/10 px-2 py-1 rounded-full">
                        <Star className="w-3 h-3 fill-current mr-1" /> {product.rating || '4.8'}
                      </div>
                    </div>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-lg font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors" style={{ fontFamily: 'Playfair Display, serif' }}>{product.title}</h3>
                    </Link>
                    
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">{price}</span>
                      <Button 
                        size="sm"
                        onClick={(e) => handleAddToCart(e, product)} 
                        className="rounded-xl gradient-primary text-white shadow-md font-semibold"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" /> Add
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductCategoryPage;
