
import React from 'react';
import { Mail, Phone, MessageCircle, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import LegalPageTemplate from '@/components/LegalPageTemplate.jsx';

const ReturnPolicyPage = () => {
  const sections = [
    {
      id: 'return-eligibility',
      title: '1. Return Eligibility',
      content: `
        <p><strong>Non-Customized Products:</strong> Items that have not been customized (embroidered, printed, or personalized) can be returned within <strong>7 days</strong> of delivery, provided they are unused, unwashed, and in original packaging with all tags attached.</p>
        <p><strong>Customized Products:</strong> <strong>NO RETURNS</strong> are accepted on any customized items including embroidered designs, screen-printed graphics, DTG prints, or any personalized modifications. These are considered final sale items.</p>
      `
    },
    {
      id: 'return-process',
      title: '2. Return Process',
      isAccordion: true,
      content: [
        {
          heading: 'Step 1: Initiate Return',
          body: 'Contact our support team at support@tiorasfashions.com or call +91-XXXXXXXXXX within 7 days of delivery. Provide your order number, reason for return, and clear photos of the item (if applicable).'
        },
        {
          heading: 'Step 2: Approval',
          body: 'Our team will review your return request and verify that the item meets our return criteria. You will receive approval confirmation via email within 24-48 hours. Defective items are approved immediately.'
        },
        {
          heading: 'Step 3: Ship the Item',
          body: 'Once approved, pack the item securely in its original packaging. For defective items, we will provide a prepaid return label. For other returns, standard return shipping costs apply (see section 3).'
        },
        {
          heading: 'Step 4: Refund Processing',
          body: 'Upon receipt and inspection of your returned item, we will process your refund. Refunds are credited to your original payment method within 5-7 business days.'
        }
      ]
    },
    {
      id: 'return-shipping',
      title: '3. Return Shipping Costs',
      content: `
        <p><strong>Defective or Incorrect Items:</strong> We cover all return shipping costs. A prepaid return label will be provided.</p>
        <p><strong>Non-Defective Returns:</strong> Return shipping costs are the responsibility of the customer. Standard return shipping typically costs ₹50-150 depending on your location.</p>
        <p><strong>Return Address:</strong> You will receive the return address and instructions via email upon approval of your return request.</p>
      `
    },
    {
      id: 'refund-details',
      title: '4. Refund Amount Details',
      content: `
        <p><strong>Full Refund:</strong> For defective or incorrect items, you will receive a full refund including the original shipping cost.</p>
        <p><strong>Partial Refund:</strong> For non-defective returns, the refund amount will be the product price minus the original shipping cost. Return shipping costs are not refunded.</p>
        <p><strong>Refund Timeline:</strong> Refunds are processed within 5-7 business days after we receive and inspect your returned item. Please allow an additional 2-3 business days for the amount to appear in your account.</p>
      `
    },
    {
      id: 'non-returnable',
      title: '5. Non-Returnable Items',
      content: `
        <ul>
          <li><strong>All Customized Products:</strong> Embroidered items, screen-printed designs, DTG prints, and any personalized modifications cannot be returned under any circumstances.</li>
          <li>Items marked as "Final Sale" or "Clearance"</li>
          <li>Gift cards and digital products</li>
          <li>Items that have been worn, washed, or damaged by the customer</li>
          <li>Items without original tags or packaging</li>
        </ul>
      `
    },
    {
      id: 'exceptions',
      title: '6. Exceptions and Special Cases',
      content: `
        <p><strong>Defective Customized Items:</strong> If a customized item arrives with a manufacturing defect (e.g., incorrect design, poor embroidery quality, color mismatch from approved proof), we will offer a replacement or full refund at our discretion.</p>
        <p><strong>Damaged in Transit:</strong> If your item arrives damaged, contact us within 48 hours with photos. We will arrange a replacement or refund and cover all return shipping costs.</p>
      `
    },
    {
      id: 'contact-us',
      title: '7. Contact Us',
      content: `
        <p>If you have any questions about our return policy or need to initiate a return, please reach out to our support team:</p>
      `
    }
  ];

  return (
    <div>
      <LegalPageTemplate 
        title="Return Policy" 
        lastUpdated="April 17, 2026"
        sections={sections.slice(0, -1)}
      />
      
      {/* Contact Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border/50">
        <h2 className="text-3xl font-bold mb-8 text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
          Contact Us
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          If you have any questions about our return policy or need to initiate a return, please reach out to our support team using any of the methods below:
        </p>
        
        <div className="grid sm:grid-cols-2 gap-6">
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
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground">Business Hours</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Monday - Friday<br />
              10 AM - 6 PM IST
            </p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-muted/30 rounded-2xl border border-border/50">
          <p className="text-sm text-muted-foreground">
            <strong>Response Time:</strong> We aim to respond to all inquiries within 24 business hours. For urgent issues, please call us during business hours or use WhatsApp for faster assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;
