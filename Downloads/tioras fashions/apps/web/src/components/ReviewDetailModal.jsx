
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Star, CheckCircle2, ThumbsUp, ThumbsDown, Flag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const ReviewDetailModal = ({ isOpen, onClose, review, onVote, userVote, onReport }) => {
  if (!review) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-2xl p-0 overflow-hidden border-border/60">
        <DialogHeader className="p-6 bg-muted/30 border-b border-border/50 text-left">
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    className={`w-4 h-4 ${star <= review.rating ? 'fill-[hsl(var(--review-gold))] text-[hsl(var(--review-gold))]' : 'text-muted-foreground/30'}`} 
                  />
                ))}
              </div>
              <DialogTitle className="text-xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
                {review.title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {review.expand?.userId?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">{review.expand?.userId?.name || 'Anonymous User'}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                {review.verified_purchase && (
                  <span className="flex items-center gap-1 text-[hsl(var(--review-green))] font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                  </span>
                )}
                {review.verified_purchase && <span>•</span>}
                <span>{formatDistanceToNow(new Date(review.created), { addSuffix: true })}</span>
              </div>
            </div>
          </div>

          <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap text-sm" style={{ fontFamily: 'Lato, sans-serif' }}>
            {review.content}
          </p>
        </ScrollArea>

        <div className="p-4 sm:p-6 bg-muted/10 border-t border-border/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground mr-2 font-medium">Was this helpful?</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onVote(review.id, 'helpful', review.helpful_count, review.unhelpful_count)}
              className={`rounded-full h-8 text-xs ${userVote === 'helpful' ? 'bg-primary/10 text-primary border-primary/30' : ''}`}
            >
              <ThumbsUp className={`w-3 h-3 mr-1.5 ${userVote === 'helpful' ? 'fill-current' : ''}`} /> 
              {review.helpful_count || 0}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onVote(review.id, 'unhelpful', review.helpful_count, review.unhelpful_count)}
              className={`rounded-full h-8 text-xs ${userVote === 'unhelpful' ? 'bg-destructive/10 text-destructive border-destructive/30' : ''}`}
            >
              <ThumbsDown className={`w-3 h-3 mr-1.5 ${userVote === 'unhelpful' ? 'fill-current' : ''}`} />
              {review.unhelpful_count || 0}
            </Button>
          </div>

          <Button variant="ghost" size="sm" onClick={() => onReport(review.id)} className="text-muted-foreground hover:text-[hsl(var(--review-red))] rounded-full h-8 px-3 text-xs">
            <Flag className="w-3 h-3 mr-1.5" /> Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDetailModal;
