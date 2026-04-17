
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { MapPin, Plus, Edit2, Trash2, Home, Briefcase, Map } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

import AccountLayout from '@/components/AccountLayout.jsx';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SavedAddresses = () => {
  const { currentUser } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchAddresses = async () => {
    try {
      const records = await pb.collection('addresses').getFullList({
        filter: `userId = "${currentUser.id}"`,
        sort: '-isDefault,-created',
        $autoCancel: false
      });
      setAddresses(records);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) fetchAddresses();
  }, [currentUser]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await pb.collection('addresses').delete(deleteId, { $autoCancel: false });
      setAddresses(prev => prev.filter(a => a.id !== deleteId));
      toast.success('Address removed successfully');
    } catch (error) {
      toast.error('Failed to delete address');
    } finally {
      setDeleteId(null);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      // Optistic UI update
      setAddresses(prev => prev.map(a => ({
        ...a,
        isDefault: a.id === addressId
      })));

      // First unset current default
      const currentDefault = addresses.find(a => a.isDefault && a.id !== addressId);
      if (currentDefault) {
        await pb.collection('addresses').update(currentDefault.id, { isDefault: false }, { $autoCancel: false });
      }
      
      // Set new default
      await pb.collection('addresses').update(addressId, { isDefault: true }, { $autoCancel: false });
      toast.success('Default address updated');
      
      // Re-fetch to ensure sync and correct sorting
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to update default address');
      fetchAddresses(); // Revert optimistic update
    }
  };

  const getLabelIcon = (label) => {
    switch(label) {
      case 'Home': return <Home className="w-4 h-4" />;
      case 'Office': return <Briefcase className="w-4 h-4" />;
      default: return <Map className="w-4 h-4" />;
    }
  };

  return (
    <AccountLayout title="Saved Addresses">
      <Helmet>
        <title>Saved Addresses - TioraS Fashions</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>Saved Addresses</h2>
          <p className="text-muted-foreground mt-1">Manage your delivery addresses for quick checkout.</p>
        </div>
        <Link to="/account/addresses/new">
          <Button disabled={addresses.length >= 5} className="gradient-primary text-white rounded-full shadow-md">
            <Plus className="w-4 h-4 mr-2" /> Add New Address
          </Button>
        </Link>
      </div>

      {addresses.length >= 5 && (
        <div className="bg-amber-500/10 text-amber-700 p-4 rounded-xl mb-6 text-sm font-medium border border-amber-500/20">
          You have reached the maximum limit of 5 saved addresses. Please remove an old address to add a new one.
        </div>
      )}

      {loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-card border border-border/50 rounded-2xl p-12 text-center shadow-sm">
          <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold mb-2">No addresses saved</h3>
          <p className="text-muted-foreground mb-6">Add a delivery address to complete your checkout faster.</p>
          <Link to="/account/addresses/new">
            <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary/10">Add Your First Address</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div key={address.id} className={`bg-card rounded-2xl p-6 shadow-sm border-2 transition-all ${address.isDefault ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/30'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-background border border-border/60 rounded-full text-xs font-bold text-foreground uppercase tracking-wider">
                    {getLabelIcon(address.label)} {address.label}
                  </span>
                  {address.isDefault && (
                    <span className="text-[10px] font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">DEFAULT</span>
                  )}
                </div>
                <div className="flex gap-1">
                  <Link to={`/account/addresses/${address.id}/edit`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(address.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <p className="font-bold text-foreground text-lg">{address.fullName}</p>
                <p className="text-sm text-foreground/80">{address.street}</p>
                <p className="text-sm text-foreground/80">{address.city}, {address.state} {address.pincode}</p>
                {address.landmark && <p className="text-sm text-muted-foreground mt-1">Landmark: {address.landmark}</p>}
                <p className="text-sm font-medium text-foreground mt-2">Phone: {address.phone}</p>
              </div>

              {!address.isDefault && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleSetDefault(address.id)}
                  className="w-full text-xs rounded-lg"
                >
                  Set as Default
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this address? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </AccountLayout>
  );
};

export default SavedAddresses;
