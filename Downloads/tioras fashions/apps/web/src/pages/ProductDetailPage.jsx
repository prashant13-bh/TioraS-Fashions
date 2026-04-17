
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProduct, getProductQuantities } from '@/api/EcommerceApi';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart.jsx';
import { useWishlist } from '@/contexts/WishlistContext.jsx';
import { toast } from 'sonner';
import { 
  ShoppingCart, ChevronLeft, ChevronRight, Heart, 
  Share2, Maximize2, RefreshCw, AlertTriangle, Truck, Bell, MessageCircle, Zap
} from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { ProductBanner } from '@/components/LegalBanners.jsx';
import ReviewsList from '@/components/ReviewsList.jsx';
import VariantSelector from '@/components/VariantSelector.jsx';
import QuantitySelector from '@/components/QuantitySelector.jsx';
import RelatedProducts from '@/components/RelatedProducts.jsx';
import DeliveryEstimator from '@/components/DeliveryEstimator.jsx';
import NotifyMeModal from '@/components/NotifyMeModal.jsx';
import AskQuestionModal from '@/components/AskQuestionModal.jsx';

const placeholderImages = [
  "https://images.unsplash.com/photo-1552169113-e367653a9d5b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1605760719369-be714c32a7f6?auto=format&fit=crop&q=80&w=800"
];

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const inWishlist = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const fetchedProduct = await getProduct(id);

        const quantitiesResponse = await getProductQuantities({
          fields: 'inventory_quantity',
          product_ids: [fetchedProduct.id]
        });

        const variantQuantityMap = new Map();
        quantitiesResponse.variants.forEach(variant => {
          variantQuantityMap.set(variant.id, variant.inventory_quantity);
        });

        const productWithQuantities = {
          ...fetchedProduct,
          variants: fetchedProduct.variants.map(variant => ({
            ...variant,
            inventory_quantity: variantQuantityMap.get(variant.id) ?? variant.inventory_quantity
          }))
        };

        if (!productWithQuantities.images || productWithQuantities.images.length === 0) {
           productWithQuantities.images = placeholderImages.map(url => ({ url }));
        }
        
        productWithQuantities.material = productWithQuantities.material || "100% Premium Bio-Washed Cotton";
        productWithQuantities.careInstructions = productWithQuantities.careInstructions || "Machine wash cold inside out. Tumble dry low. Do not iron on print.";

        setProduct(productWithQuantities);
        if (productWithQuantities.variants?.length > 0) {
          setSelectedVariant(productWithQuantities.variants[0]);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProductData();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) {
      toast.error('Please select a variant');
      return;
    }
    if (quantity <= 0) {
      toast.error('Please select a valid quantity');
      return;
    }
    try {
      await addToCart(product, selectedVariant, quantity, selectedVariant.inventory_quantity);
      toast.success('Added to Cart', { description: `${quantity}x ${product.title} added successfully.` });
    } catch (error) {
      toast.error('Cannot add to cart', { description: error.message });
    }
  };

  const handleBuyNow = async () => {
    if (!product || !selectedVariant) {
      toast.error('Please select a variant');
      return;
    }
    if (quantity <= 0) {
      toast.error('Please select a valid quantity');
      return;
    }
    if (selectedVariant.manage_inventory && quantity > selectedVariant.inventory_quantity) {
      toast.error(`Only ${selectedVariant.inventory_quantity} items available`);
      return;
    }

    try {
      await addToCart(product, selectedVariant, quantity, selectedVariant.inventory_quantity);
      navigate('/checkout');
    } catch (error) {
      toast.error('Cannot proceed to checkout', { description: error.message });
    }
  };

  const images = product?.images || [];
  const currentImage = images[currentImageIndex]?.url || placeholderImages[0];
  const hasMultipleImages = images.length > 1;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full mt-20">
          <div className="grid lg:grid-cols-2 gap-12">
            <Skeleton className="h-[600px] w-full rounded-3xl" />
            <div className="space-y-6 pt-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-32 w-full mt-8" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) return null;

  const isOutOfStock = selectedVariant?.manage_inventory && selectedVariant.inventory_quantity <= 0;
  const maxQuantity = selectedVariant?.manage_inventory ? selectedVariant.inventory_quantity : 99;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>{product.title} | TioraS Fashions</title>
      </Helmet>
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full mt-20">
        <nav className="flex items-center text-sm font-medium text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
          <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
          <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
          <span className="text-foreground truncate">{product.title}</span>
        </nav>

        <ProductBanner isCustomized={false} />
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Gallery */}
          <div className="relative select-none space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl bg-muted aspect-[4/5] lg:aspect-square group cursor-zoom-in shadow-sm border border-border/50">
              <img
                src={currentImage}
                alt={product.title}
                onClick={() => setIsLightboxOpen(true)}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              
              {product.discountPercentage && (
                <Badge className="absolute top-4 left-4 bg-destructive text-white border-none px-3 py-1 text-sm font-bold shadow-lg">
                  -{product.discountPercentage}% OFF
                </Badge>
              )}

              <button 
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-4 right-4 w-10 h-10 bg-background/80 backdrop-blur-md rounded-full flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-all shadow-md"
              >
                <Maximize2 className="w-5 h-5" />
              </button>

              {hasMultipleImages && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(p => p === 0 ? images.length - 1 : p - 1); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/90 text-foreground rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(p => p === images.length - 1 ? 0 : p + 1); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/90 text-foreground rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </motion.div>

            {hasMultipleImages && (
              <div className="flex gap-4 mt-6 overflow-x-auto pb-2 custom-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden transition-all duration-200 ${idx === currentImageIndex ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover bg-muted" />
                  </button>
                ))}
              </div>
            )}

            {/* Delivery Estimator */}
            <DeliveryEstimator />

            {/* Product Video (if exists) */}
            {product.video_url && (
              <div className="rounded-2xl overflow-hidden border border-border/50 shadow-sm">
                <video
                  src={product.video_url}
                  controls
                  className="w-full aspect-video"
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex flex-col">
            <div className="flex justify-between items-start gap-4 mb-2">
              <p className="text-sm font-bold text-primary uppercase tracking-widest">{product.category}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-border/50 text-foreground" onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied");
                }}>
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-border/50 text-foreground" onClick={() => toggleWishlist(product.id)}>
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground'}`} />
                </Button>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              {product.title}
            </h1>

            <div className="prose prose-sm dark:prose-invert text-foreground/80 mb-6" dangerouslySetInnerHTML={{ __html: product.description }} />

            {/* Ask Question Button */}
            <Button
              variant="outline"
              onClick={() => setIsQuestionModalOpen(true)}
              className="mb-8 border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white h-11 rounded-xl"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Ask a Question
            </Button>

            <VariantSelector
              product={product}
              selectedVariant={selectedVariant}
              onVariantChange={setSelectedVariant}
            />

            <div className="mt-8 space-y-3">
              <h4 className="font-bold text-foreground">Quantity</h4>
              <QuantitySelector
                quantity={quantity}
                setQuantity={setQuantity}
                maxQuantity={maxQuantity}
              />
            </div>

            {/* Important Info Section */}
            <div className="my-8 border-t border-border/60 pt-6">
              <h3 className="font-bold text-foreground mb-4">Important Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors border-l-2 border-[hsl(var(--legal-primary))] bg-background">
                  <RefreshCw className="w-5 h-5 text-[hsl(var(--legal-primary))] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-foreground">30-Day Returns</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Return unworn items within 30 days. <Link to="/return-policy" className="underline font-medium hover:text-[hsl(var(--legal-primary))]">Policy</Link></p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors border-l-2 border-[hsl(var(--legal-warning))] bg-background">
                  <AlertTriangle className="w-5 h-5 text-[hsl(var(--legal-warning))] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Customization Rules</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Items customized with embroidery or print are final sale. <Link to="/return-policy" className="underline font-medium hover:text-[hsl(var(--legal-warning))]">Details</Link></p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors border-l-2 border-[hsl(var(--legal-success))] bg-background">
                  <Truck className="w-5 h-5 text-[hsl(var(--legal-success))] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Free Shipping</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Available on orders over ₹500 across India. <Link to="/shipping-policy" className="underline font-medium hover:text-[hsl(var(--legal-success))]">Learn More</Link></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-muted/30 border border-border/50 rounded-3xl p-6 mb-8">
              <div className="flex flex-col gap-3">
                {isOutOfStock ? (
                  <Button 
                    onClick={() => setIsNotifyModalOpen(true)}
                    className="w-full h-11 rounded-xl bg-[#1a1a2e] text-white hover:bg-[#1a1a2e]/90 shadow-lg"
                  >
                    <Bell className="w-5 h-5 mr-2" /> 
                    Notify Me When Available
                  </Button>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={handleAddToCart}
                        className="flex-1 h-11 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" /> 
                        Add to Cart
                      </Button>
                      <Button 
                        onClick={handleBuyNow}
                        className="flex-1 h-11 rounded-xl bg-[#D4AF37] text-[#1a1a2e] hover:bg-[#D4AF37]/90 shadow-lg font-bold"
                      >
                        <Zap className="w-5 h-5 mr-2" /> 
                        Buy Now
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-[hsl(var(--legal-accent))]/10 to-transparent border border-[hsl(var(--legal-accent))]/20 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-foreground flex items-center gap-2"><span className="text-xl">✨</span> Make it yours</h4>
                <p className="text-sm text-muted-foreground mt-1">Add custom embroidery or printing to this blank product.</p>
              </div>
              <Link to={`/customize?product=${product.id}`}>
                <Button variant="secondary" className="rounded-full shadow-sm font-bold bg-[hsl(var(--legal-accent))] text-white hover:bg-[hsl(var(--legal-accent))]/90 px-6 w-full sm:w-auto">Customize</Button>
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="mt-20">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full justify-start border-b border-border/50 rounded-none bg-transparent h-auto p-0 space-x-8 mb-8 overflow-x-auto">
              <TabsTrigger value="details" className="data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent rounded-none px-0 py-3 font-bold text-base bg-transparent data-[state=active]:bg-transparent">Product Details</TabsTrigger>
              <TabsTrigger value="material" className="data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent rounded-none px-0 py-3 font-bold text-base bg-transparent data-[state=active]:bg-transparent">Material & Care</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-0">
              <div className="prose dark:prose-invert text-foreground/80 max-w-3xl" dangerouslySetInnerHTML={{ __html: product.description }} />
            </TabsContent>
            
            <TabsContent value="material" className="mt-0 space-y-6">
              <div className="max-w-3xl">
                <h4 className="font-bold text-foreground text-lg mb-2">Material Composition</h4>
                <p className="text-muted-foreground leading-relaxed mb-6">{product.material}</p>
                
                <h4 className="font-bold text-foreground text-lg mb-2">Care Instructions</h4>
                <p className="text-muted-foreground leading-relaxed">{product.careInstructions}</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Reviews Section */}
        <div className="mt-24 pt-16 border-t border-border/50">
          <ReviewsList productId={product.id} />
        </div>

        {/* Related Products Section */}
        <div className="mt-24 pt-16 border-t border-border/50">
          <RelatedProducts currentProductId={product.id} category={product.category} />
        </div>
      </main>

      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-[95vw] h-[95vh] p-0 bg-black/95 border-none flex flex-col justify-center overflow-hidden [&>button]:text-white">
          <div className="relative w-full h-full flex items-center justify-center">
            <img src={currentImage} alt={product.title} className="max-w-full max-h-full object-contain" />
          </div>
        </DialogContent>
      </Dialog>

      <NotifyMeModal 
        isOpen={isNotifyModalOpen} 
        onClose={() => setIsNotifyModalOpen(false)} 
        productId={product.id} 
      />

      <AskQuestionModal 
        isOpen={isQuestionModalOpen} 
        onClose={() => setIsQuestionModalOpen(false)} 
        productId={product.id} 
      />

      <Footer />
    </div>
  );
}

export default ProductDetailPage;
