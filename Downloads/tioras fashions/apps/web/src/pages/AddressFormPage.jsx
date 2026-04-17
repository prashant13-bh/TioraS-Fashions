
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

import AccountLayout from '@/components/AccountLayout.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Chandigarh"
];

const AddressFormPage = () => {
  const { addressId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const isEditing = !!addressId;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    label: 'Home',
    fullName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    isDefault: false
  });

  useEffect(() => {
    const fetchAddress = async () => {
      if (!isEditing) return;
      try {
        const record = await pb.collection('addresses').getOne(addressId, { $autoCancel: false });
        // Verify ownership
        if (record.userId !== currentUser.id) {
          toast.error('Unauthorized access');
          navigate('/account/addresses');
          return;
        }
        setFormData({
          label: record.label,
          fullName: record.fullName,
          phone: record.phone,
          street: record.street,
          city: record.city,
          state: record.state,
          pincode: record.pincode,
          landmark: record.landmark || '',
          isDefault: record.isDefault
        });
      } catch (error) {
        console.error(error);
        toast.error('Failed to load address');
        navigate('/account/addresses');
      } finally {
        setLoading(false);
      }
    };
    fetchAddress();
  }, [addressId, isEditing, currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.phone.length < 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    if (formData.pincode.length !== 6) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }

    setSaving(true);
    try {
      const dataToSave = {
        ...formData,
        userId: currentUser.id
      };

      if (formData.isDefault) {
        // If this is set as default, unset others first (optional optimization, PB could handle via hooks, but we do it manually)
        const defaults = await pb.collection('addresses').getFullList({
          filter: `userId = "${currentUser.id}" && isDefault = true`,
          $autoCancel: false
        });
        
        for (const addr of defaults) {
          if (addr.id !== addressId) {
            await pb.collection('addresses').update(addr.id, { isDefault: false }, { $autoCancel: false });
          }
        }
      }

      if (isEditing) {
        await pb.collection('addresses').update(addressId, dataToSave, { $autoCancel: false });
        toast.success('Address updated successfully');
      } else {
        await pb.collection('addresses').create(dataToSave, { $autoCancel: false });
        toast.success('Address added successfully');
      }
      
      navigate('/account/addresses');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AccountLayout title="Loading Address...">
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout title={isEditing ? 'Edit Address' : 'Add New Address'}>
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="sm" onClick={() => navigate('/account/addresses')} className="text-muted-foreground hover:text-foreground -ml-2">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Addresses
        </Button>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
          {isEditing ? 'Edit Address' : 'Add New Address'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label>Save address as</Label>
            <div className="flex gap-3 flex-wrap">
              {['Home', 'Office', 'Other'].map(lbl => (
                <button
                  key={lbl}
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, label: lbl }))}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    formData.label === lbl 
                      ? 'bg-primary text-primary-foreground border-primary shadow-md' 
                      : 'bg-background text-foreground border-border hover:border-primary/50'
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="John Doe" className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange} placeholder="10-digit mobile number" className="bg-background" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="street">Street Address</Label>
              <Input id="street" name="street" required value={formData.street} onChange={handleChange} placeholder="House No, Building, Street Area" className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City / District</Label>
              <Input id="city" name="city" required value={formData.city} onChange={handleChange} placeholder="City" className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <select
                id="state"
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="" disabled>Select State</option>
                {indianStates.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input id="pincode" name="pincode" required value={formData.pincode} onChange={handleChange} placeholder="6-digit PIN" className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="landmark">Landmark (Optional)</Label>
              <Input id="landmark" name="landmark" value={formData.landmark} onChange={handleChange} placeholder="E.g. Near Apollo Hospital" className="bg-background" />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox id="isDefault" name="isDefault" checked={formData.isDefault} onCheckedChange={(checked) => setFormData(p => ({ ...p, isDefault: checked }))} />
            <Label htmlFor="isDefault" className="cursor-pointer">Make this my default address</Label>
          </div>

          <div className="pt-6 border-t border-border/50 flex gap-3">
            <Button type="submit" disabled={saving} className="gradient-primary text-white rounded-xl px-8 shadow-md">
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Address</>}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/account/addresses')} className="rounded-xl">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AccountLayout>
  );
};

export default AddressFormPage;
