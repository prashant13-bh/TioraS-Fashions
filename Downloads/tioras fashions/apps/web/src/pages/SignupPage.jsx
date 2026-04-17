
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);
  const [termsError, setTermsError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate Terms & Conditions
    if (!agreedToTerms) {
      setTermsError('You must agree to the Terms & Conditions');
      toast.error('Please agree to the Terms & Conditions');
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    const result = await signup(
      formData.email,
      formData.password,
      formData.passwordConfirm,
      formData.name
    );
    
    setLoading(false);

    if (result.success) {
      toast.success('Account created successfully');
      navigate('/');
    } else {
      toast.error(result.error || 'Signup failed. Please try again.');
    }
  };

  const handleTermsChange = (checked) => {
    setAgreedToTerms(checked);
    if (checked) {
      setTermsError('');
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up | TioraS Fashions</title>
        <meta name="description" content="Create your TioraS Fashions account to start customizing products and placing orders." />
      </Helmet>
      
      <Header />
      
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="premium-card">
            <CardHeader className="space-y-1">
              <CardTitle className="text-3xl font-bold text-center text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
                Create Account
              </CardTitle>
              <CardDescription className="text-center">
                Join TioraS Fashions and start customizing today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Maya Chen"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={8}
                    className="text-foreground"
                  />
                  <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordConfirm" className="text-foreground">Confirm Password</Label>
                  <Input
                    id="passwordConfirm"
                    type="password"
                    placeholder="••••••••"
                    value={formData.passwordConfirm}
                    onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                    required
                    minLength={8}
                    className="text-foreground"
                  />
                </div>

                {/* Terms & Conditions Checkbox */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={handleTermsChange}
                      className={`mt-0.5 min-w-[44px] min-h-[44px] border-primary data-[state=checked]:bg-primary ${termsError ? 'border-destructive' : ''}`}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-relaxed cursor-pointer text-foreground"
                    >
                      I agree to the{' '}
                      <Link to="/terms-conditions" className="text-primary hover:underline" target="_blank">
                        Terms & Conditions
                      </Link>
                      <span className="text-destructive ml-1">*</span>
                    </label>
                  </div>
                  {termsError && (
                    <p className="text-sm text-destructive">{termsError}</p>
                  )}

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="newsletter"
                      checked={subscribeNewsletter}
                      onCheckedChange={setSubscribeNewsletter}
                      className="mt-0.5 min-w-[44px] min-h-[44px] border-primary data-[state=checked]:bg-primary"
                    />
                    <label
                      htmlFor="newsletter"
                      className="text-sm font-medium leading-relaxed cursor-pointer text-foreground"
                    >
                      Subscribe to our newsletter for exclusive offers and updates
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-primary text-white h-12"
                  disabled={loading || !agreedToTerms}
                >
                  {loading ? 'Creating account...' : 'Sign Up'}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Login
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </>
  );
};

export default SignupPage;
