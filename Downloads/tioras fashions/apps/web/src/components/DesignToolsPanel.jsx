
import React from 'react';
import { Type, Upload, Layers, PenTool, Palette, MapPin } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import LayerPanel from './LayerPanel';

const DesignToolsPanel = ({ 
  layers, 
  activeLayerId, 
  onAddLayer, 
  onUpdateLayer, 
  onRemoveLayer, 
  onReorderLayers,
  setActiveLayerId 
}) => {
  const activeLayer = layers.find(l => l.id === activeLayerId);

  const handleAddText = () => {
    const newLayer = {
      id: `layer-${Date.now()}`,
      type: 'text',
      text: 'Double click to edit',
      font: 'Playfair Display',
      fontSize: 32,
      fill: '#D4AF37',
      fontWeight: '600',
      align: 'center',
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      opacity: 1,
      hidden: false,
      locked: false
    };
    onAddLayer(newLayer);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const newLayer = {
      id: `layer-${Date.now()}`,
      type: 'image',
      src: url,
      x: 0,
      y: 0,
      rotation: 0,
      scale: 0.5,
      opacity: 1,
      hidden: false,
      locked: false
    };
    onAddLayer(newLayer);
  };

  const updateActive = (updates) => {
    if (!activeLayerId) return;
    onUpdateLayer(activeLayerId, updates);
  };

  return (
    <Accordion type="single" collapsible defaultValue="layers" className="w-full">
      
      {/* Upload & Add Section */}
      <AccordionItem value="add" className="border-border/50">
        <AccordionTrigger className="hover:no-underline hover:bg-muted/50 px-4 rounded-xl font-bold font-['Playfair_Display']">
          <div className="flex items-center gap-2"><Upload size={18} className="text-primary"/> Add Elements</div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-20 flex flex-col gap-2 rounded-xl" onClick={handleAddText}>
              <Type size={20} className="text-muted-foreground" />
              <span>Add Text</span>
            </Button>
            <div className="relative">
              <input type="file" accept="image/png, image/jpeg, image/svg+xml" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageUpload} />
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 rounded-xl pointer-events-none">
                <Upload size={20} className="text-muted-foreground" />
                <span>Upload Image</span>
              </Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Layers Section */}
      <AccordionItem value="layers" className="border-border/50">
        <AccordionTrigger className="hover:no-underline hover:bg-muted/50 px-4 rounded-xl font-bold font-['Playfair_Display']">
          <div className="flex items-center gap-2"><Layers size={18} className="text-primary"/> Design Layers</div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-2">
          <LayerPanel 
            layers={layers} 
            activeLayerId={activeLayerId}
            onSelectLayer={setActiveLayerId}
            onUpdateLayer={onUpdateLayer}
            onRemoveLayer={onRemoveLayer}
            onReorder={onReorderLayers}
          />
        </AccordionContent>
      </AccordionItem>

      {/* Properties Section (only visible if layer selected) */}
      {activeLayer && !activeLayer.locked && (
        <AccordionItem value="properties" className="border-border/50 border-t-2 border-t-primary/20">
          <AccordionTrigger className="hover:no-underline hover:bg-muted/50 px-4 rounded-xl font-bold font-['Playfair_Display']">
            <div className="flex items-center gap-2"><PenTool size={18} className="text-primary"/> Edit {activeLayer.type === 'text' ? 'Text' : 'Image'}</div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2 space-y-5">
            
            {activeLayer.type === 'text' && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Text Content</Label>
                  <Input value={activeLayer.text} onChange={(e) => updateActive({ text: e.target.value })} className="bg-background" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Font Family</Label>
                    <select 
                      value={activeLayer.font} 
                      onChange={(e) => updateActive({ font: e.target.value })}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    >
                      <option value="Playfair Display">Playfair Display</option>
                      <option value="Lato">Lato</option>
                      <option value="Arial">Arial</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Color</Label>
                    <div className="flex items-center gap-2 border border-input rounded-md p-1 bg-background h-10">
                      <input type="color" value={activeLayer.fill} onChange={(e) => updateActive({ fill: e.target.value })} className="w-8 h-8 rounded border-0 p-0 cursor-pointer" />
                      <span className="text-xs uppercase">{activeLayer.fill}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex justify-between">
                    <span>Font Size</span>
                    <span className="text-foreground">{activeLayer.fontSize}px</span>
                  </Label>
                  <Slider value={[activeLayer.fontSize]} min={8} max={120} step={1} onValueChange={(v) => updateActive({ fontSize: v[0] })} />
                </div>
              </>
            )}

            <div className="space-y-3 pt-4 border-t border-border/50">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2"><MapPin size={14} /> Transform</Label>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground"><span>Scale</span><span>{activeLayer.scale.toFixed(2)}x</span></div>
                  <Slider value={[activeLayer.scale]} min={0.1} max={3} step={0.05} onValueChange={(v) => updateActive({ scale: v[0] })} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground"><span>Rotation</span><span>{activeLayer.rotation}°</span></div>
                  <Slider value={[activeLayer.rotation]} min={0} max={360} step={1} onValueChange={(v) => updateActive({ rotation: v[0] })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Position X</Label>
                    <Input type="number" value={activeLayer.x} onChange={(e) => updateActive({ x: parseInt(e.target.value) || 0 })} className="h-8 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Position Y</Label>
                    <Input type="number" value={activeLayer.y} onChange={(e) => updateActive({ y: parseInt(e.target.value) || 0 })} className="h-8 text-xs" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border/50">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2"><Palette size={14} /> Effects</Label>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground"><span>Opacity</span><span>{Math.round(activeLayer.opacity * 100)}%</span></div>
                <Slider value={[activeLayer.opacity]} min={0} max={1} step={0.05} onValueChange={(v) => updateActive({ opacity: v[0] })} />
              </div>
            </div>

          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
};

export default DesignToolsPanel;
