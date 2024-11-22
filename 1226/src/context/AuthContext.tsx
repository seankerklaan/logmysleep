import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, type Profile } from '../lib/supabase';

interface UserSettings {
  phone?: string;
  smsReminders: boolean;
  emailAlerts: boolean;
  twoFactorEnabled: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateUserSettings: (settings: UserSettings) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  const sendWelcomeSMS = async (phone: string) => {
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/send-welcome`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone })
      });

      if (!response.ok) throw new Error('Failed to send welcome SMS');
    } catch (error) {
      console.error('Error sending welcome SMS:', error);
    }
  };

  const signup = async (email: string, password: string, phone: string) => {
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            phone,
            name: email.split('@')[0],
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error('No user returned after signup');

      // Send welcome SMS
      await sendWelcomeSMS(phone);

      return data.user;
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.message.includes('duplicate key')) {
        throw new Error('An account with this email already exists');
      }
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateUserSettings = async (settings: UserSettings) => {
    if (!user || !profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          settings: {
            ...profile.settings,
            ...settings,
          },
        })
        .eq('id', user.id);

      if (error) throw error;
      await fetchProfile(user.id);
    } catch (error: any) {
      console.error('Settings update error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user,
        profile,
        login, 
        signup,
        logout, 
        isAuthenticated: !!user, 
        updateUserSettings
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};