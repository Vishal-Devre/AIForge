import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import type { UserProfile } from "@/types";

// Setup FastAPI backend URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  backendAvailable: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithOAuth: (provider: "google" | "github") => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  backendAvailable: false,
  login: async () => {},
  register: async () => {},
  loginWithOAuth: async () => {},
  logout: async () => {},
});



export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [backendAvailable, setBackendAvailable] = useState(false);

  const fetchBackendProfile = async (
    accessToken: string,
    session: {
      user: {
        id: string;
        email?: string;
        user_metadata?: Record<string, unknown>;
      };
    },
  ) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });

      if (response.status === 401) {
        // The token is invalid or the user was deleted in Supabase.
        // We must clear the stale session.
        console.warn("Backend rejected token (401). Clearing stale session.");
        await supabase.auth.signOut();
        setUser(null);
        setBackendAvailable(true); // The backend itself is online, it just rejected us
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch backend profile: ${response.status} ${response.statusText}`);
      }

      const data: UserProfile = await response.json();
      setUser(data);
      setBackendAvailable(true);
    } catch (error) {
      console.warn(
        "Backend unavailable or network error:",
        error,
      );
      // Backend is genuinely down (e.g., connection refused)
      // We do NOT create a fake authenticated profile anymore.
      setUser(null);
      setBackendAvailable(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Eagerly load the session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        fetchBackendProfile(session.access_token, session);
      } else {
        // No Supabase session — user is a guest, that's fine
        setLoading(false);
      }
    });

    // 2. Listen for auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token) {
        setLoading(true);
        fetchBackendProfile(session.access_token, session);
      } else {
        // Clear React auth state when signed out or token expires
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const register = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });
    if (error) throw error;
  };

  const loginWithOAuth = async (provider: "google" | "github") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + "/",
      },
    });
    if (error) throw error;
  };

  const logout = async () => {
    // Clear Supabase session, which automatically fires onAuthStateChange and sets user to null
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        backendAvailable,
        login,
        register,
        loginWithOAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
