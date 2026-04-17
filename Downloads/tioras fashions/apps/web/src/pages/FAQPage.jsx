
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Search, Phone, Mail, MessageCircle, Clock } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = {
    general: [
      { q: 'What is TioraS Fashions?', a: 'TioraS Fashions is a premium online fashion retailer offering curated collections from top brands at competitive prices.' },
      { q: 'Do you have physical stores?', a: 'Currently, we operate exclusively online to provide the best prices and widest selection.' },
      { q: 'How can I contact customer support?', a: 'You can reach us via email at support@tiorasfashions.com, phone at +91-XXXXXXXXXX, or through our live chat during business hours.' },
      { q: 'Are your products authentic?', a: 'Yes, all products are 100% authentic and sourced directly from authorized distributors and brands.' }
    ],
    orders: [
      { q: 'How do I place an order?', a: 'Browse our products, add items to cart, proceed to checkout, enter shipping details, and complete payment.' },
      { q: 'Can I modify my order after placing it?', a: 'Orders can be modified within 1 hour of placement. Contact support immediately for changes.' },
      { q: 'How do I cancel my order?', a: 'You can cancel orders before they ship from your account dashboard or by contacting support.' },
      { q: 'What payment methods do you accept?', a: 'We accept credit/debit cards, UPI, net banking, and digital wallets through Razorpay.' }
    ],
    shipping: [
      { q: 'What are the shipping charges?', a: 'Free shipping on orders above ₹500. Below that, shipping is ₹50 for standard delivery.' },
      { q: 'How long does delivery take?', a: 'Standard delivery takes 3-7 business days. Express delivery (1-3 days) is available for select locations.' },
      { q: 'Do you ship internationally?', a: 'Currently, we only ship within India. International shipping will be available soon.' },
      { q: 'How can I track my order?', a: 'You will receive a tracking number via email once your order ships. Track it from your account dashboard.' }
    ],
    returns: [
      { q: 'What is your return policy?', a: 'We offer a 7-day return policy for non-customized items. Customized items are final sale. See our Return Policy page for details.' },
      { q: 'How do I initiate a return?', a: 'Go to your account, select the order, click "Return Item", choose reason, and schedule pickup.' },
      { q: 'When will I receive my refund?', a: 'Refunds are processed within 5-7 business days after we receive and inspect the returned item.' },
      { q: 'Are there any items that cannot be returned?', a: 'Customized items, intimate wear, and sale items marked "Final Sale" cannot be returned.' }
    ],
    products: [
      { q: 'How do I find my size?', a: 'Use our size guide available on each product page. Measurements are provided for accurate fitting.' },
      { q: 'Are product colors accurate?', a: 'We strive for accuracy, but colors may vary slightly due to screen settings. Check product descriptions for details.' },
      { q: 'Do you restock sold-out items?', a: 'Popular items are restocked regularly. Sign up for restock notifications on product pages.' },
      { q: 'Can I request a product not in your catalog?', a: 'Yes, contact us with your request and we will try to source it for you.' }
    ],
    account: [
      { q: 'How do I create an account?', a: 'Click "Sign Up" in the header, enter your details, verify your email, and you are ready to shop.' },
      { q: 'I forgot my password. What should I do?', a: 'Click "Forgot Password" on the login page, enter your email, and follow the reset instructions.' },
      { q: 'Can I change my email address?', a: 'Yes, go to Account Settings and update your email. You will need to verify the new email.' },
      { q: 'How do I delete my account?', a: 'Contact support to request account deletion. This action is permanent and cannot be undone.' }
    ],
    payment: [
      { q: 'Is my payment information secure?', a: 'Yes, all payments are processed through Razorpay with industry-standard encryption and security.' },
      { q: 'Why was my payment declined?', a: 'Common reasons include insufficient funds, incorrect card details, or bank restrictions. Contact your bank for details.' },
      { q: 'Do you offer EMI options?', a: 'Yes, EMI options are available on orders above ₹3000 through select credit cards.' },
      { q: 'Can I use multiple payment methods?', a: 'Currently, only one payment method can be used per order.' }
    ]
  };

  const filterFAQs = (faqs) => {
    if (!searchQuery) return faqs;
    return faqs.filter(faq => 
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>FAQ | TioraS Fashions - Frequently Asked Questions</title>
        <meta name="description" content="Find answers to common questions about TioraS Fashions, orders, shipping, returns, and more." />
      </Helmet>
      <Header />
      
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] text-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold mb-6 text-[#D4AF37]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Frequently Asked Questions
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-white/80 max-w-3xl mx-auto mb-8"
            >
              Find quick answers to common questions
            </motion.p>
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAQs..."
                className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-[#D4AF37]"
              />
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-12 h-auto gap-2 bg-transparent">
                <TabsTrigger value="general" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#1a1a2e]">General</TabsTrigger>
                <TabsTrigger value="orders" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#1a1a2e]">Orders</TabsTrigger>
                <TabsTrigger value="shipping" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#1a1a2e]">Shipping</TabsTrigger>
                <TabsTrigger value="returns" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#1a1a2e]">Returns</TabsTrigger>
                <TabsTrigger value="products" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#1a1a2e]">Products</TabsTrigger>
                <TabsTrigger value="account" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#1a1a2e]">Account</TabsTrigger>
                <TabsTrigger value="payment" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#1a1a2e]">Payment</TabsTrigger>
              </TabsList>

              {Object.entries(faqCategories).map(([category, faqs]) => (
                <TabsContent key={category} value={category}>
                  <Accordion type="single" collapsible className="space-y-4">
                    {filterFAQs(faqs).map((faq, index) => (
                      <AccordionItem key={index} value={`${category}-${index}`} className="bg-card rounded-xl px-6 border-none shadow-sm">
                        <AccordionTrigger className="hover:no-underline text-left font-semibold py-6">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-6">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  {filterFAQs(faqs).length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      No FAQs found matching your search.
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Still Have Questions Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
                Still Have Questions?
              </h2>
              <p className="text-muted-foreground text-lg">
                Our support team is here to help. Reach out to us using any of the methods below.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Email</h3>
                <a href="mailto:support@tiorasfashions.com" className="text-primary hover:underline text-sm">
                  support@tiorasfashions.com
                </a>
              </div>

              <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Phone</h3>
                <a href="tel:+91XXXXXXXXXX" className="text-primary hover:underline text-sm">
                  +91-XXXXXXXXXX
                </a>
              </div>

              <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">WhatsApp</h3>
                <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                  +91-XXXXXXXXXX
                </a>
              </div>

              <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Business Hours</h3>
                <p className="text-muted-foreground text-sm">
                  PLACEHOLDER - Business Hours
                </p>
              </div>
            </div>

            <div className="mt-12 bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
              <p className="text-muted-foreground">
                We aim to respond to all inquiries within 24 business hours. For urgent issues, please call us during business hours or use WhatsApp for faster assistance.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQPage;
