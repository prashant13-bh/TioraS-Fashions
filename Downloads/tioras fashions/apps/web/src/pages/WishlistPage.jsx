
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Search, SlidersHorizontal, Grid, List as ListIcon, Share2, Copy, Check, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useWishlist } from '@/contexts/WishlistContext.jsx';
import { useCart } from '@/hooks/useCart.jsx';
import { getProduct } from '@/api/EcommerceApi';

import AccountLayout from '@/components/AccountLayout.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const placeholderImage = "https://images.unsplash.com/photo-1552169113-e367653a9d5b?auto=format&fit=crop&q=80&w=800";

const WishlistPage = () => {
  const { wishlistItems, toggleWishlist, loading: wishlistLoading } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (wishlistItems.length === 0) {
        setProducts([]);
        setLoadingProducts(false);
        return;
      }

      setLoadingProducts(true);
      try {
        const productPromises = wishlistItems.map(item => 
          getProduct(item.productId).then(product => ({
            ...product,
            wishlistRecordId: item.id,
            dateAdded: item.created
          })).catch(err => {
            console.error(`Failed to fetch product ${item.productId}`, err);
            return null;
          })
        );
        
        const results = await Promise.all(productPromises);
        setProducts(results.filter(p => p !== null));
      } catch (error) {
        console.error('Failed to load wishlist products', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    if (!wishlistLoading) {
      fetchProductDetails();
    }
  }, [wishlistItems, wishlistLoading]);

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    if (!product || !product.variants || product.variants.length === 0) return;
    const defaultVariant = product.variants[0];
    try {
      await addToCart(product, defaultVariant, 1, defaultVariant.inventory_quantity);
      toast.success('Added to Cart');
    } catch (error) {
      toast.error('Failed to add to cart', { description: error.message });
    }
  };

  const handleRemove = async (e, productId) => {
    e.preventDefault();
    await toggleWishlist(productId);
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleShareCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/wishlist/shared/12345`);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'price-asc') {
      const priceA = a.variants[0]?.sale_price_in_cents || a.variants[0]?.price_in_cents || 0;
      const priceB = b.variants[0]?.sale_price_in_cents || b.variants[0]?.price_in_cents || 0;
      return priceA - priceB;
    }
    if (sortBy === 'price-desc') {
      const priceA = a.variants[0]?.sale_price_in_cents || a.variants[0]?.price_in_cents || 0;
      const priceB = b.variants[0]?.sale_price_in_cents || b.variants[0]?.price_in_cents || 0;
      return priceB - priceA;
    }
    return new Date(b.dateAdded) - new Date(a.dateAdded);
  });

  const isLoading = wishlistLoading || loadingProducts;

  return (
    <AccountLayout title="My Wishlist">
      <Helmet>
        <title>My Wishlist | TioraS Fashions</title>
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            My Wishlist <Badge className="bg-primary/10 text-primary hover:bg-primary/20 font-bold border-none text-base">{products.length}</Badge>
          </h2>
          <p className="text-muted-foreground mt-1">Keep track of items you love.</p>
        </div>
        {products.length > 0 && (
          <Button variant="outline" onClick={() => setIsShareModalOpen(true)} className="rounded-full shadow-sm border-primary/20 hover:bg-primary/5 text-primary">
            <Share2 className="w-4 h-4 mr-2" /> Share List
          </Button>
        )}
      </div>

      <div className="mb-8 flex items-center gap-2 bg-muted/30 p-3 rounded-lg border border-border/50 text-sm text-muted-foreground">
        <Info className="w-4 h-4 shrink-0 text-primary" />
        <p>Products added to cart are subject to our <Link to="/return-policy" className="text-primary hover:underline font-medium">30-day return policy</Link>.</p>
      </div>

      {products.length > 0 && (
        <div className="bg-card border border-border/50 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 shadow-sm">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search wishlist..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background border-border/60 rounded-xl text-foreground"
            />
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
             <div className="hidden sm:flex items-center bg-muted/50 p-1 rounded-xl border border-border/50">
              <Button variant="ghost" size="icon" onClick={() => setViewMode('grid')} className={`h-8 w-8 rounded-lg ${viewMode === 'grid' ? 'bg-background shadow-sm' : ''}`}>
                <Grid className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setViewMode('list')} className={`h-8 w-8 rounded-lg ${viewMode === 'list' ? 'bg-background shadow-sm' : ''}`}>
                <ListIcon className="w-4 h-4" />
              </Button>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-xl border-border/60 bg-background w-full sm:w-auto justify-between min-w-[140px]">
                  <span className="flex items-center"><SlidersHorizontal className="w-4 h-4 mr-2" /> Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl w-[200px]">
                <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                  <DropdownMenuRadioItem value="date" className="cursor-pointer">Recently Added</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="price-asc" className="cursor-pointer">Price: Low to High</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="price-desc" className="cursor-pointer">Price: High to Low</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {[1, 2, 3].map(i => (
             <div key={i} className="flex flex-col space-y-4 border border-border/50 rounded-2xl p-4 bg-card">
              <Skeleton className="h-[250px] w-full rounded-xl" />
              <Skeleton className="h-6 w-3/4 rounded" />
              <Skeleton className="h-4 w-1/4 rounded" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-card border border-border/50 rounded-3xl p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-rose-500 fill-rose-500/20" />
          </div>
          <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">Discover our premium collections and save your favorite items here for later.</p>
          <Link to="/products">
            <Button className="gradient-primary text-white rounded-full px-8 h-12 shadow-md font-bold">Explore Collection</Button>
          </Link>
        </div>
      ) : (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          <AnimatePresence>
            {filteredProducts.map((product) => {
              const variant = product.variants[0];
              const price = variant?.sale_price_formatted ?? variant?.price_formatted;
              const originalPrice = variant?.sale_price_in_cents ? variant?.price_formatted : null;
              
              if (viewMode === 'list') {
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    key={product.id}
                    className="bg-card border border-border/50 hover:border-primary/40 rounded-2xl p-4 flex gap-6 transition-colors shadow-sm group"
                  >
                    <Link to={`/product/${product.id}`} className="w-40 shrink-0 relative rounded-xl overflow-hidden bg-muted aspect-square block">
                      <img src={product.image || placeholderImage} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {product.discountPercentage && (
                        <Badge className="absolute top-2 left-2 bg-destructive text-white border-none shadow-md">-{product.discountPercentage}%</Badge>
                      )}
                    </Link>
                    <div className="flex flex-col flex-1 justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{product.category}</p>
                          <button onClick={(e) => handleRemove(e, product.id)} className="p-2 -mr-2 rounded-full hover:bg-rose-50 text-muted-foreground hover:text-rose-500 transition-colors" title="Remove">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <Link to={`/product/${product.id}`}>
                          <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors" style={{ fontFamily: 'Playfair Display, serif' }}>{product.title}</h3>
                        </Link>
                      </div>
                      
                      <div className="flex items-end justify-between mt-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-primary">{price}</span>
                          {originalPrice && <span className="text-sm text-muted-foreground line-through">{originalPrice}</span>}
                        </div>
                        <Button onClick={(e) => handleAddToCart(e, product)} className="gradient-primary text-white rounded-xl shadow-md font-semibold">
                          <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }}
                  key={product.id}
                  className="bg-card border border-border/50 hover:border-primary/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col"
                >
                  <Link to={`/product/${product.id}`} className="relative aspect-[4/5] overflow-hidden bg-muted block">
                    <img src={product.image || placeholderImage} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                    
                    <button 
                      onClick={(e) => handleRemove(e, product.id)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center text-rose-500 shadow-md transition-transform hover:scale-110 hover:bg-rose-50 z-10"
                      title="Remove from wishlist"
                    >
                      <Heart className="w-5 h-5 fill-current" />
                    </button>

                    {product.discountPercentage && (
                      <Badge className="absolute top-3 left-3 bg-destructive text-white border-none shadow-md">
                        -{product.discountPercentage}%
                      </Badge>
                    )}
                  </Link>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{product.category}</p>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-bold text-foreground text-lg mb-3 truncate group-hover:text-primary transition-colors" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {product.title}
                      </h3>
                    </Link>
                    
                    <div className="mt-auto flex items-center justify-between">
                       <div className="flex flex-col">
                        {originalPrice && <span className="text-xs text-muted-foreground line-through">{originalPrice}</span>}
                        <span className="text-lg font-bold text-primary">{price}</span>
                      </div>
                      <Button 
                        onClick={(e) => handleAddToCart(e, product)} 
                        size="icon"
                        className="rounded-full w-10 h-10 bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center" style={{ fontFamily: 'Playfair Display, serif' }}>Share Your Wishlist</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-6 pt-4">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Share2 className="w-10 h-10" />
            </div>
            <p className="text-center text-muted-foreground max-w-sm">
              Send this link to friends and family to show them what you're wishing for.
            </p>
            <div className="flex w-full items-center space-x-2">
              <Input 
                value={`${window.location.origin}/wishlist/shared/12345`} 
                readOnly 
                className="bg-muted/50 border-border/50 focus-visible:ring-0 text-foreground" 
              />
              <Button type="button" size="icon" onClick={handleShareCopy} className="shrink-0 rounded-xl">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <Button variant="outline" className="w-full rounded-xl border-border/60" onClick={() => setIsShareModalOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AccountLayout>
  );
};

export default WishlistPage;
