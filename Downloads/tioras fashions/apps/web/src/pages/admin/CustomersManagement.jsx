
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Filter, MoreHorizontal, Mail } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import AdminLayout from '@/components/AdminLayout.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

const CustomersManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const records = await pb.collection('users').getFullList({ filter: 'role="user"', sort: '-created', $autoCancel: false });
        setCustomers(records);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <AdminLayout>
      <Helmet>
        <title>Customers | Admin</title>
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>Customers</h1>
        <p className="text-muted-foreground mt-1">View and manage your customer base.</p>
      </div>

      <div className="admin-card p-4 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search customers by name or email..." className="pl-9" />
        </div>
        <Button variant="outline" className="shrink-0">
          <Filter className="w-4 h-4 mr-2" /> Filters
        </Button>
      </div>

      <div className="admin-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">Loading customers...</TableCell></TableRow>
            ) : customers.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">No customers found.</TableCell></TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={customer.avatar ? pb.files.getUrl(customer, customer.avatar) : ''} />
                        <AvatarFallback>{customer.name?.charAt(0) || customer.email.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{customer.name || 'Unnamed User'}</span>
                    </div>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone || '-'}</TableCell>
                  <TableCell>{format(new Date(customer.created), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><Mail className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default CustomersManagement;
