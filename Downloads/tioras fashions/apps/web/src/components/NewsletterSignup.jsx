
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';

const NewsletterSignup = ({ variant = 'default' }) => {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    if (!agreed) {
      toast.error('Please agree to receive promotional emails');
      return;
    }
    toast.success('Successfully subscribed to our newsletter');
    setEmail('');
    setAgreed(false);
  };

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow h-12 bg-background text-foreground"
          />
          <Button type="submit" className="bg-[#D4AF37] text-[#1a1a2e] hover:bg-[#F4E5B8] h-12 px-8 shrink-0">
            <Mail className="w-4 h-4 mr-2" /> Subscribe
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Checkbox
            id="newsletter-agree"
            checked={agreed}
            onCheckedChange={setAgreed}
          />
          <label htmlFor="newsletter-agree" className="cursor-pointer">
            I agree to receive promotional emails
          </label>
        </div>
      </form>
    );
  }

  return (
    <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
      <h4 className="font-bold text-lg mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
        Subscribe to Newsletter
      </h4>
      <p className="text-sm text-muted-foreground mb-4">
        Get the latest fashion tips and exclusive offers
      </p>
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 bg-background text-foreground"
        />
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Checkbox
            id="sidebar-newsletter-agree"
            checked={agreed}
            onCheckedChange={setAgreed}
          />
          <label htmlFor="sidebar-newsletter-agree" className="cursor-pointer">
            I agree to receive emails
          </label>
        </div>
        <Button type="submit" className="w-full bg-[#D4AF37] text-[#1a1a2e] hover:bg-[#F4E5B8]">
          Subscribe
        </Button>
      </form>
    </div>
  );
};

export default NewsletterSignup;
