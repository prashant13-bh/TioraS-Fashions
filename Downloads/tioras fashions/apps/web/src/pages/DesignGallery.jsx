
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const CATEGORIES = ['All', 'Festival', 'Modern', 'Traditional', 'Sports', 'Corporate'];

const MOCK_DESIGNS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1562347174-7370ad83dc47?auto=format&fit=crop&q=80&w=600',
    title: 'Golden Mandala Embroidery',
    type: 'Hoodie',
    category: 'Traditional',
    prompt: 'Intricate golden mandala embroidery design for a dark hoodie, traditional Indian style',
    likes: 124
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1600953273537-e7d22c4f1967?auto=format&fit=crop&q=80&w=600',
    title: 'Neon Cyberpunk Tiger',
    type: 'T-shirt',
    category: 'Modern',
    prompt: 'Neon cyberpunk tiger head, vibrant colors, modern streetwear style',
    likes: 89
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&q=80&w=600',
    title: 'Minimalist Kannada Typography',
    type: 'T-shirt',
    category: 'Modern',
    prompt: 'Minimalist elegant Kannada typography saying "Namaskara", deep blue and gold',
    likes: 256
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=600',
    title: 'Diwali Diya Pattern',
    type: 'Saree Blouse',
    category: 'Festival',
    prompt: 'Elegant Diwali diya pattern for saree blouse back, gold thread embroidery',
    likes: 312
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600',
    title: 'Corporate Tech Logo',
    type: 'Shirt',
    category: 'Corporate',
    prompt: 'Clean geometric tech company logo, left chest placement, professional',
    likes: 45
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=600',
    title: 'Vintage Cricket Crest',
    type: 'Cap',
    category: 'Sports',
    prompt: 'Vintage style cricket team crest, embroidered patch style',
    likes: 178
  }
];

const DesignGallery = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredDesigns = activeCategory === 'All' 
    ? MOCK_DESIGNS 
    : MOCK_DESIGNS.filter(d => d.category === activeCategory);

  const handleUseDesign = (design) => {
    // In a real app, we might pass this via state or context. 
    // For now, we'll navigate to generator. The user can type the prompt.
    navigate('/design-generator');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Design Gallery - TioraS Fashions Studio</title>
        <meta name="description" content="Explore AI-generated fashion designs created by our community." />
      </Helmet>
      
      <Header />

      <main className="flex-1">
        <section className="bg-muted/30 py-16 border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
                Community Design Gallery
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
                Get inspired by stunning AI-generated designs created by our community. Find a style you love and make it your own.
              </p>
              
              <div className="flex flex-wrap justify-center gap-3">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                      activeCategory === cat 
                        ? 'bg-primary text-primary-foreground shadow-md' 
                        : 'bg-card border border-border text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {filteredDesigns.map((design, index) => (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="break-inside-avoid"
              >
                <div className="premium-card overflow-hidden group bg-card border border-border/50">
                  <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                    <img 
                      src={design.image} 
                      alt={design.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <Button 
                        onClick={() => handleUseDesign(design)}
                        className="w-full bg-white text-black hover:bg-gray-100 font-bold rounded-xl"
                      >
                        <Sparkles className="mr-2 h-4 w-4" /> Use This Design
                      </Button>
                    </div>
                    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-medium shadow-sm">
                      <Heart size={14} className="text-destructive fill-destructive" /> {design.likes}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-foreground leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {design.title}
                      </h3>
                      <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-md">
                        {design.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {design.prompt}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button variant="outline" size="lg" className="rounded-full px-10 border-border/80 text-foreground">
              Load More Designs
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DesignGallery;
