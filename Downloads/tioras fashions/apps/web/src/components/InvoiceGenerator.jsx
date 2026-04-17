
import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import apiServerClient from '@/lib/apiServerClient';

const InvoiceGenerator = ({ orderId, variant = "outline", size = "sm", className = "" }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!orderId) return;
    setIsGenerating(true);
    
    try {
      // Backend automatically generates the PDF using its invoice endpoint
      const response = await apiServerClient.fetch(`/orders/${orderId}/invoice`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Failed to generate invoice');

      // Process the streamed PDF blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `TioraS-Invoice-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Invoice generation error:', error);
      toast.error('Failed to download invoice. Please try again later.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleDownload} 
      disabled={isGenerating}
      className={className}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" /> Download Invoice
        </>
      )}
    </Button>
  );
};

export default InvoiceGenerator;
