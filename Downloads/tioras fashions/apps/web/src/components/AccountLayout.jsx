
import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  User, 
  MapPin, 
  Heart, 
  Settings, 
  LogOut,
  ShoppingBag,
  Paintbrush,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const AccountLayout = ({ children, title }) => {
  const { logout, currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLegalExpanded, setIsLegalExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/account', icon: LayoutDashboard, exact: true },
    { name: 'My Profile', path: '/account/profile', icon: User },
    { name: 'Order History', path: '/account/orders', icon: ShoppingBag },
    { name: 'Saved Addresses', path: '/account/addresses', icon: MapPin },
    { name: 'Wishlist', path: '/account/wishlist', icon: Heart },
    { name: 'Saved Designs', path: '/account/saved-designs', icon: Paintbrush },
    { name: 'Settings', path: '/account/settings', icon: Settings },
  ];

  const legalDocs = [
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms & Conditions', path: '/terms-conditions' },
    { name: 'Return Policy', path: '/return-policy' },
    { name: 'Refund Policy', path: '/refund-policy' },
    { name: 'Shipping Policy', path: '/shipping-policy' },
    { name: 'Cancellation Policy', path: '/cancellation-policy' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full mt-10">
        
        {/* Mobile Header / Greeting */}
        <div className="md:hidden mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>{title || 'My Account'}</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="glass-card rounded-2xl p-4 sticky top-28 border border-border/50 shadow-sm bg-card">
              <div className="flex items-center gap-4 mb-6 p-2 border-b border-border/50 pb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl overflow-hidden shrink-0">
                  {currentUser?.profilePicture ? (
                    <img src={pb.files.getUrl(currentUser, currentUser.profilePicture)} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    currentUser?.name?.charAt(0).toUpperCase() || currentUser?.email?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-foreground truncate">{currentUser?.name || 'Customer'}</p>
                  <p className="text-xs text-muted-foreground truncate">{currentUser?.email}</p>
                </div>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.exact 
                    ? location.pathname === item.path 
                    : location.pathname.startsWith(item.path);

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                        isActive 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'text-primary-foreground' : 'text-muted-foreground'} />
                      {item.name}
                    </NavLink>
                  );
                })}

                {/* Legal Documents Accordion */}
                <div className="pt-2">
                  <button
                    onClick={() => setIsLegalExpanded(!isLegalExpanded)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground"
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-muted-foreground" />
                      Legal Documents
                    </div>
                    {isLegalExpanded ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                  </button>
                  <AnimatePresence>
                    {isLegalExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-1 pl-11 pr-2 py-2 border-l-2 border-border/50 ml-6 mt-1 mb-2">
                          {legalDocs.map((doc, idx) => (
                            <Link 
                              key={idx} 
                              to={doc.path} 
                              className="text-xs py-1.5 text-muted-foreground hover:text-primary transition-colors"
                            >
                              {doc.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="pt-4 mt-4 border-t border-border/50">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium text-destructive/80 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountLayout;
