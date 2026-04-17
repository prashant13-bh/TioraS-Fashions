
import React, { useState } from 'react';
import { 
  Eye, EyeOff, Trash2, Copy, GripVertical, 
  AlignLeft, AlignCenter, AlignRight, AlignVerticalJustifyCenter,
  AlignHorizontalJustifyCenter, AlignVerticalJustifyStart, AlignVerticalJustifyEnd,
  AlignHorizontalSpaceBetween, Bold, Italic, Underline, FlipHorizontal, FlipVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const fonts = [
  'Arial', 'Helvetica', 'Times New Roman', 'Courier', 'Georgia', 
  'Verdana', 'Comic Sans MS', 'Impact', 'Trebuchet MS', 'Palatino'
];

const DesignOptionsSidebar = ({ 
  layers = [], 
  selectedLayer = null,
  onLayerSelect,
  onLayerToggle,
  onLayerDelete,
  onLayerDuplicate,
  onTextUpdate,
  onImageUpdate,
  onAlign
}) => {
  const [textContent, setTextContent] = useState('');
  const [fontSize, setFontSize] = useState([24]);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontColor, setFontColor] = useState('#000000');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [letterSpacing, setLetterSpacing] = useState([0]);
  const [lineHeight, setLineHeight] = useState([1.5]);
  const [imageSize, setImageSize] = useState([100]);
  const [imageX, setImageX] = useState(0);
  const [imageY, setImageY] = useState(0);
  const [imageRotation, setImageRotation] = useState([0]);
  const [imageOpacity, setImageOpacity] = useState([100]);

  const selectedLayerData = layers.find(l => l.id === selectedLayer);
  const isTextLayer = selectedLayerData?.type === 'text';
  const isImageLayer = selectedLayerData?.type === 'image';

  return (
    <div className="space-y-4 p-4 custom-scrollbar overflow-y-auto max-h-[calc(100vh-200px)]">
      <Accordion type="multiple" defaultValue={["layers"]} className="w-full">
        {/* Design Layers */}
        <AccordionItem value="layers" className="border-border/50">
          <AccordionTrigger className="hover:no-underline py-3 text-sm font-bold">
            Design Layers
          </AccordionTrigger>
          <AccordionContent className="space-y-2 pt-2">
            {layers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No layers yet</p>
            ) : (
              layers.map((layer) => (
                <div
                  key={layer.id}
                  onClick={() => onLayerSelect && onLayerSelect(layer.id)}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition-colors cursor-pointer ${
                    selectedLayer === layer.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border/50 hover:bg-muted/50'
                  }`}
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{layer.name}</p>
                    <p className="text-xs text-muted-foreground">{layer.type}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); onLayerToggle && onLayerToggle(layer.id); }}
                    className="h-8 w-8 shrink-0"
                  >
                    {layer.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); onLayerDuplicate && onLayerDuplicate(layer.id); }}
                    className="h-8 w-8 shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); onLayerDelete && onLayerDelete(layer.id); }}
                    className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Text Formatting */}
        {isTextLayer && (
          <AccordionItem value="text" className="border-border/50">
            <AccordionTrigger className="hover:no-underline py-3 text-sm font-bold">
              Text Formatting
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Text Content</Label>
                <Textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Enter text..."
                  className="text-foreground min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger className="text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fonts.map(font => (
                      <SelectItem key={font} value={font}>{font}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Font Size</Label>
                  <span className="text-sm text-muted-foreground">{fontSize[0]}px</span>
                </div>
                <Slider value={fontSize} onValueChange={setFontSize} min={8} max={72} step={1} />
              </div>

              <div className="space-y-2">
                <Label>Font Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                    className="flex-1 text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Text Alignment</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="h-11 w-11 touch-target">
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-11 w-11 touch-target">
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-11 w-11 touch-target">
                    <AlignRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Text Style</Label>
                <div className="flex gap-2">
                  <Button 
                    variant={isBold ? "default" : "outline"} 
                    size="icon" 
                    onClick={() => setIsBold(!isBold)}
                    className="h-11 w-11 touch-target"
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={isItalic ? "default" : "outline"} 
                    size="icon" 
                    onClick={() => setIsItalic(!isItalic)}
                    className="h-11 w-11 touch-target"
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={isUnderline ? "default" : "outline"} 
                    size="icon" 
                    onClick={() => setIsUnderline(!isUnderline)}
                    className="h-11 w-11 touch-target"
                  >
                    <Underline className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Letter Spacing</Label>
                  <span className="text-sm text-muted-foreground">{letterSpacing[0]}</span>
                </div>
                <Slider value={letterSpacing} onValueChange={setLetterSpacing} min={-2} max={2} step={0.1} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Line Height</Label>
                  <span className="text-sm text-muted-foreground">{lineHeight[0]}</span>
                </div>
                <Slider value={lineHeight} onValueChange={setLineHeight} min={1} max={2} step={0.1} />
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Image Properties */}
        {isImageLayer && (
          <AccordionItem value="image" className="border-border/50">
            <AccordionTrigger className="hover:no-underline py-3 text-sm font-bold">
              Image Properties
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Size</Label>
                  <span className="text-sm text-muted-foreground">{imageSize[0]}%</span>
                </div>
                <Slider value={imageSize} onValueChange={setImageSize} min={10} max={200} step={5} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Position X</Label>
                  <Input
                    type="number"
                    value={imageX}
                    onChange={(e) => setImageX(parseInt(e.target.value) || 0)}
                    className="text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Position Y</Label>
                  <Input
                    type="number"
                    value={imageY}
                    onChange={(e) => setImageY(parseInt(e.target.value) || 0)}
                    className="text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Rotation</Label>
                  <span className="text-sm text-muted-foreground">{imageRotation[0]}°</span>
                </div>
                <Slider value={imageRotation} onValueChange={setImageRotation} min={0} max={360} step={15} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Opacity</Label>
                  <span className="text-sm text-muted-foreground">{imageOpacity[0]}%</span>
                </div>
                <Slider value={imageOpacity} onValueChange={setImageOpacity} min={0} max={100} step={5} />
              </div>

              <div className="space-y-2">
                <Label>Flip</Label>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 touch-target">
                    <FlipHorizontal className="h-4 w-4 mr-2" />
                    Horizontal
                  </Button>
                  <Button variant="outline" className="flex-1 touch-target">
                    <FlipVertical className="h-4 w-4 mr-2" />
                    Vertical
                  </Button>
                </div>
              </div>

              <Button variant="destructive" className="w-full touch-target">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Image
              </Button>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Alignment Tools */}
        <AccordionItem value="alignment" className="border-border/50">
          <AccordionTrigger className="hover:no-underline py-3 text-sm font-bold">
            Alignment Tools
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-2">
            <div className="grid grid-cols-4 gap-2">
              <Button variant="outline" size="icon" className="h-11 w-11 touch-target" title="Align Left">
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-11 w-11 touch-target" title="Align Center">
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-11 w-11 touch-target" title="Align Right">
                <AlignRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-11 w-11 touch-target" title="Align Top">
                <AlignVerticalJustifyStart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-11 w-11 touch-target" title="Align Middle">
                <AlignVerticalJustifyCenter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-11 w-11 touch-target" title="Align Bottom">
                <AlignVerticalJustifyEnd className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-11 w-11 touch-target" title="Distribute Horizontally">
                <AlignHorizontalJustifyCenter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-11 w-11 touch-target" title="Distribute Vertically">
                <AlignHorizontalSpaceBetween className="h-4 w-4" />
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Spacing Tools */}
        <AccordionItem value="spacing" className="border-border/50">
          <AccordionTrigger className="hover:no-underline py-3 text-sm font-bold">
            Spacing Tools
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="space-y-3">
              <Label className="text-xs font-bold text-muted-foreground uppercase">Margin</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Top</Label>
                  <Input type="number" defaultValue={0} className="text-foreground h-9" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Right</Label>
                  <Input type="number" defaultValue={0} className="text-foreground h-9" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Bottom</Label>
                  <Input type="number" defaultValue={0} className="text-foreground h-9" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Left</Label>
                  <Input type="number" defaultValue={0} className="text-foreground h-9" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold text-muted-foreground uppercase">Padding</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Top</Label>
                  <Input type="number" defaultValue={0} className="text-foreground h-9" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Right</Label>
                  <Input type="number" defaultValue={0} className="text-foreground h-9" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Bottom</Label>
                  <Input type="number" defaultValue={0} className="text-foreground h-9" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Left</Label>
                  <Input type="number" defaultValue={0} className="text-foreground h-9" />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default DesignOptionsSidebar;
