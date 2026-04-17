import React from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ProductCarousel from "@/components/ProductCarousel.jsx";
import NewArrivals from "@/components/NewArrivals.jsx";
import BestSellers from "@/components/BestSellers.jsx";
import { Skeleton } from "@/components/ui/skeleton";

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

const HomepageProductTabs = ({ trendingProducts, loadingTrending, renderTrendingItem }) => {
  return (
    <section className="py-12 md:py-[80px] lg:py-[100px] bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a1a2e]">
            Our Products
          </h2>
          <p className="text-muted-foreground text-lg">
            Discover What's New, Trending and Top Ranked
          </p>
        </div>

        <Tabs defaultValue="trending" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="trending" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#1a1a2e] font-semibold tracking-wide">
                Trending Now
              </TabsTrigger>
              <TabsTrigger value="new" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#1a1a2e] font-semibold tracking-wide border-x border-[#D4AF37]/20 border-opacity-30">
                New Arrivals
              </TabsTrigger>
              <TabsTrigger value="best" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#1a1a2e] font-semibold tracking-wide">
                Best Sellers
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="trending" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="flex justify-end mb-6">
              <Link to="/products" className="hidden md:block">
                <Button
                  variant="link"
                  className="text-[#D4AF37] font-semibold hover:text-[#D4AF37]/80 p-0"
                >
                  View All Trending &rarr;
                </Button>
              </Link>
            </div>
            {loadingTrending ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : trendingProducts.length > 0 ? (
              <ProductCarousel
                items={trendingProducts}
                renderItem={renderTrendingItem}
                itemsPerView={{ desktop: 4, tablet: 2, mobile: 1 }}
              />
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg">Products coming soon!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="new" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
             <NewArrivals headless={true} />
          </TabsContent>

          <TabsContent value="best" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
             <BestSellers headless={true} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default HomepageProductTabs;
