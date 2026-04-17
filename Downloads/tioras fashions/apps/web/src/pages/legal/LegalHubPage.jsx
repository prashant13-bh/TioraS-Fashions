
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, FileText, RefreshCcw, CreditCard, Truck, XCircle, Search, ArrowRight } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Input } from '@/components/ui/input';

const legalPages = [
  {
    id: 'privacy',
    title: 'Privacy Policy',
    description: 'Learn how we collect, use, and protect your personal data and privacy rights.',
    icon: Shield,
    path: '/privacy-policy',
    updated: 'April 10, 2026'
  },
  {
    id: 'terms',
    title: 'Terms & Conditions',
    description: 'Read the rules, guidelines, and agreements for using our website and services.',
    icon: FileText,
    path: '/terms-conditions',
    updated: 'March 15, 2026'
  },
  {
    id: 'return',
    title: 'Return Policy',
    description: 'Understand our 30-day return window and the eligibility criteria for returning items.',
    icon: RefreshCcw,
    path: '/return-policy',
    updated: 'January 20, 2026'
  },
  {
    id: 'refund',
    title: 'Refund Policy',
    description: 'Find out about our 13-22 business day refund timeline and processing details.',
    icon: CreditCard,
    path: '/refund-policy',
    updated: 'January 20, 2026'
  },
  {
    id: 'shipping',
    title: 'Shipping Policy',
    description: 'Details on our 1-2 day processing, Pan-India shipping, rates, and delivery times.',
    icon: Truck,
    path: '/shipping-policy',
    updated: 'February 10, 2026'
  },
  {
    id: 'cancellation',
    title: 'Cancellation Policy',
    description: 'Guidelines on how to cancel an order and exceptions for custom designs.',
    icon: XCircle,
    path: '/cancellation-policy',
    updated: 'February 10, 2026'
  }
];

const LegalHubPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPages = legalPages.filter(page => 
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    page.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Legal Hub | TioraS Fashions Studio</title>
      </Helmet>
      
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full mt-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Legal Hub
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Everything you need to know about our policies, your rights, and how we handle your data and orders.
          </p>
          
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search policies..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 rounded-full bg-card shadow-sm border-border/50 text-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {filteredPages.map((page, index) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link to={page.path} className="block h-full">
                <div className="premium-card h-full p-8 hover:-translate-y-1 hover:shadow-lg transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                    <page.icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{page.title}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {page.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-4">
                    <span className="text-xs text-muted-foreground">Updated: {page.updated}</span>
                    <ArrowRight className="w-4 h-4 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          
          {filteredPages.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No policies found matching your search.
            </div>
          )}
        </div>

        <section className="bg-muted/30 rounded-3xl p-8 md:p-12 text-center border border-border/50">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Still have questions?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            If you couldn't find the answer in our legal documents, our support team is ready to assist you with any inquiries.
          </p>
          <a href="mailto:support@tiorasfashions.com" className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-sm">
            Contact Support
          </a>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default LegalHubPage;
