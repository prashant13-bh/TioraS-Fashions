
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Undo, Redo, Save, Share2, Download, ArrowLeft, Layers as LayersIcon } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import apiServerClient from '@/lib/apiServerClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import Header from '@/components/Header.jsx';
import DesignToolsPanel from '@/components/DesignToolsPanel.jsx';
import MockupPreview from '@/components/MockupPreview.jsx';
import PricingCalculator from '@/components/PricingCalculator.jsx';
import ShareDesignModal from '@/components/ShareDesignModal.jsx';
import DesignTemplates from '@/components/DesignTemplates.jsx';

const CustomizationStudio = () => {
  const { designId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  
  // Studio State
  const [productType, setProductType] = useState('T-shirt');
  const [productColor, setProductColor] = useState('#ffffff');
  const [customizationType, setCustomizationType] = useState('Printing');
  const [size, setSize] = useState('L');
  const [quantity, setQuantity] = useState(1);
  const [rushDelivery, setRushDelivery] = useState(false);
  
  // Design Layers State
  const [layers, setLayers] = useState([]);
  const [activeLayerId, setActiveLayerId] = useState(null);
  
  // History State for Undo/Redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // View State
  const [zoom, setZoom] = useState(1);
  const [angle, setAngle] = useState('front');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareId, setShareId] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initial load logic if editing
  useEffect(() => {
    if (designId) {
      const fetchDesign = async () => {
        try {
          const record = await pb.collection('customDesigns').getOne(designId, { $autoCancel: false });
          if (record.userId !== currentUser?.id) {
            toast.error('Unauthorized access');
            navigate('/customize');
            return;
          }
          setProductType(record.productType);
          setProductColor(record.productColor);
          setSize(record.size || 'L');
          setLayers(record.designData.layers || []);
          setShareId(record.shareId || '');
          commitHistory(record.designData.layers || []);
        } catch (error) {
          toast.error('Design not found');
        }
      };
      fetchDesign();
    } else {
      commitHistory([]);
    }
  }, [designId, currentUser]);

  // History Management
  const commitHistory = useCallback((newLayers) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.stringify(newLayers));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setLayers(JSON.parse(history[prevIndex]));
      setHistoryIndex(prevIndex);
      setActiveLayerId(null);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setLayers(JSON.parse(history[nextIndex]));
      setHistoryIndex(nextIndex);
      setActiveLayerId(null);
    }
  };

  // Layer Operations
  const handleAddLayer = (layer) => {
    const newLayers = [...layers, layer];
    setLayers(newLayers);
    setActiveLayerId(layer.id);
    commitHistory(newLayers);
  };

  const handleUpdateLayer = (id, updates) => {
    const newLayers = layers.map(l => l.id === id ? { ...l, ...updates } : l);
    setLayers(newLayers);
    commitHistory(newLayers);
  };

  const handleRemoveLayer = (id) => {
    const newLayers = layers.filter(l => l.id !== id);
    setLayers(newLayers);
    if (activeLayerId === id) setActiveLayerId(null);
    commitHistory(newLayers);
  };

  const handleReorderLayers = (newLayers) => {
    setLayers(newLayers);
    commitHistory(newLayers);
  };

  const handleApplyTemplate = (designData) => {
    if (designData && designData.layers) {
      setLayers(designData.layers);
      commitHistory(designData.layers);
      setActiveLayerId(null);
      toast.success('Template applied!');
    }
  };

  // Actions
  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in to save designs');
      navigate('/login');
      return;
    }

    setIsSaving(true);
    try {
      const designData = { layers };
      const currentShareId = shareId || `tioras-${Math.random().toString(36).substring(2, 10)}`;
      
      const payload = {
        userId: currentUser.id,
        designData,
        productType,
        productColor,
        size,
        price: 1499, // Base price or from calculator
        shareId: currentShareId
      };

      if (designId) {
        await pb.collection('customDesigns').update(designId, payload, { $autoCancel: false });
        toast.success('Design updated!');
      } else {
        const record = await pb.collection('customDesigns').create(payload, { $autoCancel: false });
        setShareId(currentShareId);
        navigate(`/customize/${record.id}`, { replace: true });
        toast.success('Design saved!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to save design');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = async () => {
    if (!designId) {
      toast.info('Please save the design first to export as PDF.');
      return;
    }
    
    setIsExporting(true);
    toast.loading('Generating PDF...');
    
    try {
      const response = await apiServerClient.fetch('/designs/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ designId })
      });

      if (!response.ok) throw new Error('PDF Generation failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `TioraS-Design-${designId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.dismiss();
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[hsl(var(--studio-canvas))] overflow-hidden">
      <Helmet>
        <title>Customization Studio - TioraS Fashions</title>
      </Helmet>
      
      {/* Studio Header */}
      <header className="h-16 shrink-0 bg-card border-b border-border/50 flex items-center justify-between px-4 sm:px-6 shadow-sm z-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-bold text-lg leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>Design Studio</h1>
            <p className="text-xs text-muted-foreground">{designId ? 'Editing Saved Design' : 'New Design'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 mr-4 border-r border-border/50 pr-4">
            <Button variant="ghost" size="icon" onClick={undo} disabled={historyIndex <= 0} className="rounded-full h-9 w-9">
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={redo} disabled={historyIndex >= history.length - 1} className="rounded-full h-9 w-9">
              <Redo className="w-4 h-4" />
            </Button>
          </div>

          {designId && (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsShareModalOpen(true)} className="rounded-full h-9">
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPDF} disabled={isExporting} className="rounded-full h-9 hidden md:flex">
                <Download className="w-4 h-4 mr-2" /> PDF
              </Button>
            </>
          )}
          <Button size="sm" onClick={handleSave} disabled={isSaving} className="gradient-primary text-white rounded-full h-9 px-6 shadow-md">
            <Save className="w-4 h-4 mr-2" /> {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </header>

      {/* Studio Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Tools */}
        <aside className="w-full sm:w-[350px] lg:w-[400px] shrink-0 glass-panel border-r border-border/50 flex flex-col h-full z-10 overflow-hidden shadow-2xl sm:shadow-none">
          <div className="p-4 border-b border-border/50 bg-card/50">
            <Tabs defaultValue="tools" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-xl h-11">
                <TabsTrigger value="tools" className="rounded-lg text-xs font-bold uppercase tracking-wider">Editor</TabsTrigger>
                <TabsTrigger value="product" className="rounded-lg text-xs font-bold uppercase tracking-wider">Product</TabsTrigger>
              </TabsList>
              
              <div className="mt-4 h-[calc(100vh-160px)] overflow-y-auto pr-2 custom-scrollbar">
                <TabsContent value="tools" className="m-0 space-y-6">
                  <DesignToolsPanel 
                    layers={layers}
                    activeLayerId={activeLayerId}
                    setActiveLayerId={setActiveLayerId}
                    onAddLayer={handleAddLayer}
                    onUpdateLayer={handleUpdateLayer}
                    onRemoveLayer={handleRemoveLayer}
                    onReorderLayers={handleReorderLayers}
                  />
                  <DesignTemplates onSelectTemplate={handleApplyTemplate} />
                </TabsContent>
                
                <TabsContent value="product" className="m-0 space-y-6">
                  <div className="space-y-4 bg-card rounded-2xl border border-border/50 p-4">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Product Style</label>
                      <select value={productType} onChange={(e) => setProductType(e.target.value)} className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm">
                        <option value="T-shirt">Classic T-shirt</option>
                        <option value="Hoodie">Premium Hoodie</option>
                        <option value="Cap">Baseball Cap</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Garment Color</label>
                      <div className="flex gap-2">
                        {['#ffffff', '#000000', '#1E3A8A', '#D4AF37', '#e11d48'].map(c => (
                          <button 
                            key={c} 
                            onClick={() => setProductColor(c)} 
                            className={`w-8 h-8 rounded-full border-2 ${productColor === c ? 'border-primary ring-2 ring-primary/30 ring-offset-1' : 'border-border/50'}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                        <input type="color" value={productColor} onChange={e => setProductColor(e.target.value)} className="w-8 h-8 rounded-full p-0 border-0 cursor-pointer overflow-hidden" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Quantity</label>
                        <input type="number" min="1" value={quantity} onChange={e => setQuantity(parseInt(e.target.value)||1)} className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Method</label>
                        <select value={customizationType} onChange={(e) => setCustomizationType(e.target.value)} className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm">
                          <option value="Printing">Printing</option>
                          <option value="Embroidery">Embroidery</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <PricingCalculator 
                    productType={productType}
                    customizationType={customizationType}
                    layers={layers}
                    quantity={quantity}
                    rushDelivery={rushDelivery}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </aside>

        {/* Right Panel: Preview Area */}
        <main className="flex-1 relative flex items-center justify-center bg-[hsl(var(--studio-canvas))] overflow-hidden">
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} className="rounded-full shadow-sm bg-white/80 backdrop-blur text-black hover:bg-white">-</Button>
            <div className="bg-white/80 backdrop-blur px-3 flex items-center text-xs font-bold rounded-full shadow-sm text-black">{Math.round(zoom * 100)}%</div>
            <Button variant="secondary" size="sm" onClick={() => setZoom(z => Math.min(2.5, z + 0.25))} className="rounded-full shadow-sm bg-white/80 backdrop-blur text-black hover:bg-white">+</Button>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-white/80 backdrop-blur-md p-1.5 rounded-full shadow-lg border border-white/40 flex gap-1">
            <Button variant={angle === 'front' ? 'default' : 'ghost'} size="sm" onClick={() => setAngle('front')} className="rounded-full h-8 px-4 text-xs font-bold">Front</Button>
            <Button variant={angle === 'back' ? 'default' : 'ghost'} size="sm" onClick={() => setAngle('back')} className="rounded-full h-8 px-4 text-xs font-bold text-black">Back</Button>
          </div>

          <div className="w-full h-full relative" onClick={() => setActiveLayerId(null)}>
            <MockupPreview 
              productType={productType}
              productColor={productColor}
              layers={layers}
              activeLayerId={activeLayerId}
              zoom={zoom}
              angle={angle}
            />
          </div>
        </main>
      </div>

      <ShareDesignModal 
        shareId={shareId} 
        isOpen={isShareModalOpen} 
        onOpenChange={setIsShareModalOpen} 
      />
    </div>
  );
};

export default CustomizationStudio;
