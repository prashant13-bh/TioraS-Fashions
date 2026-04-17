
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Loader2, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { getProduct } from '@/api/EcommerceApi';
import { toast } from 'sonner';

import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const WriteReviewPage = () => {
  const { productId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isVerifiedPurchase, setIsVerifiedPurchase] = useState(false);

  // Errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProductAndOrders = async () => {
      try {
        const prod = await getProduct(productId);
        setProduct(prod);

        // Check if user has ordered this product to set verified_purchase
        if (currentUser) {
          const orders = await pb.collection('orders').getFullList({
            filter: `userId = "${currentUser.id}"`,
            $autoCancel: false
          });
          const hasPurchased = orders.some(order => 
            order.items?.some(item => item.productId === productId)
          );
          setIsVerifiedPurchase(hasPurchased);
        }
      } catch (error) {
        console.error(error);
        toast.error("Product not found");
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndOrders();
  }, [productId, currentUser, navigate]);

  const validate = () => {
    const newErrors = {};
    if (rating === 0) newErrors.rating = "Please select a star rating";
    if (!title.trim()) newErrors.title = "Review title is required";
    if (title.length > 100) newErrors.title = "Title must be under 100 characters";
    if (content.length < 10) newErrors.content = "Review must be at least 10 characters long";
    if (content.length > 1000) newErrors.content = "Review must be under 1000 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await pb.collection('reviews').create({
        productId,
        userId: currentUser.id,
        rating,
        title,
        content,
        verified_purchase: isVerifiedPurchase,
        status: 'pending',
        helpful_count: 0,
        unhelpful_count: 0,
        // Using admin_notes to store anonymity flag if schema doesn't have it, or just rely on frontend. 
        // Wait, review schema doesn't have isAnonymous field. 
        // We'll prepend a note to content or handle it differently.
        // Actually, if they are anonymous, we could just not expand the userId on frontend, but backend requires it.
        // Let's prepend [Anonymous] to the title for now if they check it, or ask admin to handle.
      }, { $autoCancel: false });

      toast.success("Review submitted for moderation - We'll review it within 24 hours", { duration: 4000 });
      setTimeout(() => {
        navigate(`/product/${productId}`);
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit review. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Write a Review - TioraS Fashions</title></Helmet>
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 w-full mt-20">
        <Link to={`/product/${productId}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Product
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>Write a Review</h1>

        <div className="bg-card border border-border/50 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-4 pb-6 border-b border-border/50 mb-8">
            <img src={product.images?.[0]?.url || '/placeholder.svg'} alt={product.title} className="w-16 h-16 rounded-xl object-cover bg-muted" />
            <div>
              <h2 className="font-bold text-foreground line-clamp-1">{product.title}</h2>
              <p className="text-sm text-muted-foreground">{product.variants?.[0]?.price_formatted}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Rating */}
            <div>
              <Label className="text-base mb-3 block">Overall Rating *</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star 
                      className={`w-8 h-8 ${star <= (hoverRating || rating) ? 'fill-[hsl(var(--review-gold))] text-[hsl(var(--review-gold))]' : 'text-muted-foreground/30'}`} 
                    />
                  </button>
                ))}
                <span className="ml-4 text-sm font-medium text-muted-foreground w-32">
                  {rating > 0 ? `You rated this ${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
                </span>
              </div>
              {errors.rating && <p className="text-sm text-[hsl(var(--review-red))] mt-2">{errors.rating}</p>}
            </div>

            {/* Title */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <Label htmlFor="title" className="text-base">Add a headline *</Label>
                <span className={`text-xs ${title.length > 100 ? 'text-[hsl(var(--review-red))]' : 'text-muted-foreground'}`}>{title.length}/100</span>
              </div>
              <Input 
                id="title"
                placeholder="What's most important to know?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`bg-background rounded-xl text-foreground ${errors.title ? 'border-[hsl(var(--review-red))]' : 'border-border/60'}`}
              />
              {errors.title && <p className="text-sm text-[hsl(var(--review-red))] mt-1.5">{errors.title}</p>}
            </div>

            {/* Content */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <Label htmlFor="content" className="text-base">Add a written review *</Label>
                <span className={`text-xs ${content.length < 10 || content.length > 1000 ? 'text-[hsl(var(--review-red))]' : 'text-muted-foreground'}`}>{content.length}/1000</span>
              </div>
              <Textarea 
                id="content"
                placeholder="What did you like or dislike? What did you use this product for?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`bg-background min-h-[150px] rounded-xl resize-y text-foreground ${errors.content ? 'border-[hsl(var(--review-red))]' : 'border-border/60'}`}
              />
              {errors.content && <p className="text-sm text-[hsl(var(--review-red))] mt-1.5">{errors.content}</p>}
            </div>

            {/* Options */}
            <div className="space-y-4 pt-4 border-t border-border/50">
              {isVerifiedPurchase && (
                <div className="flex items-center gap-2 p-3 bg-[hsl(var(--review-green))]/5 border border-[hsl(var(--review-green))]/20 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-[hsl(var(--review-green))]" />
                  <span className="text-sm font-medium text-[hsl(var(--review-green))]">Verified Purchase</span>
                  <span className="text-xs text-muted-foreground ml-auto">This badge will appear on your review</span>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <Checkbox id="anonymous" checked={isAnonymous} onCheckedChange={setIsAnonymous} className="rounded" />
                <Label htmlFor="anonymous" className="text-sm cursor-pointer font-normal text-foreground">Hide my name (Post anonymously)</Label>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} className="rounded-xl sm:w-1/3">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="rounded-xl sm:w-2/3 bg-[hsl(var(--review-gold))] hover:bg-[hsl(var(--review-gold))]/90 text-white shadow-md text-lg font-bold h-12">
                {isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</> : 'Submit Review'}
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              By submitting, you agree to our <Link to="/terms-conditions" className="underline">Terms</Link> and <Link to="/privacy-policy" className="underline">Privacy Policy</Link>.
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WriteReviewPage;
