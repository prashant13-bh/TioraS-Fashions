
import React, { useState, useEffect, useMemo } from 'react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useReviewVotes } from '@/hooks/useReviewVotes.js';
import { MessageSquare as MessageSquareOff } from 'lucide-react';
import ReviewStatistics from './ReviewStatistics.jsx';
import ReviewFilters from './ReviewFilters.jsx';
import ReviewCard from './ReviewCard.jsx';
import ReviewDetailModal from './ReviewDetailModal.jsx';
import ReportReviewModal from './ReportReviewModal.jsx';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';

const ReviewsList = ({ productId }) => {
  const { isAuthenticated, currentUser } = useAuth();
  const { toggleVote, fetchUserVote } = useReviewVotes();

  const [reviews, setReviews] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [userVotes, setUserVotes] = useState({}); // { reviewId: 'helpful' | 'unhelpful' }

  // Modals
  const [selectedReview, setSelectedReview] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [reportReviewId, setReportReviewId] = useState(null);

  // Filters & Stats
  const [filters, setFilters] = useState({
    rating: 'All',
    verified: 'All',
    sort: '-created',
    keyword: ''
  });
  
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });

  // Fetch Stats (separately to ignore pagination)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const allApproved = await pb.collection('reviews').getFullList({
          filter: `productId = "${productId}" && status = "approved"`,
          $autoCancel: false
        });
        
        let sum = 0;
        let breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        allApproved.forEach(r => {
          sum += r.rating;
          breakdown[r.rating] = (breakdown[r.rating] || 0) + 1;
        });

        setStats({
          total: allApproved.length,
          average: allApproved.length > 0 ? sum / allApproved.length : 0,
          breakdown
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    if (productId) fetchStats();
  }, [productId]);

  // Fetch Reviews based on filters
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        let filterStr = `productId = "${productId}" && status = "approved"`;
        
        if (filters.rating !== 'All') filterStr += ` && rating = ${filters.rating}`;
        if (filters.verified === 'Verified Only') filterStr += ` && verified_purchase = true`;
        if (filters.keyword.trim() !== '') filterStr += ` && (title ~ "${filters.keyword}" || content ~ "${filters.keyword}")`;

        const records = await pb.collection('reviews').getList(currentPage, 6, {
          filter: filterStr,
          sort: filters.sort,
          expand: 'userId',
          $autoCancel: false
        });

        setReviews(records.items);
        setTotalItems(records.totalItems);
        setTotalPages(records.totalPages);

        // Fetch user votes for these reviews
        if (isAuthenticated && currentUser) {
          const votesMap = {};
          await Promise.all(records.items.map(async (r) => {
            const vote = await fetchUserVote(r.id);
            if (vote) votesMap[r.id] = vote.vote_type;
          }));
          setUserVotes(votesMap);
        }

      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) fetchReviews();
  }, [productId, currentPage, filters, isAuthenticated, currentUser, fetchUserVote]);

  const handleVote = async (reviewId, type, currentHelpful, currentUnhelpful) => {
    const res = await toggleVote(reviewId, type, currentHelpful, currentUnhelpful);
    if (res) {
      setUserVotes(prev => ({ ...prev, [reviewId]: res.newVoteState }));
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, helpful_count: res.newHelpfulCount, unhelpful_count: res.newUnhelpfulCount } : r));
      if (selectedReview?.id === reviewId) {
        setSelectedReview(prev => ({ ...prev, helpful_count: res.newHelpfulCount, unhelpful_count: res.newUnhelpfulCount }));
      }
    }
  };

  const handleReadMore = (review) => {
    setSelectedReview(review);
    setIsDetailOpen(true);
  };

  const handleReport = (reviewId) => {
    setReportReviewId(reviewId);
    if (isDetailOpen) setIsDetailOpen(false);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>Customer Reviews</h2>
      
      <ReviewStatistics productId={productId} totalReviews={stats.total} averageRating={stats.average} ratingBreakdown={stats.breakdown} />
      
      <ReviewFilters filters={filters} setFilters={(f) => { setFilters(f); setCurrentPage(1); }} />

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-2xl" />)}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border/50 rounded-3xl shadow-sm">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquareOff className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No reviews found</h3>
          <p className="text-muted-foreground">Be the first to share your experience with this product!</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map(review => (
              <ReviewCard 
                key={review.id} 
                review={review} 
                onReadMore={handleReadMore} 
                onVote={handleVote} 
                userVote={userVotes[review.id]} 
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        isActive={currentPage === i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className="cursor-pointer rounded-xl"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      <ReviewDetailModal 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        review={selectedReview} 
        onVote={handleVote} 
        userVote={selectedReview ? userVotes[selectedReview.id] : null}
        onReport={handleReport}
      />

      <ReportReviewModal 
        isOpen={!!reportReviewId} 
        onClose={() => setReportReviewId(null)} 
        reviewId={reportReviewId} 
      />
    </div>
  );
};

export default ReviewsList;
