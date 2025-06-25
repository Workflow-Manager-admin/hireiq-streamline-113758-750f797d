import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

// PUBLIC_INTERFACE
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // {id, email, role, ...}
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        fetchProfile(data.session);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfile(session);
      } else {
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
    // eslint-disable-next-line
  }, []);

  async function fetchProfile(session) {
    // Ideally, roles are stored in Supabase 'profiles' table
    let { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    if (!error && profile) {
      setUser({
        id: profile.id,
        email: profile.email,
        role: profile.role,
        name: profile.name,
        ...profile
      });
    } else {
      setUser({ id: session.user.id, email: session.user.email, role: 'candidate' }); // fallback
    }
  }

  // PUBLIC_INTERFACE
  async function signUp({ email, password, role, name }) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    // Insert to 'profiles'
    await supabase.from('profiles').upsert([
      { id: data.user.id, email, role, name }
    ]);
    setUser({ id: data.user.id, email, role, name });
  }

  // PUBLIC_INTERFACE
  async function signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // Fetch role
    fetchProfile(data.session);
  }

  // PUBLIC_INTERFACE
  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  const value = { user, loading, signUp, signIn, signOut };
  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
