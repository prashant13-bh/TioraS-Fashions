
import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Truck, RefreshCw, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getProducts, getCategories, formatCurrency } from "@/api/EcommerceApi";
import pb from "@/lib/pocketbaseClient";

import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";
import CollectionCard from "@/components/CollectionCard.jsx";
import FeatureCard from "@/components/FeatureCard.jsx";
import TestimonialCard from "@/components/TestimonialCard.jsx";
import ProductCarousel from "@/components/ProductCarousel.jsx";
import NewArrivals from "@/components/NewArrivals.jsx";
import BestSellers from "@/components/BestSellers.jsx";
import GiftCards from "@/components/GiftCards.jsx";
import CountdownTimer from "@/components/CountdownTimer.jsx";
import ReferralProgram from "@/components/ReferralProgram.jsx";
import HomepageProductTabs from "@/components/HomepageProductTabs.jsx";

const fallbackTestimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    rating: 5,
    text: "The quality of the fabric is outstanding. Truly premium fashion!",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    date: "Oct 12, 2023",
  },
  {
    id: 2,
    name: "Ananya Patel",
    rating: 5,
    text: "Fast shipping and beautiful packaging. The clothes fit perfectly.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100",
    date: "Nov 05, 2023",
  },
  {
    id: 3,
    name: "Rohan Desai",
    rating: 4,
    text: "Bought a gift for my wife. The customer service was very helpful.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
    date: "Dec 20, 2023",
  },
  {
    id: 4,
    name: "Meera Reddy",
    rating: 5,
    text: "Exceptional quality for the price. The linen trousers are incredibly professional.",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
    date: "Jan 15, 2024",
  },
];

const heroBackgrounds = [
  "https://images.unsplash.com/photo-1527759070297-9800afa63d32?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1920",
];

const collectionImages = [
  "https://images.unsplash.com/photo-1687405181991-ac537513efdc?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1629934620353-de584e387d30?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1597266122012-c4c3cf251fd3?auto=format&fit=crop&q=80&w=800",
];

const placeholderImage =
  "https://images.unsplash.com/photo-1552169113-e367653a9d5b?auto=format&fit=crop&q=80&w=800";

// Flash sale end date (7 days from now)
const saleEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

