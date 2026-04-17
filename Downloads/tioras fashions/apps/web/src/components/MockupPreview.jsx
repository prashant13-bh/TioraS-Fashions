
import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const MockupPreview = ({ 
  productType, 
  productColor, 
  layers, 
  activeLayerId,
  zoom,
  angle, // 'front', 'back'
}) => {
  // Simplified mockups based on product type and angle
  const getMockupUrl = () => {
    const base = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'; // Default white tee
    if (productType === 'Hoodie') return 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800';
    if (productType === 'Cap') return 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800';
    return base;
  };

  // Convert hex to HSL for realistic tinting, or just use mix-blend-mode
  const tintStyle = {
    backgroundColor: productColor,
    mixBlendMode: 'multiply',
    opacity: 0.8
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-muted/30">
      
      <div 
        className="relative transition-transform duration-300 ease-out flex items-center justify-center"
        style={{ transform: `scale(${zoom})` }}
      >
        {/* Base Mockup Image */}
        <div className="relative w-[400px] h-[500px] shadow-2xl rounded-2xl overflow-hidden bg-white">
          <img 
            src={getMockupUrl()} 
            alt="Product Mockup" 
            className="absolute inset-0 w-full h-full object-cover z-0" 
          />
          {/* Color Tint Overlay */}
          <div className="absolute inset-0 z-10 pointer-events-none" style={tintStyle}></div>
          <div className="absolute inset-0 z-20 pointer-events-none mix-blend-screen opacity-30 bg-gradient-to-tr from-white/10 to-transparent"></div>

          {/* Design Printable Area (approximate center chest bounding box) */}
          <div className="absolute top-[20%] left-[25%] right-[25%] bottom-[30%] z-30 border border-dashed border-primary/20 rounded">
            {/* Render Layers */}
            {layers.map(layer => {
              if (layer.hidden) return null;

              const isSelected = activeLayerId === layer.id;
              const transformStr = `translate(${layer.x}px, ${layer.y}px) rotate(${layer.rotation}deg) scale(${layer.scale || 1})`;

              return (
                <div
                  key={layer.id}
                  className={`absolute origin-center transition-all duration-200 ${isSelected ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                  style={{
                    transform: transformStr,
                    opacity: layer.opacity,
                    left: '50%',
                    top: '50%',
                    marginLeft: '-50%',
                    marginTop: '-50%',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    pointerEvents: 'none' // Prevent dragging here for simplicity, handled by controls
                  }}
                >
                  {layer.type === 'text' ? (
                    <span style={{ 
                      fontFamily: layer.font, 
                      fontSize: `${layer.fontSize}px`, 
                      color: layer.fill,
                      fontWeight: layer.fontWeight,
                      whiteSpace: 'pre-wrap',
                      textAlign: layer.align
                    }}>
                      {layer.text || 'Text'}
                    </span>
                  ) : (
                    <img 
                      src={layer.src} 
                      alt="Layer" 
                      className="max-w-full h-auto drop-shadow-md mix-blend-multiply"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockupPreview;
