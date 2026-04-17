
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { ShieldCheck } from 'lucide-react';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back, Admin');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Invalid credentials or unauthorized access.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Helmet>
        <title>Admin Login | TioraS Fashions</title>
      </Helmet>
      
      <div className="w-full max-w-md bg-card border border-border/50 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 text-center bg-[hsl(var(--admin-sidebar))] text-white">
          <ShieldCheck className="w-12 h-12 mx-auto mb-4 text-secondary" />
          <h1 className="text-2xl font-bold tracking-wider" style={{ fontFamily: 'Playfair Display, serif' }}>TIORAS ADMIN</h1>
          <p className="text-white/70 text-sm mt-2">Secure Access Portal</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@tiorasfashions.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</a>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="h-12"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Remember me for 30 days
              </label>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-bold" disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