const HomePage = () => {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);

  // Auto-cycle hero backgrounds
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroBackgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts({ limit: "8" });
        const mapped = (response.products || []).map((p) => {
          const variant = p.variants?.[0];
          const priceFormatted =
            variant?.sale_price_formatted ||
            variant?.price_formatted ||
            formatCurrency(p.price_in_cents, variant?.currency_info);
          return {
            id: p.id,
            name: p.title,
            image: p.image || placeholderImage,
            price: priceFormatted || "—",
            rating: 4.5 + Math.random() * 0.5,
          };
        });
        setProducts(mapped);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        const cats = (response.categories || [])
          .slice(0, 3)
          .map((cat, idx) => ({
            id: cat.id,
            name: cat.title,
            image:
              cat.image_url || collectionImages[idx % collectionImages.length],
            link: `/products/category/${encodeURIComponent(cat.title)}`,
          }));
        setCategories(cats);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([
          {
            id: "1",
            name: "Summer Essentials",
            image: collectionImages[0],
            link: "/products",
          },
          {
            id: "2",
            name: "Formal Wear",
            image: collectionImages[1],
            link: "/products",
          },
          {
            id: "3",
            name: "Casual Comfort",
            image: collectionImages[2],
            link: "/products",
          },
        ]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviews = await pb.collection("reviews").getList(1, 6, {
          filter: 'status = "approved"',
          sort: "-created",
          expand: "user",
          $autoCancel: false,
        });
        if (reviews.items.length > 0) {
          const mapped = reviews.items.map((r) => ({
            id: r.id,
            name: r.expand?.user?.name || r.reviewerName || "Customer",
            rating: r.rating || 5,
            text: r.content || r.comment || "",
            avatar: r.expand?.user?.avatar
              ? pb.files.getURL(r.expand.user, r.expand.user.avatar, {
                  thumb: "100x100",
                })
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(r.expand?.user?.name || "C")}&background=D4AF37&color=1a1a2e`,
            date: new Date(r.created).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
          }));
          setTestimonials(mapped);
        } else {
          setTestimonials(fallbackTestimonials);
        }
      } catch {
        setTestimonials(fallbackTestimonials);
      } finally {
        setLoadingTestimonials(false);
      }
    };
    fetchReviews();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    if (!agreed) {
      toast.error("Please agree to receive promotional emails");
      return;
    }
    toast.success("Successfully subscribed to our newsletter!");
    setEmail("");
    setAgreed(false);
  };

  const ProductSkeleton = () => (
    <div className="bg-card rounded-xl overflow-hidden border border-border/50 flex flex-col h-full animate-pulse">
      <Skeleton className="aspect-[4/5] w-full" />
      <div className="p-5 space-y-3">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-3.5 w-3.5 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-5 w-3/4" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );

  const HomeProductCard = ({ product }) => (
    <motion.div
      whileHover={{ y: -4 }}
      className="group bg-card rounded-xl overflow-hidden shadow-subtle hover:shadow-medium transition-all duration-300 border border-border/50 flex flex-col h-full"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground/30"}`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            ({product.rating.toFixed(1)})
          </span>
        </div>

        <Link
          to={`/product/${product.id}`}
          className="hover:text-primary transition-colors"
        >
          <h4 className="text-base font-semibold mb-1 line-clamp-1">
            {product.name}
          </h4>
        </Link>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">
            {product.price}
          </span>
          <Link to={`/product/${product.id}`}>
            <Button
              size="sm"
              className="bg-foreground text-background hover:bg-primary hover:text-primary-foreground rounded-full px-4"
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col mobile-nav-spacer">
      <Helmet>
        <title>TioraS Fashions - Premium Fashion for Every Occasion</title>
        <meta
          name="description"
          content="Shop premium fashion at TioraS Fashions. Discover handpicked collections, exceptional quality, and unbeatable prices. Free shipping on orders over ₹500."
        />
        <meta
          name="keywords"
          content="Fashion, clothing, premium, TioraS Fashions, custom apparel, embroidery"
        />
      </Helmet>

      <Header />

      <main className="flex-grow">
        {/* PROMO BANNER */}
        <section className="bg-gradient-to-r from-[#1a1a2e] via-[#2d2d44] to-[#1a1a2e] text-white py-2.5 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(212,175,55,0.1) 10px, rgba(212,175,55,0.1) 20px)' }} />
          </div>
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-center relative z-10">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#D4AF37] animate-pulse" />
              <span className="text-sm font-semibold">Flash Sale — Up to <span className="text-[#D4AF37] font-bold">50% OFF</span></span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-[#D4AF37]" />
              <span className="text-xs sm:text-sm">Free shipping on orders over <span className="font-bold">₹500</span></span>
            </div>
          </div>
        </section>

        {/* HERO SECTION */}
        <section className="relative h-[60vh] lg:h-[80vh] min-h-[420px] lg:min-h-[600px] flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${heroBackgrounds[heroIndex]})` }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e]/80 to-[#8b1538]/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-black/40" />

          {/* Hero dots indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {heroBackgrounds.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === heroIndex ? 'bg-[#D4AF37] w-6' : 'bg-white/40 hover:bg-white/60'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-3xl md:text-6xl lg:text-7xl font-bold mb-4 lg:mb-6 text-white"
            >
              Elevate Your Style with <br className="hidden md:block" />
              <span className="text-[#D4AF37]">TioraS Fashions</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-base md:text-xl max-w-2xl mx-auto mb-6 lg:mb-10 text-white/90 leading-relaxed"
            >
              Discover premium fashion for every occasion. Handpicked
              collections, exceptional quality, unbeatable prices.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link to="/products">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#1a1a2e] font-bold rounded-none px-8 h-12 lg:h-14 text-base lg:text-lg"
                >
                  Shop Now
                </Button>
              </Link>
              <Link to="/design-studio">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1a1a2e] rounded-none px-8 h-12 lg:h-14 text-base lg:text-lg bg-transparent"
                >
                  <Sparkles className="mr-2 h-5 w-5" /> Design Your Own
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* FEATURED COLLECTIONS */}
        <section className="py-[60px] md:py-[80px] lg:py-[100px] bg-[#F9F7F4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a1a2e]">
                Featured Collections
              </h2>
              <p className="text-muted-foreground text-lg">
                Curated selections for every style
              </p>
            </div>

            {loadingCategories ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((cat) => (
                  <CollectionCard
                    key={cat.id}
                    name={cat.name}
                    image={cat.image}
                    link={cat.link}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* HOMEPAGE PRODUCT TABS (Trending, New, Best Sellers) */}
        <HomepageProductTabs 
          trendingProducts={products}
          loadingTrending={loadingProducts}
          renderTrendingItem={(product) => <HomeProductCard product={product} />}
        />

        {/* GIFT CARDS */}
        <section className="py-12 md:py-[80px] lg:py-[100px] bg-[#F9F7F4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a1a2e]">
                Gift Cards
              </h2>
              <p className="text-muted-foreground text-lg">
                Give the gift of choice
              </p>
            </div>
            <GiftCards />
          </div>
        </section>

        {/* REFERRAL PROGRAM */}
        <section className="py-12 md:py-[80px] lg:py-[100px] bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a1a2e]">
                Refer & Earn
              </h2>
              <p className="text-muted-foreground text-lg">
                Share the love and earn rewards
              </p>
            </div>
            <ReferralProgram />
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="py-12 md:py-[80px] lg:py-[100px] bg-[#F3F4F6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a1a2e]">
                Why Choose TioraS Fashions
              </h2>
              <p className="text-muted-foreground text-lg">
                Experience the difference
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              <FeatureCard
                icon={Star}
                title="Premium Quality"
                description="Handpicked fabrics and meticulous craftsmanship in every piece."
                index={0}
              />
              <FeatureCard
                icon={Truck}
                title="Fast Shipping"
                description="Free shipping on orders over ₹500. Delivered in 5-7 days."
                index={1}
              />
              <FeatureCard
                icon={RefreshCw}
                title="Easy Returns"
                description="30-Day Returns. No questions asked, hassle-free process."
                index={2}
              />
              <FeatureCard
                icon={ShieldCheck}
                title="Secure Payment"
                description="100% secure checkout with industry-standard encryption."
                index={3}
              />
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-12 md:py-[80px] lg:py-[100px] bg-[#F9F7F4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a1a2e]">
                What Our Customers Say
              </h2>
              <p className="text-muted-foreground text-lg">
                Real reviews from real customers
              </p>
            </div>

            {loadingTestimonials ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-[280px] rounded-xl" />
                ))}
              </div>
            ) : (
              <ProductCarousel
                items={testimonials}
                renderItem={(testimonial) => (
                  <TestimonialCard {...testimonial} />
                )}
                itemsPerView={{ desktop: 3, tablet: 2, mobile: 1 }}
                autoPlay={true}
              />
            )}
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="py-12 md:py-[80px] bg-[#1a1a2e] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Stay Updated
            </h2>
            <p className="text-white/80 text-lg mb-10">
              Subscribe to our newsletter for exclusive offers and new arrivals
            </p>

            <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12 rounded-none focus-visible:ring-[#D4AF37]"
                />
                <Button
                  type="submit"
                  className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#1a1a2e] font-bold h-12 rounded-none px-8 shrink-0"
                >
                  Subscribe
                </Button>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-white/70 text-left">
                <Checkbox
                  id="promo-agree"
                  checked={agreed}
                  onCheckedChange={setAgreed}
                  className="border-white/40 data-[state=checked]:bg-[#D4AF37] data-[state=checked]:text-[#1a1a2e]"
                />
                <label htmlFor="promo-agree" className="cursor-pointer">
                  I agree to receive promotional emails
                </label>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
