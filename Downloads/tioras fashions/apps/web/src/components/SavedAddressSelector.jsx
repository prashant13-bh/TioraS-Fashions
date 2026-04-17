
import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import pocketbaseClient from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';

const SavedAddressSelector = ({ onSelectAddress, onAddNew }) => {
  const { currentUser } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, [currentUser]);

  const fetchAddresses = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const records = await pocketbaseClient.collection('addresses').getFullList({
        filter: `userId = "${currentUser.id}"`,
        sort: '-isDefault,-created',
        $autoCancel: false
      });
      setAddresses(records);
      
      const defaultAddr = records.find(a => a.isDefault);
      if (defaultAddr) {
        setSelectedId(defaultAddr.id);
        onSelectAddress(defaultAddr);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load saved addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (addressId) => {
    setSelectedId(addressId);
    const address = addresses.find(a => a.id === addressId);
    if (address) {
      onSelectAddress(address);
    }
  };

  const handleDelete = async (addressId, e) => {
    e.stopPropagation();
    
    try {
      await pocketbaseClient.collection('addresses').delete(addressId, { $autoCancel: false });
      toast.success('Address deleted');
      fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map(i => (
          <div key={i} className="h-24 bg-muted/30 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="text-center py-8 bg-muted/20 rounded-xl border border-border/50">
        <MapPin className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground mb-4">No saved addresses</p>
        <Button onClick={onAddNew} className="gradient-primary text-white touch-manipulation">
          <Plus className="mr-2 h-4 w-4" />
          Add New Address
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-foreground">Saved Addresses</h3>
        <Button onClick={onAddNew} variant="outline" size="sm" className="touch-manipulation">
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      <RadioGroup value={selectedId} onValueChange={handleSelect}>
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`relative border rounded-xl p-4 cursor-pointer transition-all touch-manipulation ${
              selectedId === address.id
                ? 'border-primary bg-primary/5'
                : 'border-border/50 hover:border-border'
            }`}
            onClick={() => handleSelect(address.id)}
          >
            <div className="flex items-start gap-3">
              <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
              <div className="flex-1 min-w-0">
                <Label htmlFor={address.id} className="cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-foreground">{address.fullName}</span>
                    {address.isDefault && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Default</span>
                    )}
                  </div>
                  <p className="text-sm text-foreground">{address.street}</p>
                  <p className="text-sm text-muted-foreground">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Phone: {address.phone}</p>
                </Label>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handleDelete(address.id, e)}
                className="h-9 w-9 text-muted-foreground hover:text-destructive touch-manipulation"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default SavedAddressSelector;
