
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingCart, Loader2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';

import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import MockupPreview from '@/components/MockupPreview.jsx';

const DesignPreviewPage = () => {
  const { shareId } = useParams();
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedDesign = async () => {
      try {
        const records = await pb.collection('customDesigns').getFullList({
          filter: `shareId = "${shareId}"`,
          $autoCancel: false
        });
        
        if (records.length > 0) {
          setDesign(records[0]);
        } else {
          setError("This design link is invalid or has expired.");
        }
      } catch (err) {
        setError("Failed to load the shared design.");
      } finally {
        setLoading(false);
      }
    };
    
    if (shareId) fetchSharedDesign();
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary opacity-50" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !design) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
          <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Design Not Found</h1>
          <p className="text-muted-foreground mb-8">{error}</p>
          <Link to="/">
            <Button className="gradient-primary text-white rounded-full px-8">Back to Home</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Shared Design - TioraS Fashions</title>
      </Helmet>
      
      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-border/50 bg-card">
            <MockupPreview 
              productType={design.productType}
              productColor={design.productColor}
              layers={design.designData?.layers || []}
              activeLayerId={null}
              zoom={1}
              angle="front"
            />
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Custom {design.productType}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Someone shared their unique custom design with you from TioraS Fashions Studio. Like what you see? You can use this as a starting point to create your own!
            </p>
            
            <div className="bg-muted/30 border border-border/50 rounded-2xl p-6 mb-8 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Product Type</span>
                <span className="font-bold">{design.productType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Color</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: design.productColor }}></div>
                  <span className="font-bold uppercase text-xs">{design.productColor}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Design Elements</span>
                <span className="font-bold">{design.designData?.layers?.length || 0} layers</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/customize" className="flex-1">
                <Button className="w-full h-14 text-lg rounded-xl gradient-primary text-white shadow-lg">
                  Create Your Own
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DesignPreviewPage;
