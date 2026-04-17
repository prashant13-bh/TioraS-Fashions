
import React from 'react';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import LegalPageTemplate from '@/components/LegalPageTemplate.jsx';

const ShippingPolicyPage = () => {
  const sections = [
    {
      id: 'processing-time',
      title: '1. Order Processing Time',
      content: `
        <p>At TioraS Fashions Studio, we aim to dispatch your orders as quickly as possible. All standard orders require <strong>1 to 2 business days</strong> for processing before they are shipped.</p>
        <p><em>Note:</em> Custom and personalized orders may require an additional 3-5 business days for production, digitizing, and quality checks.</p>
      `
    },
    {
      id: 'shipping-coverage',
      title: '2. Shipping Coverage',
      content: `
        <p>We are proud to offer <strong>Pan-India shipping</strong>. We deliver to almost all pin codes across India using trusted courier partners to ensure your package arrives safely.</p>
      `
    },
    {
      id: 'shipping-rates',
      title: '3. Shipping Rates & Delivery Estimates',
      isAccordion: true,
      content: [
        {
          heading: 'Standard Shipping',
          body: 'Our standard shipping usually takes 4-7 business days for delivery after dispatch. Rates are calculated at checkout based on your location and order weight.'
        },
        {
          heading: 'Express Shipping',
          body: 'For urgent requirements, we offer express shipping which takes 2-4 business days after dispatch. Additional charges apply and will be displayed at checkout.'
        },
        {
          heading: 'Free Shipping',
          body: 'We occasionally offer free standard shipping on orders above a certain value (e.g., ₹1,499). Please check our website banner for current promotions.'
        }
      ]
    },
    {
      id: 'tracking',
      title: '4. Order Tracking',
      content: `
        <p>Once your order has been dispatched, you will receive a shipment confirmation email and SMS containing your tracking number and a link to track your package. You can also track your order directly from your Account Dashboard.</p>
      `
    }
  ];

  return (
    <div>
      <LegalPageTemplate 
        title="Shipping Policy" 
        lastUpdated="April 17, 2026"
        sections={sections}
      />
      
      {/* Contact Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border/50">
        <h2 className="text-3xl font-bold mb-8 text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
          Contact Us
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          If you have any questions about our shipping policy, please reach out to our support team:
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

export default ShippingPolicyPage;
