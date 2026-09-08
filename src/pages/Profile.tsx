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
      <div className="min-h-screen bg-black flex items-center justify-center font-inter">
        <p className="text-neutral-400 text-sm">Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-6 sm:py-8 text-white font-inter">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-white">My Profile</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Manage your account information</p>
        </div>

        <div className="space-y-4">
          <div className="border border-white/10 rounded-lg p-4 sm:p-5">
            <h2 className="text-sm font-medium text-neutral-400 mb-4">Personal Information</h2>

            {!isEditing ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                    <User className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-neutral-500 uppercase tracking-wide">Full Name</p>
                    <p className="text-sm font-medium text-white truncate">{user.fullName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-neutral-500 uppercase tracking-wide">Email</p>
                    <p className="text-sm font-medium text-white truncate">{user.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-2 px-4 py-2 text-xs font-medium text-white border border-white/10 rounded-lg"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-3">
                <div>
                  <label htmlFor="fullName" className="block text-[11px] text-neutral-500 uppercase tracking-wide mb-1">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-500 uppercase tracking-wide mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-3 py-2.5 text-sm bg-white/5 border border-white/5 rounded-lg text-neutral-500"
                  />
                  <p className="text-[10px] text-neutral-600 mt-1">Email cannot be changed</p>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-black bg-white rounded-lg disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFullName(user.fullName);
                    }}
                    className="px-4 py-2 text-xs font-medium text-neutral-400 border border-white/10 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="border border-white/10 rounded-lg p-4 sm:p-5">
            <h2 className="text-sm font-medium text-neutral-400 mb-4">Security</h2>

            {!isChangingPassword ? (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white border border-white/10 rounded-lg"
              >
                <Lock className="w-3.5 h-3.5" />
                Change Password
              </button>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-3">
                <div>
                  <label htmlFor="newPassword" className="block text-[11px] text-neutral-500 uppercase tracking-wide mb-1">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-[11px] text-neutral-500 uppercase tracking-wide mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
                    required
                    minLength={6}
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-black bg-white rounded-lg disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {isSaving ? 'Changing...' : 'Update Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    className="px-4 py-2 text-xs font-medium text-neutral-400 border border-white/10 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="border border-white/10 rounded-lg p-4 sm:p-5">
            <h2 className="text-sm font-medium text-neutral-400 mb-3">Account Details</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500">Role</span>
                <span className="text-xs text-white capitalize">{user.role}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500">Member since</span>
                <span className="text-xs text-white">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
