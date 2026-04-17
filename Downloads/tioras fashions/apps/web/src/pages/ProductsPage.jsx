
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, Grid, List as ListIcon, ChevronDown, Star, ShoppingCart, Heart, X } from 'lucide-react';
import { getProducts } from '@/api/EcommerceApi';
import { useCart } from '@/hooks/useCart.jsx';
import { useWishlist } from '@/contexts/WishlistContext.jsx';
import { toast } from 'sonner';

import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";

const placeholderImage = "https://images.unsplash.com/photo-1552169113-e367653a9d5b?auto=format&fit=crop&q=80&w=800";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    const saved = localStorage.getItem('productsPerPage');
    return saved ? parseInt(saved) : 24;
  });
  
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getProducts({ limit: itemsPerPage.toString() });
        setProducts(response.products || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [itemsPerPage]);

  const handleItemsPerPageChange = (value) => {
    const newValue = parseInt(value);
    setItemsPerPage(newValue);
    localStorage.setItem('productsPerPage', newValue.toString());
  };

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.variants?.length) return;
    try {
      await addToCart(product, product.variants[0], 1, product.variants[0].inventory_quantity);
      toast.success('Added to Cart');
    } catch (error) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  const handleWishlist = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(productId);
  };

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return Array.from(cats);
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    result.sort((a, b) => {
      const priceA = a.variants?.[0]?.sale_price_in_cents || a.variants?.[0]?.price_in_cents || 0;
      const priceB = b.variants?.[0]?.sale_price_in_cents || b.variants?.[0]?.price_in_cents || 0;
      
      switch (sortBy) {
        case 'price-asc': return priceA - priceB;
        case 'price-desc': return priceB - priceA;
        case 'rating': return (b.rating || 0) - (a.rating || 0);
        case 'newest':
        default:
          return new Date(b.created || 0) - new Date(a.created || 0);
      }
    });

    return result;
  }, [products, selectedCategories, sortBy]);

  const toggleCategory = (cat) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSortBy('newest');
    toast.success('All filters cleared');
  };

  const hasActiveFilters = selectedCategories.length > 0;

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-destructive hover:text-destructive/80 h-auto p-0"
          >
            Clear All
          </Button>
        )}
      </div>

      <div>
        <h3 className="font-bold text-base mb-4 text-foreground">Categories</h3>
        <div className="space-y-3">
          {categories.map(cat => (
            <div key={cat} className="flex items-center space-x-2">
              <Checkbox 
                id={`cat-${cat}`} 
                checked={selectedCategories.includes(cat)}
                onCheckedChange={() => toggleCategory(cat)}
                className="border-primary data-[state=checked]:bg-primary"
              />
              <label htmlFor={`cat-${cat}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                {cat}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>All Products | TioraS Fashions Studio</title>
      </Helmet>
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
            Our Collection
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Discover our premium range of customizable apparel, from classic t-shirts to elegant embroidered jackets.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-card p-4 rounded-2xl border border-border/50 shadow-sm">
          <div className="flex items-center gap-4 flex-wrap">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden rounded-xl border-primary/20">
                  <Filter className="w-4 h-4 mr-2" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader className="mb-6">
                  <SheetTitle style={{ fontFamily: 'Playfair Display, serif' }}>Filters</SheetTitle>
                </SheetHeader>
                <FilterSidebar />
              </SheetContent>
            </Sheet>

            {hasActiveFilters && (
              <Button
                onClick={clearAllFilters}
                className="bg-[#1a1a2e] text-white hover:bg-[#1a1a2e]/90 h-11 rounded-xl hidden lg:flex"
              >
                <X className="w-4 h-4 mr-2" />
                Clear All Filters
              </Button>
            )}

            <span className="text-sm font-medium text-muted-foreground">
              Showing {filteredAndSortedProducts.length} products
            </span>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-auto flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground whitespace-nowrap">Items per page:</span>
              <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger className="w-[80px] h-10 rounded-xl border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="48">48</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                <Button variant="outline" className="rounded-xl border-border/50 bg-background min-w-[140px] justify-between">
                  <span className="flex items-center"><SlidersHorizontal className="w-4 h-4 mr-2" /> Sort</span>
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] rounded-xl">
                <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                  <DropdownMenuRadioItem value="newest" className="cursor-pointer">Newest Arrivals</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="price-asc" className="cursor-pointer">Price: Low to High</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="price-desc" className="cursor-pointer">Price: High to Low</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="rating" className="cursor-pointer">Highest Rated</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-card p-6 rounded-3xl border border-border/50 shadow-sm">
              <FilterSidebar />
            </div>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Skeleton key={i} className={`rounded-2xl ${viewMode === 'grid' ? 'h-[400px]' : 'h-[200px]'}`} />
                ))}
              </div>
            ) : filteredAndSortedProducts.length === 0 ? (
              <div className="bg-card border border-border/50 rounded-3xl p-16 text-center">
                <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
                <Button variant="outline" onClick={clearAllFilters} className="mt-6 rounded-full">Clear Filters</Button>
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredAndSortedProducts.map((product, idx) => {
                  const variant = product.variants?.[0];
                  const price = variant?.sale_price_formatted || variant?.price_formatted;
                  const originalPrice = variant?.sale_price_in_cents ? variant?.price_formatted : null;
                  const isWishlisted = isInWishlist(product.id);

                  if (viewMode === 'list') {
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                        key={product.id} 
                        className="bg-card border border-border/50 rounded-2xl p-4 flex gap-6 hover:border-primary/40 transition-colors group shadow-sm"
                      >
                        <Link to={`/product/${product.id}`} className="w-48 shrink-0 relative rounded-xl overflow-hidden bg-muted aspect-[4/5] sm:aspect-square">
                          <img src={product.image || placeholderImage} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          {product.discountPercentage && (
                            <Badge className="absolute top-2 left-2 bg-destructive text-white border-none">-{product.discountPercentage}%</Badge>
                          )}
                        </Link>
                        <div className="flex flex-col flex-1 py-2">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{product.category}</p>
                              <Link to={`/product/${product.id}`}>
                                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors" style={{ fontFamily: 'Playfair Display, serif' }}>{product.title}</h3>
                              </Link>
                            </div>
                            <button onClick={(e) => handleWishlist(e, product.id)} className="p-2 rounded-full hover:bg-muted transition-colors">
                              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground'}`} />
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center text-amber-500">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="ml-1 text-sm font-bold text-foreground">{product.rating || '4.5'}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">({product.reviewCount || 12} reviews)</span>
                          </div>

                          <p className="text-muted-foreground text-sm line-clamp-2 mb-4 max-w-2xl">{product.description || 'Premium customized apparel designed for comfort and style.'}</p>

                          <div className="mt-auto flex items-end justify-between">
                            <div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-primary">{price}</span>
                                {originalPrice && <span className="text-sm text-muted-foreground line-through">{originalPrice}</span>}
                              </div>
                            </div>
                            <Button onClick={(e) => handleAddToCart(e, product)} className="gradient-primary text-white rounded-xl shadow-md">
                              <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}
                      key={product.id} 
                      className="bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col"
                    >
                      <Link to={`/product/${product.id}`} className="relative aspect-[4/5] bg-muted overflow-hidden block">
                        <img src={product.image || placeholderImage} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                        
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
                        {product.stockStatus === 'Out of Stock' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                            <span className="bg-background text-foreground font-bold px-4 py-2 rounded-full shadow-lg uppercase tracking-wider text-sm">Out of Stock</span>
                          </div>
                        )}
                      </Link>
                      
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{product.category}</p>
                          <div className="flex items-center text-amber-500 text-xs font-bold">
                            <Star className="w-3 h-3 fill-current mr-1" /> {product.rating || '4.5'}
                          </div>
                        </div>
                        <Link to={`/product/${product.id}`}>
                          <h3 className="text-lg font-bold text-foreground line-clamp-1 mb-2 group-hover:text-primary transition-colors" style={{ fontFamily: 'Playfair Display, serif' }}>{product.title}</h3>
                        </Link>
                        
                        <div className="mt-auto pt-4 flex items-center justify-between">
                          <div className="flex flex-col">
                            {originalPrice && <span className="text-xs text-muted-foreground line-through">{originalPrice}</span>}
                            <span className="text-lg font-bold text-primary">{price}</span>
                          </div>
                          <Button 
                            size="icon"
                            onClick={(e) => handleAddToCart(e, product)} 
                            disabled={product.stockStatus === 'Out of Stock'}
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
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
