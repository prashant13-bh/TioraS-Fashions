
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Star, CheckCircle2, User, Package, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const AdminReviewDetailModal = ({ isOpen, onClose, review, onUpdateStatus, onDelete }) => {
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    if (review) setAdminNotes(review.admin_notes || '');
  }, [review]);

  if (!review) return null;

  const handleSaveNotes = async () => {
    try {
      await pb.collection('reviews').update(review.id, { admin_notes: adminNotes }, { $autoCancel: false });
      toast.success('Notes saved');
    } catch (error) {
      toast.error('Failed to save notes');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl rounded-2xl p-0 overflow-hidden border-border/60">
        <DialogHeader className="p-6 bg-muted/30 border-b border-border/50">
          <div className="flex justify-between items-start">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              Review Details
              {review.status === 'pending' && <Badge className="bg-amber-500/10 text-amber-500 border-none ml-2">Pending</Badge>}
              {review.status === 'approved' && <Badge className="bg-emerald-500/10 text-emerald-500 border-none ml-2">Approved</Badge>}
              {review.status === 'rejected' && <Badge className="bg-rose-500/10 text-rose-500 border-none ml-2">Rejected</Badge>}
            </DialogTitle>
            <span className="text-xs text-muted-foreground">{format(new Date(review.created), 'PPp')}</span>
          </div>
        </DialogHeader>

        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
          <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border border-border/50 text-sm">
            <div>
              <p className="text-muted-foreground flex items-center gap-1 mb-1"><User className="w-3.5 h-3.5" /> Author</p>
              <p className="font-bold text-foreground">{review.expand?.userId?.name || 'Unknown'}</p>
              <p className="text-xs text-muted-foreground">{review.expand?.userId?.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground flex items-center gap-1 mb-1"><Package className="w-3.5 h-3.5" /> Product ID</p>
              <p className="font-bold text-foreground font-mono text-xs">{review.productId}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center text-[hsl(var(--review-gold))]">
                {[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= review.rating ? 'fill-current' : 'text-muted-foreground/30'}`} />)}
              </div>
              {review.verified_purchase && <Badge variant="outline" className="text-[hsl(var(--review-green))] border-[hsl(var(--review-green))]/30 text-[10px]"><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</Badge>}
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>{review.title}</h3>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap p-4 bg-background border border-border/60 rounded-xl">
              {review.content}
            </p>
          </div>

          <div className="pt-4 border-t border-border/50">
            <Label className="text-sm font-bold flex items-center gap-1 mb-2"><MessageSquare className="w-4 h-4" /> Admin Notes (Internal / Reason for rejection)</Label>
            <div className="flex gap-2">
              <Textarea 
                value={adminNotes} 
                onChange={(e) => setAdminNotes(e.target.value)} 
                className="bg-background rounded-xl min-h-[80px]" 
                placeholder="Add notes..."
              />
              <Button onClick={handleSaveNotes} variant="secondary" className="rounded-xl h-auto">Save</Button>
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 bg-muted/10 border-t border-border/50 flex justify-between sm:justify-between items-center">
          <Button variant="destructive" onClick={() => onDelete(review.id)} className="rounded-xl">Delete</Button>
          <div className="flex gap-2">
            {review.status !== 'rejected' && (
              <Button variant="outline" onClick={() => onUpdateStatus(review.id, 'rejected')} className="rounded-xl border-[hsl(var(--review-red))]/50 text-[hsl(var(--review-red))] hover:bg-[hsl(var(--review-red))]/10">Reject</Button>
            )}
            {review.status !== 'approved' && (
              <Button onClick={() => onUpdateStatus(review.id, 'approved')} className="rounded-xl bg-[hsl(var(--review-green))] text-white hover:bg-[hsl(var(--review-green))]/90">Approve</Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminReviewDetailModal;
