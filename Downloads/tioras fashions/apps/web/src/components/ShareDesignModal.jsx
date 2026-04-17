
import React from 'react';
import { Copy, Instagram, Mail, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ShareDesignModal = ({ shareId, isOpen, onOpenChange }) => {
  const shareUrl = `${window.location.origin}/design/${shareId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard!');
  };

  const handleWhatsApp = () => {
    const text = `Check out my custom design from TioraS Fashions Studio! ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleEmail = () => {
    const subject = 'My Custom Design from TioraS Fashions';
    const body = `I created this amazing design. Check it out here: ${shareUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
            Share Your Design
          </DialogTitle>
          <DialogDescription>
            Share this unique link with friends, family, or your team.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center space-y-6 py-4">
          <div className="p-2 bg-white rounded-xl shadow-sm border border-border">
            <img src={qrUrl} alt="QR Code to design" className="w-32 h-32" />
          </div>

          <div className="flex w-full space-x-2">
            <Input 
              readOnly 
              value={shareUrl} 
              className="bg-muted text-muted-foreground border-border/50 focus-visible:ring-0"
            />
            <Button size="icon" onClick={handleCopyLink} className="shrink-0">
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full pt-4 border-t border-border/50">
            <Button variant="outline" className="flex flex-col h-auto py-3 gap-2" onClick={handleWhatsApp}>
              <Share2 className="h-5 w-5 text-emerald-500" />
              <span className="text-xs">WhatsApp</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-auto py-3 gap-2" onClick={() => toast.info('Copy link to add to your Instagram bio/story!')}>
              <Instagram className="h-5 w-5 text-pink-500" />
              <span className="text-xs">Instagram</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-auto py-3 gap-2" onClick={handleEmail}>
              <Mail className="h-5 w-5 text-blue-500" />
              <span className="text-xs">Email</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDesignModal;
