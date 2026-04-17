
import React, { useState, useRef } from 'react';
import { 
  Upload, Library, Layers, Trash2, Undo2, Redo2, 
  Save, Download, Share2, ShoppingCart 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const DesignToolsSidebar = ({ 
  onUploadDesign, 
  onClearDesign, 
  onUndo, 
  onRedo, 
  onSaveDraft, 
  onDownload, 
  onShare, 
  onAddToCart,
  canUndo = false,
  canRedo = false,
  hasDesign = false
}) => {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [designName, setDesignName] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10 MB');
        return;
      }
      const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        toast.error('Only PNG, JPG, SVG files are allowed');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (onUploadDesign) onUploadDesign(event.target.result);
        toast.success('Design uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDraft = () => {
    if (!designName.trim()) {
      toast.error('Please enter a design name');
      return;
    }
    if (onSaveDraft) onSaveDraft(designName);
    setSaveDialogOpen(false);
    setDesignName('');
    toast.success('Draft saved successfully');
  };

  const handleDownload = (format) => {
    if (onDownload) onDownload(format);
    setDownloadDialogOpen(false);
    toast.success(`Downloading as ${format.toUpperCase()}...`);
  };

  const handleShare = (method) => {
    if (onShare) onShare(method);
    setShareDialogOpen(false);
    if (method === 'link') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    } else {
      toast.success(`Sharing via ${method}...`);
    }
  };

  const handleClear = () => {
    if (onClearDesign) onClearDesign();
    setClearDialogOpen(false);
    toast.success('Design cleared');
  };

  return (
    <div className="space-y-2 p-4">
      {/* Upload Design */}
      <Button
        onClick={() => fileInputRef.current?.click()}
        className="w-full h-12 justify-start gap-3 rounded-xl bg-background text-foreground hover:bg-muted border border-border/50"
      >
        <Upload className="w-5 h-5" />
        <span className="font-medium">Upload Design</span>
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.svg"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Browse Library */}
      <Button
        onClick={() => toast.info('Design library coming soon')}
        className="w-full h-12 justify-start gap-3 rounded-xl bg-background text-foreground hover:bg-muted border border-border/50"
      >
        <Library className="w-5 h-5" />
        <span className="font-medium">Browse Library</span>
      </Button>

      {/* Templates */}
      <Button
        onClick={() => toast.info('Templates coming soon')}
        className="w-full h-12 justify-start gap-3 rounded-xl bg-background text-foreground hover:bg-muted border border-border/50"
      >
        <Layers className="w-5 h-5" />
        <span className="font-medium">Templates</span>
      </Button>

      {/* Clear Design */}
      <Button
        onClick={() => setClearDialogOpen(true)}
        disabled={!hasDesign}
        className="w-full h-12 justify-start gap-3 rounded-xl bg-background text-foreground hover:bg-muted border border-border/50 disabled:opacity-50"
      >
        <Trash2 className="w-5 h-5" />
        <span className="font-medium">Clear Design</span>
      </Button>

      {/* Undo/Redo */}
      <div className="flex gap-2">
        <Button
          onClick={onUndo}
          disabled={!canUndo}
          variant="outline"
          size="icon"
          className="h-11 w-11 rounded-lg touch-target disabled:opacity-50"
          title="Undo"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          onClick={onRedo}
          disabled={!canRedo}
          variant="outline"
          size="icon"
          className="h-11 w-11 rounded-lg touch-target disabled:opacity-50"
          title="Redo"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Save Draft */}
      <Button
        onClick={() => setSaveDialogOpen(true)}
        disabled={!hasDesign}
        className="w-full h-12 justify-start gap-3 rounded-xl bg-background text-foreground hover:bg-muted border border-border/50 disabled:opacity-50"
      >
        <Save className="w-5 h-5" />
        <span className="font-medium">Save Draft</span>
      </Button>

      {/* Download */}
      <Button
        onClick={() => setDownloadDialogOpen(true)}
        disabled={!hasDesign}
        className="w-full h-12 justify-start gap-3 rounded-xl bg-background text-foreground hover:bg-muted border border-border/50 disabled:opacity-50"
      >
        <Download className="w-5 h-5" />
        <span className="font-medium">Download</span>
      </Button>

      {/* Share */}
      <Button
        onClick={() => setShareDialogOpen(true)}
        disabled={!hasDesign}
        className="w-full h-12 justify-start gap-3 rounded-xl bg-background text-foreground hover:bg-muted border border-border/50 disabled:opacity-50"
      >
        <Share2 className="w-5 h-5" />
        <span className="font-medium">Share</span>
      </Button>

      {/* Add to Cart */}
      <Button
        onClick={onAddToCart}
        disabled={!hasDesign}
        className="w-full h-12 justify-start gap-3 rounded-xl gradient-primary text-white shadow-md disabled:opacity-50"
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="font-medium">Add to Cart</span>
      </Button>

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Design Draft</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="design-name">Design Name</Label>
              <Input
                id="design-name"
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                placeholder="My Custom Design"
                className="text-foreground"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveDraft} className="gradient-primary text-white">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Download Dialog */}
      <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download Mockup</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <Button onClick={() => handleDownload('png')} className="w-full justify-start" variant="outline">
              Download as PNG
            </Button>
            <Button onClick={() => handleDownload('pdf')} className="w-full justify-start" variant="outline">
              Download as PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Design</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <Button onClick={() => handleShare('link')} className="w-full justify-start" variant="outline">
              Copy Link
            </Button>
            <Button onClick={() => handleShare('email')} className="w-full justify-start" variant="outline">
              Share via Email
            </Button>
            <Button onClick={() => handleShare('social')} className="w-full justify-start" variant="outline">
              Share on Social Media
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Clear Confirmation Dialog */}
      <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Design?</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground py-4">
            Are you sure you want to clear the current design? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClearDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleClear} variant="destructive">Clear Design</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DesignToolsSidebar;
