import React, { useEffect, useState } from 'react';
import { Shield, Users, Ban, CheckCircle } from 'lucide-react';
import { supabase, Profile } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Admin = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        return;
      }

      setIsAdmin(data.is_admin);
    };

    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      setUsers(data || []);
    };

    if (isAdmin) {
      fetchUsers();
      // Subscribe to realtime updates
      const subscription = supabase
        .channel('public:profiles')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'profiles' 
        }, fetchUsers)
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isAdmin]);

  const updateUserStatus = async (userId: string, status: 'active' | 'suspended') => {
    const { error } = await supabase
      .from('profiles')
      .update({ status })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user status:', error);
      return;
    }
  };

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{users.length} total users</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Security</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Last Login</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-gray-900">{profile.name}</div>
                      <div className="text-sm text-gray-500">{profile.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${profile.status === 'active' ? 'bg-green-100 text-green-800' :
                        profile.status === 'suspended' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                      {profile.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          profile.settings.twoFactorEnabled ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                        <span className="text-sm text-gray-600">2FA</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {profile.loginAttempts > 0 && `${profile.loginAttempts} failed attempts`}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {profile.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleString() : 'Never'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      {profile.status === 'active' ? (
                        <button
                          onClick={() => updateUserStatus(profile.id, 'suspended')}
                          className="text-red-600 hover:text-red-700"
                          title="Suspend user"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => updateUserStatus(profile.id, 'active')}
                          className="text-green-600 hover:text-green-700"
                          title="Activate user"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users yet</h3>
            <p className="text-gray-600">Users will appear here when they sign up.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;