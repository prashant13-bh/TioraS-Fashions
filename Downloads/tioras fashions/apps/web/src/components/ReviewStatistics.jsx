
import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const ReviewStatistics = ({ productId, totalReviews, averageRating, ratingBreakdown }) => {
  return (
    <div className="bg-card border border-border/50 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center">
      
      {/* Left: Overall Rating */}
      <div className="flex flex-col items-center justify-center min-w-[200px] text-center md:border-r border-border/50 md:pr-8">
        <h3 className="text-6xl font-bold text-foreground mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          {averageRating.toFixed(1)}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map(star => (
            <Star 
              key={star} 
              className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'fill-[hsl(var(--review-gold))] text-[hsl(var(--review-gold))]' : 'text-muted-foreground/30'}`} 
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground font-medium">Based on {totalReviews} reviews</p>
      </div>

      {/* Middle: Progress Bars */}
      <div className="flex-1 w-full space-y-3">
        {[5, 4, 3, 2, 1].map(star => {
          const count = ratingBreakdown[star] || 0;
          const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
          
          return (
            <div key={star} className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1 w-12 font-medium text-muted-foreground shrink-0">
                {star} <Star className="w-3 h-3 fill-[hsl(var(--review-gold))] text-[hsl(var(--review-gold))]" />
              </span>
              <Progress value={percentage} className="h-2 bg-muted flex-1" />
              <span className="w-10 text-right text-muted-foreground text-xs">{percentage}%</span>
            </div>
          );
        })}
      </div>

      {/* Right: CTA */}
      <div className="flex flex-col items-center justify-center min-w-[200px] md:pl-8 md:border-l border-border/50">
        <p className="text-sm text-muted-foreground text-center mb-4">Share your thoughts with other customers</p>
        <Link to={`/products/${productId}/write-review`} className="w-full">
          <Button className="w-full bg-[hsl(var(--review-gold))] hover:bg-[hsl(var(--review-gold))]/90 text-white rounded-xl shadow-md font-bold">
            Write a Review
          </Button>
        </Link>
      </div>
      
    </div>
  );
};

export default ReviewStatistics;
