
import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Heart, Share2, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { getProduct } from '@/api/EcommerceApi';
import { useCart } from '@/hooks/useCart.jsx';
import { useWishlist } from '@/contexts/WishlistContext.jsx';
import { toast } from 'sonner';
import VariantSelector from '@/components/VariantSelector.jsx';
import QuantitySelector from '@/components/QuantitySelector.jsx';
import { Skeleton } from '@/components/ui/skeleton';

const placeholderImage = "https://images.unsplash.com/photo-1552169113-e367653a9d5b?auto=format&fit=crop&q=80&w=800";

const QuickViewModal = ({ productId, isOpen, onClose }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    if (isOpen && productId) {
      fetchProduct();
    }
  }, [isOpen, productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const fetchedProduct = await getProduct(productId);
      
      if (!fetchedProduct.images || fetchedProduct.images.length === 0) {
        fetchedProduct.images = [{ url: placeholderImage }];
      }
      
      setProduct(fetchedProduct);
      if (fetchedProduct.variants?.length > 0) {
        setSelectedVariant(fetchedProduct.variants[0]);
      }
      setQuantity(1);
      setCurrentImageIndex(0);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return;
    try {
      await addToCart(product, selectedVariant, quantity, selectedVariant.inventory_quantity);
      toast.success('Added to Cart');
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + `/product/${productId}`);
    toast.success('Link copied to clipboard');
  };

  const isOutOfStock = selectedVariant?.manage_inventory && selectedVariant.inventory_quantity <= 0;
  const maxQuantity = selectedVariant?.manage_inventory ? selectedVariant.inventory_quantity : 99;
  const inWishlist = product ? isInWishlist(product.id) : false;

  const images = product?.images || [];
  const currentImage = images[currentImageIndex]?.url || placeholderImage;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] md:max-w-[80vw] lg:max-w-[60vw] max-h-[95vh] p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Skeleton className="aspect-square rounded-2xl" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
        ) : product ? (
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-background transition-colors"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>

            <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8 max-h-[95vh] overflow-y-auto custom-scrollbar">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted group">
                  <img
                    src={currentImage}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {product.discountPercentage && (
                    <Badge className="absolute top-4 left-4 bg-destructive text-white border-none shadow-md">
                      -{product.discountPercentage}% OFF
                    </Badge>
                  )}

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex(p => p === 0 ? images.length - 1 : p - 1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex(p => p === images.length - 1 ? 0 : p + 1)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                          idx === currentImageIndex ? 'ring-2 ring-primary ring-offset-2' : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">{product.category}</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {product.title}
                  </h2>
                  <div className="prose prose-sm dark:prose-invert text-foreground/80 line-clamp-3" dangerouslySetInnerHTML={{ __html: product.description }} />
                </div>

                <VariantSelector
                  product={product}
                  selectedVariant={selectedVariant}
                  onVariantChange={setSelectedVariant}
                />

                <div className="space-y-3">
                  <h4 className="font-bold text-foreground">Quantity</h4>
                  <QuantitySelector
                    quantity={quantity}
                    setQuantity={setQuantity}
                    maxQuantity={maxQuantity}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="flex-1 h-12 gradient-primary text-white rounded-xl shadow-md"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleWishlist(product.id)}
                    className="h-12 w-12 rounded-xl border-border/50"
                  >
                    <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground'}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                    className="h-12 w-12 rounded-xl border-border/50"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>

                <Link to={`/product/${product.id}`} onClick={onClose}>
                  <Button variant="link" className="w-full text-primary p-0 h-auto">
                    View Full Details <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;
