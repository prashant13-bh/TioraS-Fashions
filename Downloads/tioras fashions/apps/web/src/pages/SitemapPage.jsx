
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const sitemapData = [
  {
    category: 'Home & Discover',
    links: [
      { name: 'Home', path: '/' },
      { name: 'All Products', path: '/products' },
      { name: 'Design Gallery', path: '/design-gallery' },
    ]
  },
  {
    category: 'Design & Customization',
    links: [
      { name: 'AI Designer', path: '/design-generator' },
      { name: 'Design Studio', path: '/customize' },
    ]
  },
  {
    category: 'Customer Account',
    links: [
      { name: 'Account Dashboard', path: '/account' },
      { name: 'Order History', path: '/account/orders' },
      { name: 'Profile Settings', path: '/account/profile' },
      { name: 'Saved Addresses', path: '/account/addresses' },
      { name: 'Wishlist', path: '/account/wishlist' },
      { name: 'Account Settings', path: '/account/settings' },
      { name: 'Login', path: '/login' },
      { name: 'Sign Up', path: '/signup' },
    ]
  },
  {
    category: 'Legal & Policies',
    links: [
      { name: 'Legal Hub', path: '/legal' },
      { name: 'Privacy Policy', path: '/privacy-policy' },
      { name: 'Terms & Conditions', path: '/terms-conditions' },
      { name: 'Return Policy', path: '/return-policy' },
      { name: 'Refund Policy', path: '/refund-policy' },
      { name: 'Shipping Policy', path: '/shipping-policy' },
      { name: 'Cancellation Policy', path: '/cancellation-policy' },
    ]
  },
  {
    category: 'Support & Info',
    links: [
      { name: 'Contact Us', path: '/contact' },
      { name: 'About Us', path: '/about' },
      { name: 'Shopping Cart', path: '/cart' },
      { name: 'Checkout', path: '/checkout' },
    ]
  }
];

const SitemapPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Sitemap | TioraS Fashions Studio</title>
      </Helmet>
      
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full mt-20">
        <div className="mb-12 border-b border-border/50 pb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Sitemap</h1>
          <p className="text-muted-foreground mb-4">Last Updated: April 16, 2026</p>
          <div className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-lg">
            Note for crawlers: An XML sitemap is available at /sitemap.xml
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {sitemapData.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="text-xl font-bold text-foreground border-b border-border/50 pb-2">
                {section.category}
              </h2>
              <ul className="space-y-3">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link 
                      to={link.path} 
                      className="text-muted-foreground hover:text-primary hover:underline transition-colors text-sm font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SitemapPage;
