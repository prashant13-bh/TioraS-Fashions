
import React, { useState, useRef } from 'react';
import { Camera, X, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ProfilePictureUpload = ({ currentImage, onImageSelected, onImageRemoved }) => {
  const [preview, setPreview] = useState(currentImage);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Please upload a valid image file (JPG, PNG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Create object URL for immediate preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    
    // Pass file to parent form
    if (onImageSelected) {
      onImageSelected(file);
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onImageRemoved) {
      onImageRemoved();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-muted shadow-sm group bg-secondary/10 flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-primary/50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <>
            <img src={preview} alt="Profile preview" className="w-full h-full object-cover" />
            <div className={`absolute inset-0 bg-black/40 flex flex-col items-center justify-center transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <Camera className="w-8 h-8 text-white mb-1" />
              <span className="text-white text-xs font-medium">Change</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-primary/60">
            <Upload className="w-8 h-8 mb-1" />
            <span className="text-xs font-medium">Upload</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          className="rounded-full font-medium"
          onClick={() => fileInputRef.current?.click()}
        >
          {preview ? 'Change Photo' : 'Select Photo'}
        </Button>
        {preview && (
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleRemove}
          >
            Remove
          </Button>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/jpeg, image/png, image/webp" 
        className="hidden" 
      />
      <p className="text-xs text-muted-foreground text-center">
        JPG, PNG or WebP. Max size 5MB.
      </p>
    </div>
  );
};

export default ProfilePictureUpload;
