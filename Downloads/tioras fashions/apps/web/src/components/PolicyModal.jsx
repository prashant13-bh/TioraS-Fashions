
import React from 'react';
import { ExternalLink, X, ShieldCheck } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const policySummaries = {
  terms: {
    title: "Terms & Conditions",
    summary: "By accessing and using our website, you agree to be bound by our terms of service, including guidelines around custom order intellectual property, payment terms, and user conduct.",
    link: "/terms-conditions"
  },
  privacy: {
    title: "Privacy Policy",
    summary: "We respect your privacy. We collect only necessary information to process orders and improve your experience. We do not sell your personal data to third parties.",
    link: "/privacy-policy"
  },
  return: {
    title: "Return Policy",
    summary: "We accept returns on eligible items within 30 days of delivery. Please note that custom and personalized orders are non-returnable unless defective.",
    link: "/return-policy"
  },
  refund: {
    title: "Refund Policy",
    summary: "Approved refunds are processed to your original payment method within 13-22 business days. Original shipping costs may be non-refundable.",
    link: "/refund-policy"
  },
  shipping: {
    title: "Shipping Policy",
    summary: "We offer Pan-India shipping. Standard orders are processed in 1-2 business days. Estimated delivery times are provided at checkout.",
    link: "/shipping-policy"
  },
  cancellation: {
    title: "Cancellation Policy",
    summary: "Orders can be cancelled free of charge within 24 hours, provided they haven't entered production. Custom orders cannot be cancelled once production begins.",
    link: "/cancellation-policy"
  }
};

const PolicyModal = ({ isOpen, onClose, policyType, onAgree }) => {
  const policy = policySummaries[policyType] || { title: "Policy", summary: "Please review our policy.", link: "/legal" };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl gap-0 p-0 overflow-hidden border-border/60 shadow-xl">
        <DialogHeader className="p-6 bg-muted/30 border-b border-border/50 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                {policy.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Summary of our agreement
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-[50vh] p-6">
          <div className="space-y-4">
            <p className="text-sm text-foreground/80 leading-relaxed">
              {policy.summary}
            </p>
            <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-xl">
              <p className="text-xs text-secondary-foreground font-medium">
                Important Note: This is a summary. For full legal details, please read the complete policy document.
              </p>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-4 sm:p-6 bg-muted/10 border-t border-border/50 flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto rounded-xl font-medium"
            onClick={() => window.open(policy.link, '_blank')}
          >
            Read Full Policy <ExternalLink className="w-4 h-4 ml-2 opacity-50" />
          </Button>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button variant="ghost" onClick={onClose} className="flex-1 rounded-xl">
              Close
            </Button>
            {onAgree && (
              <Button 
                onClick={() => {
                  onAgree();
                  onClose();
                }} 
                className="flex-1 rounded-xl gradient-primary text-white shadow-sm"
              >
                I Agree
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PolicyModal;
