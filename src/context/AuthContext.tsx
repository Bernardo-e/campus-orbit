"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string | null;
  targetExam?: string | null;
  targetBranch?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem("campus_orbit_user_id", data.user.id);
        } else {
          setUser(null);
          localStorage.removeItem("campus_orbit_user_id");
        }
      } else {
        setUser(null);
        localStorage.removeItem("campus_orbit_user_id");
      }
    } catch (err) {
      console.error("Failed to fetch current user session:", err);
      setUser(null);
      localStorage.removeItem("campus_orbit_user_id");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("campus_orbit_user_id", userData.id);
    document.cookie = `userId=${userData.id}; path=/; max-age=604800; SameSite=Lax`;
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout API error:", err);
    }
    setUser(null);
    localStorage.removeItem("campus_orbit_user_id");
    document.cookie = "userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
