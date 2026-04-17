
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, Eye, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProductCard = ({ product }) => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="group bg-card rounded-xl overflow-hidden shadow-subtle hover:shadow-medium transition-all duration-300 border border-border/50 flex flex-col h-full"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 flex justify-center gap-2 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-t from-black/60 to-transparent">
          <Button size="icon" variant="secondary" className="rounded-full bg-white text-foreground hover:bg-primary hover:text-primary-foreground h-10 w-10 shadow-md">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" className="rounded-full bg-white text-foreground hover:bg-primary hover:text-primary-foreground h-10 w-10 shadow-md">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} 
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.rating})</span>
        </div>
        
        <Link to={`/product/${product.id}`} className="hover:text-primary transition-colors">
          <h4 className="text-base font-semibold mb-1 line-clamp-1">{product.name}</h4>
        </Link>
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">₹{product.price}</span>
          <Button size="sm" className="bg-foreground text-background hover:bg-primary hover:text-primary-foreground rounded-full px-4">
            <ShoppingCart className="h-4 w-4 mr-2" /> Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
