
import React from 'react';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import LegalPageTemplate from '@/components/LegalPageTemplate.jsx';

const TermsConditionsPage = () => {
  const sections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      content: `
        <p>By accessing and using the TioraS Fashions Studio website and services, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
        <p>If you do not agree to abide by the above, please do not use this service.</p>
      `
    },
    {
      id: 'user-conduct',
      title: '2. User Conduct and Responsibilities',
      content: `
        <p>You agree to use our website and services only for lawful purposes. You are prohibited from:</p>
        <ul>
          <li>Uploading or sharing any designs that infringe upon third-party intellectual property rights.</li>
          <li>Using the service to create offensive, discriminatory, or illegal material.</li>
          <li>Attempting to interfere with network security or disrupting the operation of the site.</li>
        </ul>
      `
    },
    {
      id: 'custom-orders',
      title: '3. Custom Orders and Designs',
      isAccordion: true,
      content: [
        {
          heading: 'Intellectual Property',
          body: 'By uploading a design, you guarantee that you hold the rights to use that design. TioraS Fashions Studio assumes no responsibility for copyright or trademark infringements caused by customer-uploaded designs.'
        },
        {
          heading: 'Production Variations',
          body: 'Due to the nature of custom embroidery and printing, slight variations in color, placement, and sizing may occur. These variations are considered normal and are not grounds for a refund.'
        }
      ]
    },
    {
      id: 'pricing-payment',
      title: '4. Pricing and Payment',
      content: `
        <p>All prices are listed in Indian Rupees (INR/₹) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to change our pricing at any time without prior notice.</p>
        <p>Payment must be made in full before production begins on any custom orders. We use secure third-party payment gateways (such as Razorpay) to process transactions.</p>
      `
    },
    {
      id: 'governing-law',
      title: '5. Governing Law',
      content: `
        <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>
        <p>Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.</p>
      `
    }
  ];

  return (
    <div>
      <LegalPageTemplate 
        title="Terms & Conditions" 
        lastUpdated="April 17, 2026"
        sections={sections}
      />
      
      {/* Contact Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border/50">
        <h2 className="text-3xl font-bold mb-8 text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
          Contact Us
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          If you have any questions about our Terms & Conditions, please reach out to our support team:
        </p>
        
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground">Email</h3>
            </div>
            <a href="mailto:support@tiorasfashions.com" className="text-primary hover:underline font-medium">
              support@tiorasfashions.com
            </a>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground">Phone</h3>
            </div>
            <a href="tel:+91XXXXXXXXXX" className="text-primary hover:underline font-medium">
              +91-XXXXXXXXXX
            </a>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground">WhatsApp</h3>
            </div>
            <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
              +91-XXXXXXXXXX
            </a>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-foreground mb-3">Company Address</h3>
            <p className="text-muted-foreground text-sm">
              TioraS Fashions<br />
              PLACEHOLDER - Street Address<br />
              PLACEHOLDER - City, State, Postal Code<br />
              India
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditionsPage;
