
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Tags, 
  BarChart3, 
  Settings, 
  HelpCircle,
  LogOut
} from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useAdminAuth();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Categories', path: '/admin/categories', icon: Tags },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[hsl(var(--admin-sidebar))] text-[hsl(var(--admin-sidebar-foreground))] transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:shrink-0 flex flex-col`}>
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-wider text-white" style={{ fontFamily: 'Playfair Display, serif' }}>TIORAS ADMIN</h1>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium
              ${isActive ? 'bg-primary text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}
            `}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-colors text-sm font-medium text-white/70 hover:bg-destructive/20 hover:text-destructive"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
