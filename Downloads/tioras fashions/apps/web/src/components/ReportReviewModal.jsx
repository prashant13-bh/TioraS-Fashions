
import React, { useState } from 'react';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const ReportReviewModal = ({ isOpen, onClose, reviewId }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please log in to report a review");
      return;
    }
    if (!reason) {
      toast.error("Please select a reason");
      return;
    }

    setIsSubmitting(true);
    try {
      await pb.collection('review_reports').create({
        reviewId,
        userId: currentUser.id,
        reason,
        comment,
        status: 'pending'
      }, { $autoCancel: false });

      toast.success('Review reported successfully. Our team will investigate.');
      onClose();
      setReason('');
      setComment('');
    } catch (error) {
      console.error("Error reporting review:", error);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[hsl(var(--review-red))]/10 flex items-center justify-center text-[hsl(var(--review-red))]">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <DialogTitle className="text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>Report Review</DialogTitle>
            </div>
            <DialogDescription>
              Please let us know why you think this review violates our guidelines.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for reporting</Label>
              <Select value={reason} onValueChange={setReason} required>
                <SelectTrigger id="reason" className="bg-background text-foreground rounded-xl">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Spam">Spam or promotional</SelectItem>
                  <SelectItem value="Offensive">Offensive or inappropriate</SelectItem>
                  <SelectItem value="Fake">Fake or misleading</SelectItem>
                  <SelectItem value="Off-topic">Off-topic</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Additional details (optional)</Label>
              <Textarea 
                id="comment" 
                placeholder="Provide more context..." 
                className="bg-background text-foreground min-h-[100px] rounded-xl resize-none"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !reason} className="rounded-xl bg-[hsl(var(--review-red))] hover:bg-[hsl(var(--review-red))]/90 text-white w-full sm:w-auto">
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Submit Report
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportReviewModal;
