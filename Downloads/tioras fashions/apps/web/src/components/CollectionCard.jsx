
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CollectionCard = ({ image, name, itemCount, link = '/products' }) => {
  return (
    <motion.div 
      whileHover="hover"
      initial="initial"
      className="relative group overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer"
    >
      <Link to={link} className="block w-full h-full">
        <motion.img 
          variants={{
            initial: { scale: 1 },
            hover: { scale: 1.05 }
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
        
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <motion.div
            variants={{
              initial: { y: 20, opacity: 0.9 },
              hover: { y: 0, opacity: 1 }
            }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-accent text-sm font-medium mb-2 tracking-wide uppercase">{itemCount} Items</p>
            <h3 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>{name}</h3>
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-foreground rounded-full h-10 px-6 group-hover:border-transparent">
              View Collection <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CollectionCard;
