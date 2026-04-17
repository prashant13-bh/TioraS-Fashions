
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Edit, Mail, Phone, Calendar, User as UserIcon, Shield, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';

import AccountLayout from '@/components/AccountLayout.jsx';
import { Button } from '@/components/ui/button';

const ProfilePage = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const avatarUrl = currentUser.profilePicture 
    ? pb.files.getUrl(currentUser, currentUser.profilePicture) 
    : null;

  return (
    <AccountLayout title="My Profile">
      <Helmet>
        <title>My Profile - TioraS Fashions</title>
      </Helmet>

      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>Personal Information</h2>
          <p className="text-muted-foreground mt-1">Manage your personal details and account preferences.</p>
        </div>
        <Link to="/account/profile/edit">
          <Button className="gradient-primary text-white rounded-full shadow-md">
            <Edit className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
        </Link>
      </div>

      <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
        
        {/* Profile Header Block */}
        <div className="bg-muted/30 border-b border-border/50 p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-lg shrink-0 bg-primary/10 flex items-center justify-center">
            {avatarUrl ? (
              <img src={avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-primary">{currentUser.name?.charAt(0) || 'U'}</span>
            )}
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h3 className="text-2xl font-bold text-foreground mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
              {currentUser.name || 'No Name Set'}
            </h3>
            <p className="text-muted-foreground mb-4">{currentUser.email}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                <Shield className="w-3 h-3 mr-1" /> Verified Account
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground text-xs font-bold">
                Premium Member
              </span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-8">
          <h4 className="text-lg font-bold mb-6 text-foreground border-b border-border/50 pb-2">Contact Details</h4>
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Email Address</p>
                <p className="text-foreground font-medium">{currentUser.email}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Phone Number</p>
                <p className="text-foreground font-medium">{currentUser.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>

          <h4 className="text-lg font-bold mb-6 text-foreground border-b border-border/50 pb-2">Additional Info</h4>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Date of Birth</p>
                <p className="text-foreground font-medium">
                  {currentUser.dateOfBirth ? format(new Date(currentUser.dateOfBirth), 'MMMM d, yyyy') : 'Not provided'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Gender</p>
                <p className="text-foreground font-medium">{currentUser.gender || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {currentUser.bio && (
            <div className="mt-8 bg-muted/30 p-5 rounded-2xl border border-border/50">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Bio</p>
              <p className="text-foreground/80 leading-relaxed">{currentUser.bio}</p>
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-border/50 flex flex-wrap gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Joined: {format(new Date(currentUser.created), 'MMMM yyyy')}</span>
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> Last Login: {currentUser.lastLogin ? format(new Date(currentUser.lastLogin), 'MMM d, yyyy') : 'Recently'}</span>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
};

export default ProfilePage;
