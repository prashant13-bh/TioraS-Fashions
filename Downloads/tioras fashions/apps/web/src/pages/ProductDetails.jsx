
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Palette } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useCart } from '@/contexts/CartContext.jsx';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const productData = await pb.collection('products').getOne(id, { $autoCancel: false });
      setProduct(productData);

      if (productData.category) {
        const related = await pb.collection('products').getList(1, 6, {
          filter: `category = "${productData.category}" && id != "${id}"`,
          $autoCancel: false
        });
        setRelatedProducts(related.items);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1);
      toast.success('Added to cart');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-[500px] w-full" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Product not found</h1>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${product.name} - EmbroideryHub`}</title>
        <meta name="description" content={product.description || `Shop ${product.name} at EmbroideryHub`} />
      </Helmet>
      
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <div className="aspect-square rounded-2xl overflow-hidden cursor-pointer mb-4">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={pb.files.getUrl(product, product.images[selectedImage])}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">No image available</span>
                      </div>
                    )}
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  {product.images && product.images.length > 0 && (
                    <img
                      src={pb.files.getUrl(product, product.images[selectedImage])}
                      alt={product.name}
                      className="w-full h-auto"
                    />
                  )}
                </DialogContent>
              </Dialog>

              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={pb.files.getUrl(product, image, { thumb: '100x100' })}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {product.name}
                </h1>
                {product.category && (
                  <p className="text-sm text-muted-foreground mb-4">{product.category}</p>
                )}
                {product.rating > 0 && (
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating)
                              ? 'fill-secondary text-secondary'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <div className="text-4xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </div>

              {product.description && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Stock: <span className="font-medium text-foreground">{product.stock} available</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 gradient-primary text-white"
                  disabled={product.stock <= 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Link to={`/customize?productId=${product.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Palette className="h-5 w-5 mr-2" />
                    Customize This Product
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="mt-20">
              <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
                Related Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link key={relatedProduct.id} to={`/products/${relatedProduct.id}`}>
                    <Card className="premium-card h-full">
                      <div className="aspect-square overflow-hidden rounded-t-xl">
                        {relatedProduct.images && relatedProduct.images.length > 0 ? (
                          <img
                            src={pb.files.getUrl(relatedProduct, relatedProduct.images[0], { thumb: '300x300' })}
                            alt={relatedProduct.name}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-muted-foreground">No image</span>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{relatedProduct.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-primary">
                            ${relatedProduct.price.toFixed(2)}
                          </span>
                          {relatedProduct.rating > 0 && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-secondary text-secondary" />
                              <span className="text-sm font-medium">{relatedProduct.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetails;
