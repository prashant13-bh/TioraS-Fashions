
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const ErrorPageLayout = ({ 
  icon: Icon, 
  title, 
  message, 
  buttons = [], 
  children 
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          {Icon && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mb-8 flex justify-center"
            >
              <div className="w-32 h-32 bg-[#D4AF37]/10 rounded-full flex items-center justify-center">
                <Icon className="w-16 h-16 text-[#D4AF37]" />
              </div>
            </motion.div>
          )}

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
            {title}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
            {message}
          </p>

          {children}

          {buttons.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              {buttons.map((btn, idx) => (
                btn.to ? (
                  <Link key={idx} to={btn.to}>
                    <Button
                      variant={btn.variant || 'default'}
                      className={btn.className || ''}
                    >
                      {btn.icon && <btn.icon className="w-4 h-4 mr-2" />}
                      {btn.label}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    key={idx}
                    onClick={btn.onClick}
                    variant={btn.variant || 'default'}
                    className={btn.className || ''}
                  >
                    {btn.icon && <btn.icon className="w-4 h-4 mr-2" />}
                    {btn.label}
                  </Button>
                )
              ))}
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default ErrorPageLayout;
