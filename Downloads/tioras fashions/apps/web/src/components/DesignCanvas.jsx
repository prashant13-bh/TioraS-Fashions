
import React, { useRef, useEffect, useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, RotateCw, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const DesignCanvas = ({ 
  clothType, 
  clothColor, 
  view, 
  uploadedDesign, 
  designPlacement, 
  designSize,
  designRotation,
  onDesignMove 
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState([100]);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [designPosition, setDesignPosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);

  // Canvas dimensions (4:5 aspect ratio for clothing)
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 500;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    setLoading(true);

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background (cloth color)
    ctx.fillStyle = clothColor || '#ffffff';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw cloth outline/shape
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, CANVAS_WIDTH - 40, CANVAS_HEIGHT - 40);

    // Draw view indicator
    ctx.fillStyle = '#666';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(view.toUpperCase(), CANVAS_WIDTH / 2, 40);

    // Draw design if uploaded
    if (uploadedDesign) {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        
        // Calculate design position (center by default)
        const designX = designPosition.x || CANVAS_WIDTH / 2;
        const designY = designPosition.y || CANVAS_HEIGHT / 2;
        
        // Apply transformations
        ctx.translate(designX, designY);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(designSize / 100, designSize / 100);
        
        // Draw design
        const imgWidth = 150;
        const imgHeight = 150;
        ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
        
        ctx.restore();
        setLoading(false);
      };
      img.onerror = () => setLoading(false);
      img.src = uploadedDesign;
    } else {
      // Draw placeholder design area
      ctx.strokeStyle = '#D4AF37';
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2;
      const placeholderSize = 150;
      ctx.strokeRect(
        CANVAS_WIDTH / 2 - placeholderSize / 2,
        CANVAS_HEIGHT / 2 - placeholderSize / 2,
        placeholderSize,
        placeholderSize
      );
      ctx.setLineDash([]);
      
      // Draw placeholder text
      ctx.fillStyle = '#999';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Design Area', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      setLoading(false);
    }
  }, [clothType, clothColor, view, uploadedDesign, designPlacement, designSize, rotation, designPosition]);

  const handleZoomIn = () => {
    setZoom([Math.min(200, zoom[0] + 10)]);
  };

  const handleZoomOut = () => {
    setZoom([Math.max(50, zoom[0] - 10)]);
  };

  const handleRotateLeft = () => {
    setRotation((prev) => prev - 15);
  };

  const handleRotateRight = () => {
    setRotation((prev) => prev + 15);
  };

  const handleReset = () => {
    setZoom([100]);
    setRotation(0);
    setDesignPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (!uploadedDesign) return;
    setIsDragging(true);
    const rect = canvasRef.current.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left - designPosition.x,
      y: e.clientY - rect.top - designPosition.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !uploadedDesign) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragStart.x;
    const newY = e.clientY - rect.top - dragStart.y;
    setDesignPosition({ x: newX, y: newY });
    if (onDesignMove) onDesignMove({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (!uploadedDesign) return;
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - rect.left - designPosition.x,
      y: touch.clientY - rect.top - designPosition.y
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !uploadedDesign) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = touch.clientX - rect.left - dragStart.x;
    const newY = touch.clientY - rect.top - dragStart.y;
    setDesignPosition({ x: newX, y: newY });
    if (onDesignMove) onDesignMove({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = () => {
    handleReset();
  };

  return (
    <div className="flex flex-col h-full bg-[#f5f5f5] rounded-2xl p-6">
      {/* Canvas Container */}
      <div 
        ref={containerRef}
        className="flex-1 flex items-center justify-center mb-6 relative w-full aspect-[4/5] max-w-[400px] mx-auto rounded-xl touch-none"
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-xl">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onDoubleClick={handleDoubleClick}
          className="bg-white rounded-xl shadow-lg border-2 border-border/50 transition-transform touch-none origin-top-left"
          style={{ 
            transform: `scale(${zoom[0] / 100})`,
            cursor: uploadedDesign ? (isDragging ? 'grabbing' : 'grab') : 'default',
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Controls */}
      <div className="space-y-4 bg-card rounded-xl p-4 border border-border/50">
        {/* Zoom Controls */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-foreground">Zoom</span>
            <span className="text-sm font-bold text-primary">{zoom[0]}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoom[0] <= 50}
              className="h-11 w-11 rounded-lg shrink-0 touch-target"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Slider
              value={zoom}
              onValueChange={setZoom}
              min={50}
              max={200}
              step={10}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomIn}
              disabled={zoom[0] >= 200}
              className="h-11 w-11 rounded-lg shrink-0 touch-target"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Rotation Controls */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-foreground">Rotation</span>
            <span className="text-sm font-bold text-primary">{rotation}°</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRotateLeft}
              className="h-11 w-11 rounded-lg touch-target"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <div className="flex-1 text-center text-sm text-muted-foreground">
              Rotate ±15° per click
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRotateRight}
              className="h-11 w-11 rounded-lg touch-target"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Reset Button */}
        <Button
          variant="outline"
          onClick={handleReset}
          className="w-full h-11 rounded-lg touch-target"
        >
          <Maximize2 className="h-4 w-4 mr-2" />
          Reset View
        </Button>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-xs text-muted-foreground text-center space-y-1">
        <p>• Drag design to move • Double-click to reset</p>
        <p>• Pinch to zoom on mobile • Use controls for precise adjustments</p>
      </div>
    </div>
  );
};

export default DesignCanvas;
