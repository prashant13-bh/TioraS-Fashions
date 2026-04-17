
import React from 'react';
import { Menu, Bell, Search, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import pb from '@/lib/pocketbaseClient';

const AdminHeader = ({ toggleSidebar }) => {
  const { theme, setTheme } = useTheme();
  const { currentAdmin } = useAdminAuth();

  return (
    <header className="h-16 bg-card border-b border-border/50 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
          <Menu className="w-5 h-5" />
        </Button>
        
        <div className="hidden md:flex relative w-64 lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search anything..." className="pl-9 bg-muted/50 border-none rounded-full h-10" />
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-5">
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-full">
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
        
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full"></span>
        </Button>

        <div className="flex items-center gap-3 pl-2 lg:pl-4 lg:border-l border-border/50">
          <div className="hidden lg:block text-right">
            <p className="text-sm font-bold leading-none">{currentAdmin?.name || 'Admin'}</p>
            <p className="text-xs text-muted-foreground mt-1">{currentAdmin?.email}</p>
          </div>
          <Avatar className="w-9 h-9 border border-border">
            <AvatarImage src={currentAdmin?.avatar ? pb.files.getUrl(currentAdmin, currentAdmin.avatar) : ''} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">AD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
