import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { mockSupabase } from '@/lib/mockData';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateCredits: (credits: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = mockSupabase.auth.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await mockSupabase.auth.signIn({ email, password });
    if (data?.user) {
      setUser(data.user);
    }
    return { error };
  };

  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    const { data, error } = await mockSupabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone } }
    });
    if (data?.user) {
      setUser(data.user);
    }
    return { error };
  };

  const signOut = async () => {
    await mockSupabase.auth.signOut();
    setUser(null);
  };

  const updateCredits = (credits: number) => {
    if (user) {
      const updatedUser = { ...user, credits };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateCredits }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
