
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Search, Star } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const categories = [
  'T-shirts',
  'Hoodies',
  'Shirts',
  'Caps',
  'Bags',
  'Saree Blouse Embroidery',
  'School/Company Uniforms',
  'Mugs/Keychains/Gifts/Stickers',
  'Blank Materials'
];

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategories, sortBy, page, searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let filter = '';
      
      if (selectedCategories.length > 0) {
        const categoryFilters = selectedCategories.map(cat => `category = "${cat}"`).join(' || ');
        filter = `(${categoryFilters})`;
      }

      if (searchQuery) {
        const searchFilter = `(name ~ "${searchQuery}" || description ~ "${searchQuery}")`;
        filter = filter ? `${filter} && ${searchFilter}` : searchFilter;
      }

      let sort = '-created';
      if (sortBy === 'price-low') sort = '+price';
      if (sortBy === 'price-high') sort = '-price';
      if (sortBy === 'rating') sort = '-rating';

      const result = await pb.collection('products').getList(page, 12, {
        filter: filter || undefined,
        sort,
        $autoCancel: false
      });

      setProducts(result.items);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    setPage(1);
  };

  return (
    <>
      <Helmet>
        <title>Products - EmbroideryHub</title>
        <meta name="description" content="Browse our collection of customizable products including t-shirts, hoodies, caps, and more." />
      </Helmet>
      
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Our Products
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Discover premium quality products ready for customization
          </p>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Categories</h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <Label htmlFor={category} className="text-sm cursor-pointer">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i}>
                      <Skeleton className="h-64 w-full" />
                      <CardContent className="p-4 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No products found</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSelectedCategories([]);
                      setSearchQuery('');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card className="premium-card h-full flex flex-col">
                          <div className="aspect-square overflow-hidden rounded-t-xl">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={pb.files.getUrl(product, product.images[0], { thumb: '300x300' })}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <span className="text-muted-foreground">No image</span>
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4 flex-1">
                            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                            <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                              {product.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-primary">
                                ${product.price.toFixed(2)}
                              </span>
                              {product.rating > 0 && (
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 fill-secondary text-secondary" />
                                  <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter className="p-4 pt-0">
                            <Link to={`/products/${product.id}`} className="w-full">
                              <Button className="w-full">View Details</Button>
                            </Link>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mt-8">
                      <Button
                        variant="outline"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </>
  );
};

export default ProductCatalog;
