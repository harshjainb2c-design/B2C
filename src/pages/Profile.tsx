import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { useToast } from '../hooks/use-toast';
import { User, Mail, Lock, Save } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);

      if (error) throw error;

      // Update local store
      useAuthStore.setState({
        user: { ...user, fullName },
      });

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Password changed successfully',
      });
      
      setIsChangingPassword(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to change password',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-taupe">Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-6 sm:py-8">
      {/* Mobile: Full width with padding, Desktop: Centered with max-width */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-beige-300">
            <h1 className="text-2xl font-bold text-warmBrown">My Profile</h1>
            <p className="text-sm text-taupe mt-1">Manage your account information</p>
          </div>

          {/* Profile Information */}
          <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-6">
            {/* Basic Info */}
            <div>
              <h2 className="text-lg font-bold text-warmBrown mb-4">Basic Information</h2>
              
              {!isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-terracotta flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-taupe">Full Name</p>
                      <p className="text-base font-semibold text-warmBrown truncate">{user.fullName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-terracotta flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-taupe">Email</p>
                      <p className="text-base font-semibold text-warmBrown truncate">{user.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 w-full sm:w-auto px-6 py-3 text-sm font-semibold text-warmBrown border-2 border-warmBrown rounded-md hover:bg-sand uppercase tracking-wider min-h-[44px]"
                  >
                    Edit Profile
                  </button>
                </div>
              ) : (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 touch-manipulation"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-3 py-3 text-sm sm:text-base border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1.5">Email cannot be changed</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-terracotta hover:bg-warmBrown rounded-md disabled:opacity-50 uppercase tracking-wider min-h-[44px]"
                    >
                      <Save className="h-4 w-4" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFullName(user.fullName);
                      }}
                      className="px-6 py-3 text-sm font-semibold text-warmBrown border-2 border-warmBrown rounded-md hover:bg-sand uppercase tracking-wider min-h-[44px]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Password Change */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Security</h2>
              
              {!isChangingPassword ? (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto px-4 py-3 text-sm font-medium text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 active:bg-gray-100 transition-colors duration-100 touch-manipulation min-h-[44px]"
                >
                  <Lock className="h-4 w-4" />
                  Change Password
                </button>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 touch-manipulation"
                      required
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 touch-manipulation"
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 active:bg-gray-700 disabled:opacity-50 transition-all duration-100 touch-manipulation min-h-[44px]"
                    >
                      <Save className="h-4 w-4" />
                      {isSaving ? 'Changing...' : 'Change Password'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      className="px-4 py-3 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 active:bg-gray-100 transition-colors duration-100 touch-manipulation min-h-[44px]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Account Info */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Account Details</h2>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  <span className="font-medium">Role:</span>{' '}
                  <span className="capitalize">{user.role}</span>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Member since:</span>{' '}
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
