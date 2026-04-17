
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient';
import { format } from 'date-fns';
import { Star, Search, Filter, CheckCircle2, MoreVertical, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import AdminLayout from '@/components/AdminLayout.jsx';
import AdminReviewDetailModal from '@/components/AdminReviewDetailModal.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeReview, setActiveReview] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [verifiedFilter, setVerifiedFilter] = useState('All');
  const [sortBy, setSortBy] = useState('-created');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      let filterStr = [];
      if (statusFilter !== 'All') filterStr.push(`status = "${statusFilter.toLowerCase()}"`);
      if (ratingFilter !== 'All') filterStr.push(`rating = ${ratingFilter}`);
      if (verifiedFilter === 'Verified Only') filterStr.push(`verified_purchase = true`);
      if (search) filterStr.push(`(title ~ "${search}" || content ~ "${search}" || expand.userId.name ~ "${search}")`);

      const records = await pb.collection('reviews').getFullList({
        filter: filterStr.join(' && '),
        sort: sortBy,
        expand: 'userId,productId',
        $autoCancel: false
      });
      setReviews(records);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [statusFilter, ratingFilter, verifiedFilter, sortBy, search]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await pb.collection('reviews').update(id, { status: newStatus }, { $autoCancel: false });
      toast.success(`Review ${newStatus} successfully`);
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      if (activeReview?.id === id) setActiveReview({ ...activeReview, status: newStatus });
    } catch (error) {
      toast.error('Status update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await pb.collection('reviews').delete(id, { $autoCancel: false });
      toast.success('Review deleted');
      setReviews(prev => prev.filter(r => r.id !== id));
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedReviews.length === 0) return;
    try {
      await Promise.all(selectedReviews.map(id => {
        if (action === 'delete') return pb.collection('reviews').delete(id, { $autoCancel: false });
        return pb.collection('reviews').update(id, { status: action }, { $autoCancel: false });
      }));
      toast.success(`Bulk action successful`);
      fetchReviews();
      setSelectedReviews([]);
    } catch (error) {
      toast.error('Bulk action failed');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': return <Badge className="bg-[hsl(var(--review-green))]/10 text-[hsl(var(--review-green))] border-none font-bold">Approved</Badge>;
      case 'rejected': return <Badge className="bg-[hsl(var(--review-red))]/10 text-[hsl(var(--review-red))] border-none font-bold">Rejected</Badge>;
      default: return <Badge className="bg-[hsl(var(--review-gold))]/10 text-[hsl(var(--review-gold))] border-none font-bold">Pending</Badge>;
    }
  };

  return (
    <AdminLayout>
      <Helmet><title>Reviews Management | Admin</title></Helmet>

      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Reviews Management</h1>
          <p className="text-sm text-muted-foreground">Moderate and manage customer reviews.</p>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search reviews..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background rounded-xl"
          />
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] rounded-xl bg-background"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-[120px] rounded-xl bg-background"><SelectValue placeholder="Rating" /></SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="All">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px] rounded-xl bg-background"><SelectValue placeholder="Sort" /></SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="-created">Newest</SelectItem>
              <SelectItem value="+created">Oldest</SelectItem>
              <SelectItem value="-rating">Highest Rated</SelectItem>
              <SelectItem value="+rating">Lowest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedReviews.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex justify-between items-center mb-6">
          <span className="text-sm font-bold text-primary">{selectedReviews.length} reviews selected</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="rounded-lg text-[hsl(var(--review-green))] border-[hsl(var(--review-green))]/30" onClick={() => handleBulkAction('approved')}>Approve Selected</Button>
            <Button size="sm" variant="outline" className="rounded-lg text-[hsl(var(--review-red))] border-[hsl(var(--review-red))]/30" onClick={() => handleBulkAction('rejected')}>Reject Selected</Button>
            <Button size="sm" variant="destructive" className="rounded-lg" onClick={() => handleBulkAction('delete')}>Delete Selected</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border/50">
          <p className="text-muted-foreground">No reviews found matching criteria.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reviews.map(review => (
            <div key={review.id} className="bg-card border border-border/60 rounded-xl p-4 flex gap-4 hover:border-primary/30 transition-colors group">
              <div className="pt-1">
                <Checkbox 
                  checked={selectedReviews.includes(review.id)}
                  onCheckedChange={(c) => setSelectedReviews(p => c ? [...p, review.id] : p.filter(id => id !== review.id))}
                />
              </div>
              <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden shrink-0 border border-border/50">
                {/* Fallback image if product expand fails */}
                <img src="/placeholder.svg" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(review.status)}
                    <span className="flex items-center gap-0.5 text-sm font-bold text-[hsl(var(--review-gold))]">
                      {review.rating} <Star className="w-3.5 h-3.5 fill-current" />
                    </span>
                    {review.verified_purchase && <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--review-green))]" title="Verified" />}
                  </div>
                  <span className="text-xs text-muted-foreground">{format(new Date(review.created), 'MMM d, yyyy')}</span>
                </div>
                <h4 className="font-bold text-foreground text-sm truncate">{review.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{review.content}</p>
                <p className="text-xs text-muted-foreground">By: <span className="font-medium text-foreground">{review.expand?.userId?.name || 'User'}</span></p>
              </div>
              <div className="flex flex-col justify-between items-end shrink-0 pl-4 border-l border-border/50">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuItem onClick={() => { setActiveReview(review); setIsModalOpen(true); }}>View Details</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(review.id, 'approved')} className="text-[hsl(var(--review-green))]">Approve</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(review.id, 'rejected')} className="text-[hsl(var(--review-red))]">Reject</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(review.id)} className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="secondary" size="sm" className="text-xs h-7 rounded-lg" onClick={() => { setActiveReview(review); setIsModalOpen(true); }}>
                  Review
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminReviewDetailModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setActiveReview(null); }} 
        review={activeReview} 
        onUpdateStatus={handleStatusUpdate}
        onDelete={handleDelete}
      />
    </AdminLayout>
  );
};

export default AdminReviewsPage;
