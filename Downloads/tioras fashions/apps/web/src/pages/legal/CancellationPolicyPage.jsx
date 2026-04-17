
import React from 'react';
import LegalPageTemplate from '@/components/LegalPageTemplate.jsx';

const CancellationPolicyPage = () => {
  const sections = [
    {
      id: 'window',
      title: '1. Cancellation Window',
      content: `
        <p>You may cancel your order free of charge within <strong>24 hours</strong> of placing it, provided the order has not yet entered the processing or production phase.</p>
        <p>To request a cancellation, please email us immediately at support@tiorasfashions.com with your Order ID.</p>
      `
    },
    {
      id: 'custom-orders',
      title: '2. Custom and Personalized Orders',
      content: `
        <p>Because custom orders (items with uploaded designs, specific embroidery, or custom printing) are created specifically for you, they cannot be cancelled once production has begun.</p>
        <p>If you request a cancellation for a custom order after the initial 24-hour window but before it ships, we may charge a cancellation fee covering the cost of materials and labor already expended.</p>
      `
    },
    {
      id: 'after-dispatch',
      title: '3. Cancellations After Dispatch',
      content: `
        <p>Orders that have already been handed over to our shipping partners cannot be cancelled. In this scenario, you will need to receive the package and initiate a return process as outlined in our Return Policy.</p>
      `
    },
    {
      id: 'tioras-cancellations',
      title: '4. Cancellations by TioraS Fashions Studio',
      isAccordion: true,
      content: [
        {
          heading: 'Why might we cancel an order?',
          body: 'We reserve the right to cancel any order for reasons including, but not limited to: stock unavailability, errors in pricing or product information, suspected fraudulent activity, or if a custom design violates our Terms & Conditions (e.g., copyright infringement).'
        },
        {
          heading: 'Refund Process',
          body: 'If we cancel your order, you will be notified via email and a full refund will be issued immediately to your original payment method. Please refer to our Refund Policy for processing timelines.'
        }
      ]
    }
  ];

  return (
    <LegalPageTemplate 
      title="Cancellation Policy" 
      lastUpdated="February 10, 2026"
      sections={sections}
    />
  );
};

export default CancellationPolicyPage;
