
import React from 'react';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import LegalPageTemplate from '@/components/LegalPageTemplate.jsx';

const PrivacyPolicyPage = () => {
  const sections = [
    {
      id: 'information-collection',
      title: '1. Information We Collect',
      content: `
        <p>At TioraS Fashions Studio, we respect your privacy and are committed to protecting your personal data. We collect information that you provide directly to us when you use our services, create an account, place an order, or communicate with us.</p>
        <p><strong>Personal Data:</strong> This includes your name, email address, phone number, shipping address, and billing information.</p>
        <p><strong>Usage Data:</strong> We automatically collect certain information about your device and how you interact with our website, including your IP address, browser type, and pages visited.</p>
      `
    },
    {
      id: 'how-we-use',
      title: '2. How We Use Your Information',
      content: `
        <p>We use the information we collect for various purposes, including:</p>
        <ul>
          <li>Processing and fulfilling your orders</li>
          <li>Communicating with you about your order status</li>
          <li>Sending you marketing communications (if you have opted in)</li>
          <li>Improving our website and customer service</li>
          <li>Preventing fraud and ensuring security</li>
        </ul>
      `
    },
    {
      id: 'data-sharing',
      title: '3. Data Sharing and Third Parties',
      isAccordion: true,
      content: [
        {
          heading: 'Service Providers',
          body: 'We may share your data with trusted third-party service providers who assist us in operating our website, conducting our business, or servicing you, such as payment processors (e.g., Razorpay) and shipping partners.'
        },
        {
          heading: 'Legal Compliance',
          body: 'We may disclose your information when required by law, court order, or governmental regulation, or when we believe that disclosure is necessary to protect our rights, protect your safety or the safety of others, or investigate fraud.'
        }
      ]
    },
    {
      id: 'cookies',
      title: '4. Cookies and Tracking Technologies',
      content: `
        <p>We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.</p>
        <p>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.</p>
      `
    },
    {
      id: 'your-rights',
      title: '5. Your Data Rights',
      content: `
        <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
        <ul>
          <li>The right to access the personal data we hold about you.</li>
          <li>The right to request that we correct any inaccuracies in your data.</li>
          <li>The right to request the deletion of your personal data.</li>
        </ul>
        <p>To exercise any of these rights, please contact us using the information provided below.</p>
      `
    }
  ];

  return (
    <div>
      <LegalPageTemplate 
        title="Privacy Policy" 
        lastUpdated="April 17, 2026"
        sections={sections}
      />
      
      {/* Contact Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border/50">
        <h2 className="text-3xl font-bold mb-8 text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
          Contact Us
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          If you have any questions about our Privacy Policy or how we handle your data, please reach out to our support team:
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

export default PrivacyPolicyPage;
