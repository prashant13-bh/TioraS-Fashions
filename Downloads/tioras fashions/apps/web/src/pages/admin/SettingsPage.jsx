
import React from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/AdminLayout.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const SettingsPage = () => {
  return (
    <AdminLayout>
      <Helmet>
        <title>Settings | Admin</title>
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>Store Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your store preferences and configurations.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6 bg-transparent border-b border-border/50 w-full justify-start rounded-none h-auto p-0 space-x-6">
          <TabsTrigger value="general" className="data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent rounded-none px-0 py-3">General</TabsTrigger>
          <TabsTrigger value="payment" className="data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent rounded-none px-0 py-3">Payment</TabsTrigger>
          <TabsTrigger value="shipping" className="data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent rounded-none px-0 py-3">Shipping</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card className="admin-card">
            <CardHeader>
              <CardTitle>Store Details</CardTitle>
              <CardDescription>Basic information about your store.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Store Name</Label>
                  <Input defaultValue="TioraS Fashions" />
                </div>
                <div className="space-y-2">
                  <Label>Contact Email</Label>
                  <Input defaultValue="support@tiorasfashions.com" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input defaultValue="+91 98765 43210" />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Input defaultValue="INR (₹)" disabled />
                </div>
              </div>
              <Button className="mt-4">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card className="admin-card">
            <CardHeader>
              <CardTitle>Payment Gateways</CardTitle>
              <CardDescription>Configure how you accept payments.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-border/50 rounded-lg flex items-center justify-between">
                  <div>
                    <h4 className="font-bold">Razorpay</h4>
                    <p className="text-sm text-muted-foreground">Accept UPI, Cards, NetBanking</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping">
          <Card className="admin-card">
            <CardHeader>
              <CardTitle>Shipping Zones</CardTitle>
              <CardDescription>Manage shipping rates and delivery zones.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Configure your shipping methods here.</p>
              <Button variant="outline">Add Shipping Zone</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default SettingsPage;
