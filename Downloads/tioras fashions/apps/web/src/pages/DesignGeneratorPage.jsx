
import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Sparkles, Wand2, Palette, Shirt, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import { useCart } from '@/hooks/useCart.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';

import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import IntegratedAiChat from '@/components/integrated-ai-chat.jsx';
import DesignPreview from '@/components/DesignPreview.jsx';
import DesignCustomizer from '@/components/DesignCustomizer.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PRODUCT_TYPES = [
  'T-shirt', 'Hoodie', 'Shirt', 'Cap', 'Bag', 
  'Saree Blouse', 'School/Company Uniforms', 
  'Mugs/Keychains/Gifts/Stickers', 'Blank Materials'
];

const DesignGeneratorPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const { addToCart } = useCart();

  // Form State
  const [productType, setProductType] = useState('T-shirt');
  const [promptText, setPromptText] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#1E3A8A');
  const [secondaryColor, setSecondaryColor] = useState('#D4AF37');
  
  // AI Integration State
  const [chatMessages, setChatMessages] = useState([]);
  const [externalPrompt, setExternalPrompt] = useState('');
  
  // Customization State
  const [customizationDetails, setCustomizationDetails] = useState({ unitPrice: 1499, totalPrice: 1499, quantity: 1 });
  const [isSaving, setIsSaving] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);

  // Extract latest generated image from chat history
  const generatedImage = useMemo(() => {
    for (let i = chatMessages.length - 1; i >= 0; i--) {
      if (chatMessages[i].images && chatMessages[i].images.length > 0) {
        return chatMessages[i].images[chatMessages[i].images.length - 1];
      }
    }
    return null;
  }, [chatMessages]);

  const handleGenerateClick = () => {
    if (!promptText.trim()) {
      toast.error('Please enter a design description');
      return;
    }

    const fullPrompt = `I want a design for a ${productType}. 
Colors: Primary (${primaryColor}), Secondary (${secondaryColor}).
Description: ${promptText}
Please generate a visual mockup for this design.`;

    setExternalPrompt(fullPrompt);
    toast.success('Prompt sent to AI Designer!');
  };

  const handleSaveDesign = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save designs');
      navigate('/login');
      return;
    }

    if (!generatedImage) {
      toast.error('No design generated yet');
      return;
    }

    setIsSaving(true);
    try {
      await pb.collection('generatedDesigns').create({
        userId: currentUser.id,
        designImage: generatedImage,
        productType: productType,
        prompt: promptText,
        colors: { primary: primaryColor, secondary: secondaryColor },
        price: customizationDetails.unitPrice
      }, { $autoCancel: false });
      
      toast.success('Design saved successfully!');
      navigate('/account/saved-designs');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save design. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddToCart = async () => {
    if (!generatedImage) {
      toast.error('Please generate a design first');
      return;
    }

    const customProduct = {
      id: `custom-${Date.now()}`,
      title: `Custom AI ${productType}`,
      image: generatedImage,
      price: customizationDetails.unitPrice,
      isCustom: true,
      description: `Custom design: ${promptText.substring(0, 50)}...`
    };

    const customVariant = {
      id: `var-${Date.now()}`,
      title: `${customizationDetails.size || 'L'} / ${customizationDetails.placement || 'Center'}`,
      price_in_cents: customizationDetails.unitPrice * 100,
      price_formatted: `₹${customizationDetails.unitPrice}`,
      inventory_quantity: 999,
      manage_inventory: false,
      currency_info: { symbol: '₹', code: 'INR' }
    };

    try {
      await addToCart(customProduct, customVariant, customizationDetails.quantity, 999);
      toast.success('Custom design added to cart!');
      navigate('/cart');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>AI Design Studio - TioraS Fashions Studio</title>
        <meta name="description" content="Create custom fashion and embroidery designs instantly using our AI Design Studio." />
      </Helmet>
      
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary font-bold text-sm mb-6 border border-secondary/30">
                <Sparkles size={16} /> Powered by Integrated AI
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Create Custom Designs with AI
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                Describe your vision, and our AI will generate stunning, production-ready designs for your premium apparel.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-12 gap-8 h-[calc(100vh-200px)] min-h-[800px]">
            
            {/* Left Column: Prompt Builder & Chat */}
            <div className="lg:col-span-5 flex flex-col gap-6 h-full">
              
              {/* Prompt Builder Card */}
              <div className="glass-panel rounded-2xl p-6 shrink-0">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
                  <Wand2 className="text-primary" size={20} /> Design Prompt
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground mb-1.5 block">Product Type</Label>
                    <Select value={productType} onValueChange={setProductType}>
                      <SelectTrigger className="bg-background border-border/60 h-11 rounded-xl text-foreground">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCT_TYPES.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground mb-1.5 block">Primary Color</Label>
                      <div className="flex items-center gap-3 bg-background border border-border/60 rounded-xl p-2 h-11">
                        <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-7 h-7 rounded cursor-pointer border-0 p-0 bg-transparent" />
                        <span className="text-sm font-medium text-foreground uppercase">{primaryColor}</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground mb-1.5 block">Secondary Color</Label>
                      <div className="flex items-center gap-3 bg-background border border-border/60 rounded-xl p-2 h-11">
                        <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-7 h-7 rounded cursor-pointer border-0 p-0 bg-transparent" />
                        <span className="text-sm font-medium text-foreground uppercase">{secondaryColor}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-muted-foreground mb-1.5 block">Design Description</Label>
                    <textarea 
                      value={promptText}
                      onChange={(e) => setPromptText(e.target.value)}
                      placeholder="e.g., Modern embroidery with Kannada script, gold accents, festival theme..."
                      className="w-full h-24 rounded-xl border border-border/60 bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <Button 
                    onClick={handleGenerateClick}
                    className="w-full gradient-primary text-white h-12 rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
                  >
                    <Sparkles className="mr-2 h-4 w-4" /> Generate Design
                  </Button>
                </div>
              </div>

              {/* AI Chat Component */}
              <div className="flex-1 glass-panel rounded-2xl overflow-hidden flex flex-col min-h-[400px]">
                <IntegratedAiChat 
                  onMessagesChange={setChatMessages} 
                  externalPrompt={externalPrompt}
                  onPromptSent={() => setExternalPrompt('')}
                />
              </div>
            </div>

            {/* Right Column: Preview & Customizer */}
            <div className="lg:col-span-7 flex flex-col h-full">
              {!showCustomizer ? (
                <motion.div 
                  key="preview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="h-full"
                >
                  <DesignPreview 
                    designImage={generatedImage}
                    productType={productType}
                    price={customizationDetails.unitPrice}
                    onSave={handleSaveDesign}
                    isSaving={isSaving}
                    onCustomize={() => setShowCustomizer(true)}
                    onAddToCart={handleAddToCart}
                  />
                </motion.div>
              ) : (
                <motion.div 
                  key="customizer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="h-full glass-panel rounded-2xl p-6 flex flex-col"
                >
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-border/50">
                    <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Refine Details
                    </h2>
                    <Button variant="ghost" onClick={() => setShowCustomizer(false)} className="text-muted-foreground hover:text-foreground">
                      Back to Preview
                    </Button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-2">
                    <DesignCustomizer 
                      basePrice={1499}
                      onChange={setCustomizationDetails}
                      initialValues={{ primaryColor }}
                    />
                  </div>

                  <div className="pt-6 mt-6 border-t border-border/50">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-muted-foreground font-medium">Total Price ({customizationDetails.quantity} items)</span>
                      <span className="text-3xl font-bold text-primary">₹{customizationDetails.totalPrice}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="h-12 rounded-xl border-border/80" onClick={handleSaveDesign} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Design'}
                      </Button>
                      <Button className="h-12 rounded-xl gradient-primary text-white shadow-md" onClick={handleAddToCart}>
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DesignGeneratorPage;
