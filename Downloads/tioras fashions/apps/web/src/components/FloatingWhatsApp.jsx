
import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const FloatingWhatsApp = () => {
  return (
    <motion.a
      href="https://wa.me/917353676454"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-primary text-primary-foreground px-4 py-3 sm:px-5 sm:py-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-secondary/30 hover:shadow-[0_8px_30px_rgba(212,175,55,0.2)] transition-all duration-300 group"
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-secondary rounded-full animate-ping opacity-20"></div>
        <MessageCircle className="h-6 w-6 text-secondary group-hover:text-primary-foreground transition-colors" />
      </div>
      <span className="hidden sm:block font-bold tracking-wide text-sm" style={{ fontFamily: 'Playfair Display, serif' }}>
        Chat with us
      </span>
    </motion.a>
  );
};

export default FloatingWhatsApp;
