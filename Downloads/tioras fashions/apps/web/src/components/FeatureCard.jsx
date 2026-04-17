
import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="bg-card border border-border/40 rounded-2xl p-8 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 text-[#D4AF37]">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="text-xl font-bold mb-3 text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
        {title}
      </h4>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;
