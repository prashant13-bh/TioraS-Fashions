
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

import AccountLayout from '@/components/AccountLayout.jsx';
import ProfilePictureUpload from '@/components/ProfilePictureUpload.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const EditProfilePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    dateOfBirth: currentUser?.dateOfBirth ? currentUser.dateOfBirth.split('T')[0] : '',
    gender: currentUser?.gender || '',
    bio: currentUser?.bio || ''
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

  const currentAvatarUrl = currentUser?.profilePicture 
    ? pb.files.getUrl(currentUser, currentUser.profilePicture) 
    : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      if (formData.dateOfBirth) data.append('dateOfBirth', new Date(formData.dateOfBirth).toISOString());
      data.append('gender', formData.gender);
      data.append('bio', formData.bio);

      if (selectedImage) {
        data.append('profilePicture', selectedImage);
      } else if (removeImage) {
        data.append('profilePicture', ''); // Send empty to clear if supported, or handle specifically
      }

      await pb.collection('users').update(currentUser.id, data, { $autoCancel: false });
      
      // Update local state implicitly via authStore listener in context
      toast.success('Profile updated successfully');
      navigate('/account/profile');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AccountLayout title="Edit Profile">
      <Helmet>
        <title>Edit Profile - TioraS Fashions</title>
      </Helmet>

      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="sm" onClick={() => navigate('/account/profile')} className="text-muted-foreground hover:text-foreground -ml-2">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Profile
        </Button>
      </div>

      <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-8 text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Avatar Upload Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 pb-8 border-b border-border/50">
            <ProfilePictureUpload 
              currentImage={!removeImage ? currentAvatarUrl : null}
              onImageSelected={(file) => {
                setSelectedImage(file);
                setRemoveImage(false);
              }}
              onImageRemoved={() => {
                setSelectedImage(null);
                setRemoveImage(true);
              }}
            />
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-foreground mb-1">Profile Picture</h3>
              <p className="text-sm text-muted-foreground">Upload a professional photo to personalize your account. A square image works best.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="Your full name" className="bg-background" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" value={currentUser?.email || ''} disabled className="bg-muted text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Email cannot be changed here. Contact support to update.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Your phone number" className="bg-background" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} className="bg-background" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">Prefer not to say</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="bio">Short Bio</Label>
              <Textarea 
                id="bio" 
                name="bio" 
                value={formData.bio} 
                onChange={handleChange} 
                placeholder="Tell us a bit about your style preferences..." 
                className="bg-background min-h-[100px]"
              />
            </div>
          </div>

          <div className="pt-6 flex gap-3">
            <Button type="submit" disabled={saving} className="gradient-primary text-white rounded-xl px-8 shadow-md">
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/account/profile')} className="rounded-xl">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AccountLayout>
  );
};

export default EditProfilePage;
