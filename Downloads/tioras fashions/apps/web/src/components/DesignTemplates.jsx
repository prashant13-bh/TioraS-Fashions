
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DownloadCloud, Sparkles } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';

const DesignTemplates = ({ onSelectTemplate }) => {
  const [templates, setTemplates] = useState([]);
  const [category, setCategory] = useState('All');
  const categories = ['All', 'Festival', 'Sports', 'Corporate', 'Casual'];

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const records = await pb.collection('designTemplates').getFullList({
          $autoCancel: false,
          sort: '-created'
        });
        if (records.length > 0) {
          setTemplates(records);
        } else {
          // Mock data if none in DB
          setTemplates([
            { id: 'mock1', name: 'Diwali Celebration', category: 'Festival', thumbnail: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=300&q=80', designData: { layers: [{ id: '1', type: 'text', text: 'Happy Diwali', font: 'Playfair Display', fontSize: 40, fill: '#D4AF37', x: 0, y: -20, rotation: 0, scale: 1, opacity: 1, hidden: false, locked: false }] } },
            { id: 'mock2', name: 'Team Varsity', category: 'Sports', thumbnail: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=300&q=80', designData: { layers: [{ id: '2', type: 'text', text: 'TIGERS', font: 'Arial', fontSize: 60, fill: '#1E3A8A', x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, hidden: false, locked: false }] } },
            { id: 'mock3', name: 'Corporate Minimal', category: 'Corporate', thumbnail: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=300&q=80', designData: { layers: [{ id: '3', type: 'text', text: 'ACME Corp', font: 'Lato', fontSize: 24, fill: '#000000', x: -50, y: -50, rotation: 0, scale: 0.8, opacity: 1, hidden: false, locked: false }] } }
          ]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTemplates();
  }, []);

  const filtered = category === 'All' ? templates : templates.filter(t => t.category === category);

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
        <Sparkles className="text-secondary w-5 h-5" /> Start from Template
      </h3>
      
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              category === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {filtered.map((t, idx) => (
          <motion.div 
            key={t.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group relative rounded-xl overflow-hidden border border-border/50 bg-muted aspect-square cursor-pointer"
            onClick={() => onSelectTemplate(t.designData)}
          >
            <img 
              src={t.thumbnail ? (t.thumbnail.startsWith('http') ? t.thumbnail : pb.files.getUrl(t, t.thumbnail)) : 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300'} 
              alt={t.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
              <span className="text-white text-xs font-bold truncate">{t.name}</span>
              <Button size="sm" variant="secondary" className="w-full mt-2 h-7 text-xs rounded-lg">
                <DownloadCloud className="w-3 h-3 mr-1" /> Use
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DesignTemplates;
