
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Paintbrush, Search, SlidersHorizontal, Edit2, ShoppingCart, Share2, Trash2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

import AccountLayout from '@/components/AccountLayout.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const SavedDesignsPage = () => {
  const { currentUser } = useAuth();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortFilter, setSortFilter] = useState('newest');

  const fetchDesigns = async () => {
    if (!currentUser) return;
    try {
      const records = await pb.collection('generatedDesigns').getFullList({
        filter: `userId = "${currentUser.id}"`,
        sort: sortFilter === 'newest' ? '-created' : 'created',
        $autoCancel: false
      });
      setDesigns(records);
    } catch (error) {
      console.error('Error fetching designs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, [currentUser, sortFilter]);

  const handleDelete = async (id) => {
    try {
      await pb.collection('generatedDesigns').delete(id, { $autoCancel: false });
      setDesigns(prev => prev.filter(d => d.id !== id));
      toast.success('Design deleted successfully');
    } catch (error) {
      toast.error('Failed to delete design');
    }
  };

  const filteredDesigns = designs.filter(design => 
    design.prompt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    design.productType?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AccountLayout title="Saved Designs">
      <Helmet>
        <title>Saved Designs - TioraS Fashions</title>
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>Your Saved Designs</h2>
          <p className="text-muted-foreground mt-1">Manage your custom AI creations.</p>
        </div>
        <Link to="/ai-designer">
          <Button className="gradient-primary text-white rounded-full shadow-md">
            <Paintbrush className="w-4 h-4 mr-2" /> Create New Design
          </Button>
        </Link>
      </div>

      {/* Toolbar */}
      {designs.length > 0 && (
        <div className="bg-card border border-border/50 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 mb-8 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search designs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background border-border/60"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="text-muted-foreground w-4 h-4" />
            <select
              value={sortFilter}
              onChange={(e) => setSortFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-w-[140px]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-80 w-full rounded-3xl" />
          ))}
        </div>
      ) : filteredDesigns.length === 0 ? (
        <div className="bg-card border border-border/50 rounded-3xl p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Paintbrush className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>No saved designs yet</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {searchQuery ? "No designs match your search." : "Unleash your creativity with our AI Designer and save your masterpieces here."}
          </p>
          <Link to="/ai-designer">
            <Button className="gradient-primary text-white rounded-full px-8 h-12 shadow-md">Start Designing</Button>
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDesigns.map((design) => (
            <div key={design.id} className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
              <div className="relative aspect-square bg-muted overflow-hidden">
                <img src={design.designImage || '/placeholder.svg'} alt={design.productType} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                  {design.productType}
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="secondary" size="icon" className="rounded-full w-10 h-10 shadow-lg"><Search className="w-4 h-4" /></Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl bg-background/95 backdrop-blur-xl border-border/50 p-0 overflow-hidden">
                      <img src={design.designImage} alt="Preview" className="w-full h-auto max-h-[80vh] object-contain" />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-1">
                <p className="text-xs text-muted-foreground mb-2">{format(new Date(design.created), 'MMM d, yyyy')}</p>
                <p className="font-medium text-foreground text-sm line-clamp-2 mb-4 flex-1">
                  "{design.prompt}"
                </p>
                
                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <Button variant="outline" size="sm" className="rounded-xl text-xs" onClick={() => toast.success('Added to cart')}>
                    <ShoppingCart className="w-3 h-3 mr-1.5" /> Cart
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-xl text-xs" onClick={() => toast.success('Link copied')}>
                    <Share2 className="w-3 h-3 mr-1.5" /> Share
                  </Button>
                  <Link to="/ai-designer" className="col-span-2">
                    <Button variant="secondary" size="sm" className="w-full rounded-xl text-xs font-bold">
                      <Edit2 className="w-3 h-3 mr-1.5" /> Edit in Studio
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="col-span-2 rounded-xl text-xs text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(design.id)}>
                    <Trash2 className="w-3 h-3 mr-1.5" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AccountLayout>
  );
};

export default SavedDesignsPage;
