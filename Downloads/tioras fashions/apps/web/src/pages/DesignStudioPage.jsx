
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, Menu, X } from 'lucide-react';
import { toast } from 'sonner';

import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ClothSelector from '@/components/ClothSelector.jsx';
import PrintingOptions from '@/components/PrintingOptions.jsx';
import EmbroideryOptions from '@/components/EmbroideryOptions.jsx';
import DesignCanvas from '@/components/DesignCanvas.jsx';
import DesignToolsSidebar from '@/components/DesignToolsSidebar.jsx';
import DesignOptionsSidebar from '@/components/DesignOptionsSidebar.jsx';
import PriceCalculator from '@/components/PriceCalculator.jsx';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/hooks/useCart.jsx';

const DesignStudioPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Cloth State
  const [selectedCloth, setSelectedCloth] = useState({
    clothId: 'tshirt',
    clothName: 'T-Shirt',
    clothPrice: 299,
    color: { name: 'White', hex: '#FFFFFF' },
    size: 'M',
    view: 'Front'
  });

  // Printing State
  const [printingOptions, setPrintingOptions] = useState({
    enabled: false,
    type: '',
    placement: '',
    size: 6,
    colors: [],
    price: 0,
    setupFee: 0
  });

  // Embroidery State
  const [embroideryOptions, setEmbroideryOptions] = useState({
    enabled: false,
    type: '',
    placement: '',
    size: 3,
    threadColor: null,
    stitchCount: 0,
    pricePerStitch: 0,
    setupFee: 0,
    price: 0
  });

  // Design State
  const [uploadedDesign, setUploadedDesign] = useState(null);
  const [designPosition, setDesignPosition] = useState({ x: 0, y: 0 });
  const [designRotation, setDesignRotation] = useState(0);

  // Additional Options
  const [additionalOptions, setAdditionalOptions] = useState({
    giftWrapping: false,
    giftMessage: false,
    expressShipping: false,
    insurance: false
  });

  // History for Undo/Redo
  const [undoHistory, setUndoHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);

  // Layers
  const [layers, setLayers] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState(null);

  // Mobile sidebar states
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  const handleClothChange = (clothData) => {
    setSelectedCloth(clothData);
  };

  const handlePrintingChange = (printingData) => {
    setPrintingOptions({
      enabled: true,
      ...printingData
    });
  };

  const handleEmbroideryChange = (embroideryData) => {
    setEmbroideryOptions({
      enabled: true,
      ...embroideryData
    });
  };

  const handleUploadDesign = (designData) => {
    setUploadedDesign(designData);
    toast.success('Design uploaded successfully');
  };

  const handleClearDesign = () => {
    setUploadedDesign(null);
    setDesignPosition({ x: 0, y: 0 });
    setDesignRotation(0);
  };

  const handleUndo = () => {
    if (undoHistory.length > 0) {
      // Implement undo logic
      toast.info('Undo action');
    }
  };

  const handleRedo = () => {
    if (redoHistory.length > 0) {
      // Implement redo logic
      toast.info('Redo action');
    }
  };

  const handleSaveDraft = (designName) => {
    // Save to PocketBase customDesigns collection
    const draftData = {
      name: designName,
      cloth: selectedCloth,
      printing: printingOptions,
      embroidery: embroideryOptions,
      design: uploadedDesign,
      savedAt: new Date().toISOString()
    };
    console.log('Saving draft:', draftData);
    toast.success(`Draft "${designName}" saved successfully`);
  };

  const handleDownload = (format) => {
    console.log(`Downloading mockup as ${format}`);
  };

  const handleShare = (method) => {
    console.log(`Sharing via ${method}`);
  };

  const handleAddToCart = () => {
    if (!uploadedDesign) {
      toast.error('Please upload a design first');
      return;
    }

    const cartItem = {
      id: `custom-${Date.now()}`,
      name: `Custom ${selectedCloth.clothName}`,
      price: calculateTotal(),
      quantity: 1,
      image: uploadedDesign,
      customization: {
        cloth: selectedCloth,
        printing: printingOptions.enabled ? printingOptions : null,
        embroidery: embroideryOptions.enabled ? embroideryOptions : null
      }
    };

    addToCart(cartItem);
    toast.success('Custom design added to cart');
    navigate('/cart');
  };

  const calculateTotal = () => {
    let total = selectedCloth.clothPrice;
    
    if (printingOptions.enabled) {
      total += printingOptions.price;
    }
    
    if (embroideryOptions.enabled) {
      total += embroideryOptions.price;
    }

    // Add additional options
    if (additionalOptions.giftWrapping) total += 50;
    if (additionalOptions.giftMessage) total += 25;
    if (additionalOptions.expressShipping) total += 200;
    if (additionalOptions.insurance) total += 50;

    // Add tax
    const tax = total * 0.18;
    total += tax;

    // Add shipping (if not express)
    if (!additionalOptions.expressShipping) {
      total += 100;
    }

    return total;
  };

  return (
    <div className="h-[100dvh] bg-background flex flex-col overflow-hidden">
      <Helmet>
        <title>Design Studio | TioraS Fashions</title>
        <meta name="description" content="Create your custom design with our professional design studio" />
      </Helmet>

      <Header />

      {/* Studio Header */}
      <div className="bg-card border-b border-border/50 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="touch-target"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
                Design Studio
              </h1>
              <p className="text-sm text-muted-foreground">Create your custom design</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="touch-target">
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Studio Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar - Desktop */}
        <aside className="hidden lg:block sidebar-collapsible">
          <div className="p-6 space-y-6">
            <ClothSelector 
              selectedCloth={selectedCloth.clothId}
              onClothChange={handleClothChange}
            />
            <PrintingOptions 
              onPrintingChange={handlePrintingChange}
              clothPrice={selectedCloth.clothPrice}
            />
            <EmbroideryOptions 
              onEmbroideryChange={handleEmbroideryChange}
              clothPrice={selectedCloth.clothPrice}
            />
          </div>
        </aside>

        {/* Left Sidebar - Mobile */}
        <Sheet open={leftSidebarOpen} onOpenChange={setLeftSidebarOpen}>
          <SheetTrigger asChild className="lg:hidden fixed bottom-20 left-4 z-40">
            <Button className="rounded-full w-14 h-14 shadow-lg gradient-primary text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[90vw] sm:w-[400px] p-0 overflow-y-auto">
            <div className="p-6 space-y-6">
              <ClothSelector 
                selectedCloth={selectedCloth.clothId}
                onClothChange={handleClothChange}
              />
              <PrintingOptions 
                onPrintingChange={handlePrintingChange}
                clothPrice={selectedCloth.clothPrice}
              />
              <EmbroideryOptions 
                onEmbroideryChange={handleEmbroideryChange}
                clothPrice={selectedCloth.clothPrice}
              />
            </div>
          </SheetContent>
        </Sheet>

        {/* Center Canvas */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <DesignCanvas
            clothType={selectedCloth.clothId}
            clothColor={selectedCloth.color.hex}
            view={selectedCloth.view}
            uploadedDesign={uploadedDesign}
            designPlacement={printingOptions.placement || embroideryOptions.placement}
            designSize={printingOptions.size || embroideryOptions.size}
            designRotation={designRotation}
            onDesignMove={setDesignPosition}
          />
        </main>

        {/* Right Sidebar - Desktop */}
        <aside className="hidden lg:block sidebar-collapsible">
          <div className="p-6 space-y-6">
            <DesignToolsSidebar
              onUploadDesign={handleUploadDesign}
              onClearDesign={handleClearDesign}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onSaveDraft={handleSaveDraft}
              onDownload={handleDownload}
              onShare={handleShare}
              onAddToCart={handleAddToCart}
              canUndo={undoHistory.length > 0}
              canRedo={redoHistory.length > 0}
              hasDesign={!!uploadedDesign}
            />
            <DesignOptionsSidebar
              layers={layers}
              selectedLayer={selectedLayer}
              onLayerSelect={setSelectedLayer}
            />
            <PriceCalculator
              clothPrice={selectedCloth.clothPrice}
              clothName={selectedCloth.clothName}
              printingPrice={printingOptions.enabled ? printingOptions.price : 0}
              printingType={printingOptions.type}
              printingSetupFee={printingOptions.setupFee}
              printingColorCount={printingOptions.colors?.length || 0}
              embroideryPrice={embroideryOptions.enabled ? embroideryOptions.price : 0}
              embroideryType={embroideryOptions.type}
              embroideryStitchCount={embroideryOptions.stitchCount}
              embroideryPricePerStitch={embroideryOptions.pricePerStitch}
              embroiderySetupFee={embroideryOptions.setupFee}
              additionalOptions={additionalOptions}
              onAdditionalOptionsChange={setAdditionalOptions}
            />
          </div>
        </aside>

        {/* Right Sidebar - Mobile */}
        <Sheet open={rightSidebarOpen} onOpenChange={setRightSidebarOpen}>
          <SheetTrigger asChild className="lg:hidden fixed bottom-20 right-4 z-40">
            <Button className="rounded-full w-14 h-14 shadow-lg gradient-primary text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[90vw] sm:w-[400px] p-0 overflow-y-auto">
            <div className="p-6 space-y-6">
              <DesignToolsSidebar
                onUploadDesign={handleUploadDesign}
                onClearDesign={handleClearDesign}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onSaveDraft={handleSaveDraft}
                onDownload={handleDownload}
                onShare={handleShare}
                onAddToCart={handleAddToCart}
                canUndo={undoHistory.length > 0}
                canRedo={redoHistory.length > 0}
                hasDesign={!!uploadedDesign}
              />
              <DesignOptionsSidebar
                layers={layers}
                selectedLayer={selectedLayer}
                onLayerSelect={setSelectedLayer}
              />
              <PriceCalculator
                clothPrice={selectedCloth.clothPrice}
                clothName={selectedCloth.clothName}
                printingPrice={printingOptions.enabled ? printingOptions.price : 0}
                printingType={printingOptions.type}
                printingSetupFee={printingOptions.setupFee}
                printingColorCount={printingOptions.colors?.length || 0}
                embroideryPrice={embroideryOptions.enabled ? embroideryOptions.price : 0}
                embroideryType={embroideryOptions.type}
                embroideryStitchCount={embroideryOptions.stitchCount}
                embroideryPricePerStitch={embroideryOptions.pricePerStitch}
                embroiderySetupFee={embroideryOptions.setupFee}
                additionalOptions={additionalOptions}
                onAdditionalOptionsChange={setAdditionalOptions}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Footer />
    </div>
  );
};

export default DesignStudioPage;
