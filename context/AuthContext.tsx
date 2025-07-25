"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { app } from "@/lib/firebase.config";

interface AuthContextType {
  user: User | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsub();
  }, []);

  const logout = () => signOut(getAuth(app));

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
