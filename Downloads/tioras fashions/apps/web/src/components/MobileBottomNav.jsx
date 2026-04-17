
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Grid3X3, ShoppingBag, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/hooks/useCart.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { cn } from '@/lib/utils.js';

const tabs = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Search', icon: Search, path: '/search' },
  { name: 'Shop', icon: Grid3X3, path: '/products' },
  { name: 'Cart', icon: ShoppingBag, path: '/cart' },
  { name: 'Account', icon: User, path: '/account' },
];

const MobileBottomNav = () => {
  const location = useLocation();
  const { cartItems } = useCart();
  const { isAuthenticated } = useAuth();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Hide on admin pages and design studio
  const hideOnPaths = ['/admin', '/design-studio', '/customize', '/ai-designer'];
  if (hideOnPaths.some(p => location.pathname.startsWith(p))) return null;

  const getHref = (tab) => {
    if (tab.name === 'Account' && !isAuthenticated) return '/login';
    return tab.path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#1a1a2e]/95 backdrop-blur-xl border-t border-white/10 mobile-bottom-nav">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        {tabs.map((tab) => {
          const active = isActive(tab.path);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.name}
              to={getHref(tab)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full relative tap-highlight-none",
                "transition-colors duration-200"
              )}
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                className="flex flex-col items-center justify-center gap-0.5"
              >
                <div className="relative">
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-colors duration-200",
                      active ? "text-[#D4AF37]" : "text-white/50"
                    )}
                    strokeWidth={active ? 2.5 : 1.8}
                  />
                  {tab.name === 'Cart' && itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 bg-[#D4AF37] text-[#1a1a2e] text-[10px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full px-1">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium transition-colors duration-200",
                    active ? "text-[#D4AF37]" : "text-white/40"
                  )}
                >
                  {tab.name}
                </span>
                {active && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-[#D4AF37] rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
