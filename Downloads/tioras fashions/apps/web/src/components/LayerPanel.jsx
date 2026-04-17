
import React from 'react';
import { GripVertical, Eye, EyeOff, Lock, Unlock, Trash2, Type, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LayerPanel = ({ layers, activeLayerId, onSelectLayer, onUpdateLayer, onRemoveLayer, onReorder }) => {
  
  const moveLayer = (index, direction) => {
    if (index + direction < 0 || index + direction >= layers.length) return;
    const newLayers = [...layers];
    const temp = newLayers[index];
    newLayers[index] = newLayers[index + direction];
    newLayers[index + direction] = temp;
    onReorder(newLayers);
  };

  return (
    <div className="space-y-2">
      {layers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm bg-muted/20 rounded-xl border border-dashed border-border">
          No layers added yet.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {layers.map((layer, index) => (
            <div 
              key={layer.id}
              onClick={() => onSelectLayer(layer.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                activeLayerId === layer.id 
                  ? 'border-primary bg-primary/5 shadow-sm' 
                  : 'border-border bg-card hover:border-primary/30'
              }`}
            >
              <div className="flex flex-col gap-1 text-muted-foreground opacity-50 hover:opacity-100 transition-opacity">
                <button onClick={(e) => { e.stopPropagation(); moveLayer(index, -1); }} disabled={index === 0} className="hover:text-primary disabled:opacity-30">▲</button>
                <button onClick={(e) => { e.stopPropagation(); moveLayer(index, 1); }} disabled={index === layers.length - 1} className="hover:text-primary disabled:opacity-30">▼</button>
              </div>
              
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                {layer.type === 'text' ? <Type size={18} className="text-muted-foreground" /> : <ImageIcon size={18} className="text-muted-foreground" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {layer.type === 'text' ? (layer.text || 'Text Layer') : 'Image Layer'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {layer.type === 'text' ? layer.font : 'Uploaded image'}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateLayer(layer.id, { hidden: !layer.hidden });
                  }}
                >
                  {layer.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateLayer(layer.id, { locked: !layer.locked });
                  }}
                >
                  {layer.locked ? <Lock size={14} /> : <Unlock size={14} />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveLayer(layer.id);
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LayerPanel;
