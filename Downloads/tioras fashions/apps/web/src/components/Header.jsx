
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, ShoppingCart as ShoppingCartIcon, User, Search, Bell, ChevronDown, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useCart } from '@/hooks/useCart.jsx';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import ShoppingCart from '@/components/ShoppingCart.jsx';
import { cn } from '@/lib/utils.js';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, currentUser } = useAuth();
  const { cartItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const unreadNotifications = 3;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { 
      name: 'Shop', 
      path: '/products',
      dropdown: [
        { name: 'All Products', path: '/products' },
        { name: 'New Arrivals', path: '/products?filter=new' },
        { name: 'Best Sellers', path: '/products?filter=bestsellers' },
        { name: 'Sale', path: '/products?filter=sale' }
      ]
    },
    { name: 'Collections', path: '/products' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Blog', path: '/blog' }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out bg-[#1a1a2e] text-white border-b border-white/10",
        isScrolled ? "h-14 lg:h-[70px] shadow-lg" : "h-14 lg:h-20"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full gap-4">
            
            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0">
              <span className="text-xl lg:text-3xl font-bold text-[#D4AF37] transition-colors" style={{ fontFamily: 'Playfair Display, serif' }}>
                TioraS Fashions
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 flex-grow justify-center">
              {navLinks.map((link) => (
                link.dropdown ? (
                  <DropdownMenu key={link.name}>
                    <DropdownMenuTrigger asChild>
                      <button className={cn(
                        "px-4 py-2 text-sm font-medium transition-colors rounded-md flex items-center gap-1",
                        isActive(link.path) ? 'text-[#D4AF37]' : 'text-white/80 hover:text-[#D4AF37]'
                      )}>
                        {link.name} <ChevronDown className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#1a1a2e] border-white/10 text-white">
                      {link.dropdown.map((item) => (
                        <DropdownMenuItem key={item.path} asChild>
                          <Link to={item.path} className="hover:text-[#D4AF37] cursor-pointer">
                            {item.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "px-4 py-2 text-sm font-medium transition-colors rounded-md",
                      isActive(link.path) ? 'text-[#D4AF37]' : 'text-white/80 hover:text-[#D4AF37]'
                    )}
                  >
                    {link.name}
                  </Link>
                )
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-2 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(!searchOpen)}
                className="rounded-full text-white/80 hover:text-[#D4AF37] hover:bg-white/5"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>

              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full text-white/80 hover:text-[#D4AF37] hover:bg-white/5 relative">
                      <Bell className="h-5 w-5" />
                      {unreadNotifications > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[9px] font-bold bg-[#D4AF37] text-[#1a1a2e] border-2 border-[#1a1a2e]">
                          {unreadNotifications}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 bg-[#1a1a2e] border-white/10 text-white">
                    <div className="p-4">
                      <h4 className="font-semibold mb-3">Notifications</h4>
                      <div className="space-y-3">
                        <div className="text-sm p-2 rounded bg-white/5 hover:bg-white/10 cursor-pointer">
                          <p className="font-medium">Order Shipped</p>
                          <p className="text-white/60 text-xs">Your order #12345 has been shipped</p>
                        </div>
                        <div className="text-sm p-2 rounded bg-white/5 hover:bg-white/10 cursor-pointer">
                          <p className="font-medium">New Arrival</p>
                          <p className="text-white/60 text-xs">Check out our latest collection</p>
                        </div>
                        <div className="text-sm p-2 rounded bg-white/5 hover:bg-white/10 cursor-pointer">
                          <p className="font-medium">Sale Alert</p>
                          <p className="text-white/60 text-xs">Up to 50% off on selected items</p>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsCartOpen(true)}
                  className="rounded-full relative text-white/80 hover:text-[#D4AF37] hover:bg-white/5"
                  aria-label="Open cart"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  {itemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold bg-[#D4AF37] text-[#1a1a2e] border-2 border-[#1a1a2e]">
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </div>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full text-white/80 hover:text-[#D4AF37] hover:bg-white/5">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-[#1a1a2e] border-white/10 text-white">
                    <div className="px-2 py-2">
                      <p className="text-sm font-medium">{currentUser?.name || 'User'}</p>
                      <p className="text-xs text-white/60">{currentUser?.email}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem asChild>
                      <Link to="/account/profile" className="hover:text-[#D4AF37] cursor-pointer">My Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/account/orders" className="hover:text-[#D4AF37] cursor-pointer">Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/account/wishlist" className="hover:text-[#D4AF37] cursor-pointer">Wishlist</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/account/settings" className="hover:text-[#D4AF37] cursor-pointer">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem onClick={handleLogout} className="hover:text-[#D4AF37] cursor-pointer">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login" className="hidden md:block">
                  <Button className="bg-[#D4AF37] text-[#1a1a2e] hover:bg-[#F4E5B8] rounded-full px-6 text-sm font-bold">
                    Login
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="rounded-full text-white/80 hover:text-[#D4AF37] hover:bg-white/5">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] border-l border-white/10 bg-[#1a1a2e] text-white p-0 flex flex-col">
                  <SheetHeader className="p-6 border-b border-white/10 text-left">
                    <SheetTitle className="font-bold text-[#D4AF37]" style={{ fontFamily: 'Playfair Display, serif' }}>TioraS Fashions</SheetTitle>
                  </SheetHeader>
                  
                  <div className="flex-grow overflow-y-auto p-6 flex flex-col space-y-6">
                    {navLinks.map((link) => (
                      <div key={link.path}>
                        <Link
                          to={link.path}
                          onClick={() => setMobileOpen(false)}
                          className={`text-base font-medium transition-colors block ${
                            isActive(link.path) ? 'text-[#D4AF37]' : 'text-white/80'
                          }`}
                        >
                          {link.name}
                        </Link>
                        {link.dropdown && (
                          <div className="ml-4 mt-2 space-y-2">
                            {link.dropdown.map((item) => (
                              <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setMobileOpen(false)}
                                className="text-sm text-white/60 hover:text-[#D4AF37] block"
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-6 border-t border-white/10 bg-white/5">
                    {isAuthenticated ? (
                      <div className="space-y-3">
                        <Link to="/account" onClick={() => setMobileOpen(false)} className="block">
                          <Button variant="outline" className="w-full justify-start rounded-full text-sm bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-[#D4AF37]">
                            <User className="mr-2 h-4 w-4" /> My Account
                          </Button>
                        </Link>
                        <Button variant="default" className="w-full justify-start rounded-full text-sm bg-[#D4AF37] text-[#1a1a2e] hover:bg-[#F4E5B8]" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Link to="/login" onClick={() => setMobileOpen(false)} className="block">
                          <Button className="w-full bg-[#D4AF37] text-[#1a1a2e] hover:bg-[#F4E5B8] rounded-full text-sm">
                            Login
                          </Button>
                        </Link>
                        <Link to="/signup" onClick={() => setMobileOpen(false)} className="block">
                          <Button variant="outline" className="w-full rounded-full text-sm bg-transparent border-white/20 text-white hover:bg-white/10">
                            Sign Up
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Search Bar (when open) */}
        {searchOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#1a1a2e] border-t border-white/10 p-4 shadow-lg">
            <div className="max-w-3xl mx-auto flex items-center gap-2">
              <input
                type="text"
                placeholder="Search products, brands, styles..."
                className="flex-grow px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                autoFocus
              />
              <Button onClick={() => setSearchOpen(false)} variant="ghost" size="icon" className="text-white/80 hover:text-[#D4AF37]">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Spacer */}
      <div className="h-14 lg:h-20 w-full" aria-hidden="true" />
      
      <ShoppingCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
    </>
  );
};

export default Header;
