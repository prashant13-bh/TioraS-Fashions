
import React from 'react';
import LegalPageTemplate from '@/components/LegalPageTemplate.jsx';

const RefundPolicyPage = () => {
  const sections = [
    {
      id: 'refund-timeline',
      title: '1. Refund Timeline',
      content: `
        <p>Once your return is received and inspected by our quality control team, we will send you an email to notify you of the approval or rejection of your refund.</p>
        <p>If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment. Please allow <strong>13 to 22 business days</strong> for the refund to reflect in your bank account, depending on your bank or credit card issuer.</p>
      `
    },
    {
      id: 'late-refunds',
      title: '2. Late or Missing Refunds',
      content: `
        <p>If you haven’t received a refund within the 13-22 business day window, please take the following steps:</p>
        <ol>
          <li>Check your bank account again carefully.</li>
          <li>Contact your credit card company or bank, as it may take some time before your refund is officially posted.</li>
          <li>If you’ve done all of this and you still have not received your refund, please contact us at support@tiorasfashions.com.</li>
        </ol>
      `
    },
    {
      id: 'partial-refunds',
      title: '3. Partial Refunds',
      isAccordion: true,
      content: [
        {
          heading: 'When do we issue partial refunds?',
          body: 'Partial refunds may be granted if an item is returned not in its original condition, is damaged, or is missing parts for reasons not due to our error. We may also issue a partial refund if the item is returned more than 30 days after delivery.'
        },
        {
          heading: 'Shipping Costs',
          body: 'Original shipping costs are non-refundable. If you receive a refund, the cost of original shipping will be deducted from your refund amount unless the return is due to a defect or our error.'
        }
      ]
    },
    {
      id: 'cancellation-refunds',
      title: '4. Refunds for Cancellations',
      content: `
        <p>If an order is successfully cancelled before processing has begun, a full refund will be issued. Please refer to our Cancellation Policy for specific timelines regarding order cancellations.</p>
      `
    }
  ];

  return (
    <LegalPageTemplate 
      title="Refund Policy" 
      lastUpdated="January 20, 2026"
      sections={sections}
    />
  );
};

export default RefundPolicyPage;
