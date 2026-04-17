
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Shield, Bell, Lock, Sliders, ChevronRight, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountLayout from '@/components/AccountLayout.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const AccountSettings = () => {
  const legalDocs = [
    { name: 'Privacy Policy', path: '/privacy-policy', updated: 'Apr 10, 2026' },
    { name: 'Terms & Conditions', path: '/terms-conditions', updated: 'Mar 15, 2026' },
    { name: 'Return Policy', path: '/return-policy', updated: 'Jan 20, 2026' },
    { name: 'Refund Policy', path: '/refund-policy', updated: 'Jan 20, 2026' },
    { name: 'Shipping Policy', path: '/shipping-policy', updated: 'Feb 10, 2026' },
    { name: 'Cancellation Policy', path: '/cancellation-policy', updated: 'Feb 10, 2026' }
  ];

  return (
    <AccountLayout title="Account Settings">
      <Helmet>
        <title>Account Settings - TioraS Fashions</title>
      </Helmet>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your account security and preferences.</p>
      </div>

      <div className="bg-card border border-border/50 rounded-3xl shadow-sm overflow-hidden">
        <Tabs defaultValue="security" className="w-full">
          <div className="bg-muted/20 border-b border-border/50 p-2 md:p-4 overflow-x-auto">
            <TabsList className="bg-transparent h-auto p-0 flex space-x-2">
              <TabsTrigger value="security" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-xl px-5 py-3 font-medium">
                <Shield className="w-4 h-4 mr-2" /> Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-xl px-5 py-3 font-medium">
                <Bell className="w-4 h-4 mr-2" /> Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-xl px-5 py-3 font-medium">
                <Lock className="w-4 h-4 mr-2" /> Privacy
              </TabsTrigger>
              <TabsTrigger value="preferences" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-xl px-5 py-3 font-medium">
                <Sliders className="w-4 h-4 mr-2" /> Preferences
              </TabsTrigger>
              <TabsTrigger value="legal" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-xl px-5 py-3 font-medium">
                <FileText className="w-4 h-4 mr-2" /> Legal Docs
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6 md:p-8">
            {/* Security Tab */}
            <TabsContent value="security" className="space-y-8 mt-0 focus-visible:outline-none">
              <div>
                <h3 className="text-lg font-bold mb-4 text-foreground">Change Password</h3>
                <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input type="password" placeholder="••••••••" className="bg-background text-foreground" />
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" placeholder="••••••••" className="bg-background text-foreground" />
                  </div>
                </div>
                <Button className="mt-4 bg-primary text-white rounded-xl">Update Password</Button>
              </div>

              <div className="pt-8 border-t border-border/50">
                <h3 className="text-lg font-bold mb-4 text-foreground">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 border border-border/60 rounded-2xl bg-muted/10">
                  <div>
                    <p className="font-bold text-foreground">Authenticator App</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                  </div>
                  <Button variant="outline" className="rounded-xl border-primary text-primary">Enable</Button>
                </div>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6 mt-0 focus-visible:outline-none">
              <h3 className="text-lg font-bold mb-2 text-foreground">Email Notifications</h3>
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between p-4 border border-border/60 rounded-2xl bg-background">
                  <div>
                    <p className="font-medium text-foreground">Order Updates</p>
                    <p className="text-sm text-muted-foreground">Receive emails about your order status.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border border-border/60 rounded-2xl bg-background">
                  <div>
                    <p className="font-medium text-foreground">Promotions & Offers</p>
                    <p className="text-sm text-muted-foreground">Get notified about sales and new collections.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-8 mt-0 focus-visible:outline-none">
               <div>
                <h3 className="text-lg font-bold mb-4 text-foreground">Data Management</h3>
                <div className="space-y-4 max-w-2xl">
                  <div className="bg-muted/10 border border-border/50 p-4 rounded-xl mb-4">
                    <p className="text-sm text-muted-foreground">
                      Learn how we handle your data in our <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
                    </p>
                  </div>
                  <button className="w-full flex items-center justify-between p-4 border border-border/60 hover:border-primary/50 rounded-2xl bg-background transition-colors text-left">
                    <div>
                      <p className="font-medium text-foreground">Request Data Export</p>
                      <p className="text-sm text-muted-foreground">Download a copy of your personal data.</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                  
                  <div className="p-5 border border-destructive/20 bg-destructive/5 rounded-2xl mt-8">
                    <h4 className="font-bold text-destructive mb-2">Delete Account</h4>
                    <p className="text-sm text-destructive/80 mb-4">Permanently delete your account and all associated data. This action cannot be reversed.</p>
                    <Button variant="destructive" className="rounded-xl">Delete My Account</Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6 mt-0 focus-visible:outline-none">
              <h3 className="text-lg font-bold mb-4 text-foreground">Shopping Preferences</h3>
              <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
                <div className="space-y-2">
                  <Label>Preferred Currency</Label>
                  <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>
              <Button className="mt-4 bg-primary text-white rounded-xl">Save Preferences</Button>
            </TabsContent>

            {/* Legal Docs Tab */}
            <TabsContent value="legal" className="space-y-6 mt-0 focus-visible:outline-none">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Legal Documents</h3>
                  <p className="text-sm text-muted-foreground">Access our policies and terms anytime from your account.</p>
                </div>
                <Link to="/legal" className="text-sm text-primary hover:underline font-medium">View Legal Hub</Link>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {legalDocs.map((doc, idx) => (
                  <Link key={idx} to={doc.path} className="flex items-center justify-between p-4 border border-border/60 hover:border-primary/50 hover:bg-muted/20 rounded-2xl transition-all group">
                    <div>
                      <p className="font-bold text-foreground group-hover:text-primary transition-colors">{doc.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">Updated: {doc.updated}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AccountLayout>
  );
};

export default AccountSettings;
