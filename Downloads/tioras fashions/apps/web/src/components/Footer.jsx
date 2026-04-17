
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Instagram as Pinterest, Mail, MapPin, Phone, CreditCard, ArrowUp, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast.success('Thank you for subscribing to our newsletter');
      setEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1a1a2e] text-white/80 pt-20 pb-10 border-t border-white/10 relative mobile-nav-spacer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Column 1: About & Newsletter */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <span className="text-3xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Playfair Display, serif' }}>
                TioraS Fashions
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Premium fashion for every occasion. Discover handpicked collections, exceptional quality, and unbeatable prices.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="mb-6">
              <h5 className="text-white font-semibold mb-3 text-sm">Subscribe to Newsletter</h5>
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-[#D4AF37] text-sm h-10"
                  required
                />
                <Button type="submit" className="bg-[#D4AF37] text-[#1a1a2e] hover:bg-[#F4E5B8] shrink-0 h-10 px-4">
                  Subscribe
                </Button>
              </div>
            </form>

            <div className="flex space-x-3">
              <a href="https://facebook.com/tiorasfashions" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#1a1a2e] transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://instagram.com/tiorasfashions" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#1a1a2e] transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://twitter.com/tiorasfashions" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#1a1a2e] transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com/company/tiorasfashions" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#1a1a2e] transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="https://pinterest.com/tiorasfashions" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#1a1a2e] transition-colors">
                <Pinterest className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>Shop</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/products" className="hover:text-[#D4AF37] transition-colors">All Products</Link></li>
              <li><Link to="/products?filter=new" className="hover:text-[#D4AF37] transition-colors">New Arrivals</Link></li>
              <li><Link to="/products?filter=bestsellers" className="hover:text-[#D4AF37] transition-colors">Best Sellers</Link></li>
              <li><Link to="/products?filter=sale" className="hover:text-[#D4AF37] transition-colors">Sale</Link></li>
              <li><Link to="/products" className="hover:text-[#D4AF37] transition-colors">Collections</Link></li>
              <li><Link to="/products?filter=brands" className="hover:text-[#D4AF37] transition-colors">Brands</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>Customer Service</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/contact" className="hover:text-[#D4AF37] transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-[#D4AF37] transition-colors">FAQ</Link></li>
              <li><Link to="/account/orders" className="hover:text-[#D4AF37] transition-colors">Track Order</Link></li>
              <li><Link to="/return-policy" className="hover:text-[#D4AF37] transition-colors">Returns</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-[#D4AF37] transition-colors">Shipping Info</Link></li>
              <li><Link to="/faq#size-guide" className="hover:text-[#D4AF37] transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-[#D4AF37] transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-[#D4AF37] transition-colors">Blog</Link></li>
              <li><Link to="/about#sustainability" className="hover:text-[#D4AF37] transition-colors">Sustainability</Link></li>
            </ul>
          </div>

          {/* Column 5: Legal */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/privacy-policy" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="hover:text-[#D4AF37] transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/return-policy" className="hover:text-[#D4AF37] transition-colors">Return Policy</Link></li>
              <li><Link to="/refund-policy" className="hover:text-[#D4AF37] transition-colors">Refund Policy</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-[#D4AF37] transition-colors">Shipping Policy</Link></li>
              <li><Link to="/cancellation-policy" className="hover:text-[#D4AF37] transition-colors">Cancellation Policy</Link></li>
            </ul>
          </div>

        </div>

        {/* Company Contact Info */}
        <div className="border-t border-white/10 pt-8 pb-8 grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">TioraS Fashions</h4>
            <p className="text-xs text-white/60 leading-relaxed">
              PLACEHOLDER - Street Address<br />
              PLACEHOLDER - City, State, Postal Code<br />
              India
            </p>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#D4AF37]" />
              <a href="tel:+91XXXXXXXXXX" className="hover:text-[#D4AF37] transition-colors">
                +91-XXXXXXXXXX
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#D4AF37]" />
              <a href="mailto:support@tiorasfashions.com" className="hover:text-[#D4AF37] transition-colors">
                support@tiorasfashions.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-[#D4AF37]" />
              <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors">
                +91-XXXXXXXXXX
              </a>
            </div>
          </div>
        </div>

        {/* Contact Info Row */}
        <div className="border-t border-white/10 pt-8 pb-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-[#D4AF37]" />
            <a href="mailto:support@tiorasfashions.com" className="hover:text-[#D4AF37] transition-colors">
              support@tiorasfashions.com
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-[#D4AF37]" />
            <a href="tel:+91XXXXXXXXXX" className="hover:text-[#D4AF37] transition-colors">
              +91-XXXXXXXXXX
            </a>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-[#D4AF37]" />
            <span>Mon-Fri 10AM-6PM, Sat 10AM-4PM IST</span>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>© 2026 TioraS Fashions. All rights reserved.</p>
          <div className="flex items-center gap-4 opacity-70">
            <CreditCard className="h-6 w-8" />
            <span className="font-bold italic">VISA</span>
            <span className="font-bold">Mastercard</span>
            <span className="font-bold">UPI</span>
            <span className="font-bold">GPay</span>
            <span className="font-bold">Apple Pay</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/privacy-policy" className="hover:text-[#D4AF37]">Privacy</Link>
            <Link to="/terms-conditions" className="hover:text-[#D4AF37]">Terms</Link>
            <Link to="/sitemap" className="hover:text-[#D4AF37]">Sitemap</Link>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[#D4AF37] text-[#1a1a2e] hidden lg:flex items-center justify-center shadow-lg hover:bg-[#F4E5B8] transition-all duration-300 z-40"
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </footer>
  );
};

export default Footer;
