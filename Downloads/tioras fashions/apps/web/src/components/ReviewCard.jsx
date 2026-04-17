
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Star, CheckCircle2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ReviewCard = ({ review, onReadMore, onVote, userVote }) => {
  const isLong = review.content.length > 150;
  const truncatedContent = isLong ? review.content.substring(0, 150) + '...' : review.content;

  return (
    <div className="review-card flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
            {review.expand?.userId?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-bold text-sm text-foreground">{review.expand?.userId?.name || 'Anonymous User'}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              {review.verified_purchase && (
                <span className="flex items-center gap-1 text-[hsl(var(--review-green))] font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(review.created), { addSuffix: true })}
        </span>
      </div>

      <div className="flex items-center gap-1 mb-2">
        {[1, 2, 3, 4, 5].map(star => (
          <Star 
            key={star} 
            className={`w-4 h-4 ${star <= review.rating ? 'fill-[hsl(var(--review-gold))] text-[hsl(var(--review-gold))]' : 'text-muted-foreground/30'}`} 
          />
        ))}
      </div>

      <h4 className="review-title line-clamp-1">{review.title}</h4>
      
      <div className="flex-1">
        <p className="review-content whitespace-pre-wrap">
          {truncatedContent}
          {isLong && (
            <button onClick={() => onReadMore(review)} className="text-primary font-medium ml-1 hover:underline">
              Read more
            </button>
          )}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {review.helpful_count > 0 ? `${review.helpful_count} people found this helpful` : 'Was this helpful?'}
        </span>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => onVote(review.id, 'helpful', review.helpful_count, review.unhelpful_count)}
            className={`h-8 w-8 rounded-full ${userVote === 'helpful' ? 'bg-primary/10 text-primary border-primary/30' : 'text-muted-foreground'}`}
            title="Helpful"
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${userVote === 'helpful' ? 'fill-current' : ''}`} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => onVote(review.id, 'unhelpful', review.helpful_count, review.unhelpful_count)}
            className={`h-8 w-8 rounded-full ${userVote === 'unhelpful' ? 'bg-destructive/10 text-destructive border-destructive/30' : 'text-muted-foreground'}`}
            title="Unhelpful"
          >
            <ThumbsDown className={`w-3.5 h-3.5 ${userVote === 'unhelpful' ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
