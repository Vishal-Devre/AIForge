import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import type { UserProfile } from "@/types";

// Setup FastAPI backend URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface RegisterResult {
  /**
   * True when Supabase requires email confirmation before a session exists.
   * The UI should then tell the user to check their inbox instead of
   * navigating into the app (which would bounce back to /login).
   */
  needsEmailConfirmation: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  backendAvailable: boolean;
  /** True while a Supabase session exists, even if the backend is unreachable. */
  hasSession: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<RegisterResult>;
  loginWithOAuth: (provider: "google" | "github") => Promise<void>;
  logout: () => Promise<void>;
  /** Manually re-check session + backend profile (used by retry UI). */
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  backendAvailable: false,
  hasSession: false,
  login: async () => {},
  register: async () => ({ needsEmailConfirmation: false }),
  loginWithOAuth: async () => {},
  logout: async () => {},
  refreshAuth: async () => {},
});

/**
 * supabase-js v2 uses an internal auth lock. Calling auth methods (e.g.
 * signOut) synchronously inside an onAuthStateChange callback can deadlock,
 * so any signOut triggered from that flow must be deferred.
 */
function deferredSignOut() {
  setTimeout(() => {
    void supabase.auth.signOut();
  }, 0);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [backendAvailable, setBackendAvailable] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  const fetchBackendProfile = useCallback(async (accessToken: string) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });

      if (response.status === 401) {
        // Token invalid/expired beyond refresh or user deleted in Supabase.
        // Deferred so we never call signOut inside an auth-listener chain.
        console.warn("Backend rejected token (401). Clearing stale session.");
        deferredSignOut();
        setUser(null);
        setBackendAvailable(true); // Backend itself responded — it's online
        setHasSession(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch backend profile: ${response.status} ${response.statusText}`);
      }

      const data: UserProfile = await response.json();
      setUser(data);
      setBackendAvailable(true);
    } catch (error) {
      // Network/backend failure. Keep the Supabase session intact so the
      // user can recover (retry / auto-retry when connectivity returns)
      // instead of being bounced to /login forever.
      console.warn("Backend unavailable or network error:", error);
      setUser(null);
      setBackendAvailable(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const resolveSession = useCallback(
    async (session: { access_token: string } | null | undefined) => {
      if (session?.access_token) {
        setHasSession(true);
        await fetchBackendProfile(session.access_token);
      } else {
        setHasSession(false);
        setUser(null);
        setLoading(false);
      }
    },
    [fetchBackendProfile],
  );

  useEffect(() => {
    let cancelled = false;

    // 1. Eagerly load the session on mount
    void (async () => {
      const { data } = await supabase.auth.getSession();
      if (!cancelled) await resolveSession(data.session);
    })();

    // 2. Listen for auth state changes (login, logout, OAuth return, refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled || event === "INITIAL_SESSION") return; // covered by getSession above

      if (event === "SIGNED_OUT" || !session?.access_token) {
        setHasSession(false);
        setUser(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setHasSession(true);
      void fetchBackendProfile(session.access_token);
    });

    // 3. Auto-recover when connectivity returns after a backend outage
    const handleOnline = () => {
      if (cancelled) return;
      supabase.auth.getSession().then(({ data }) => {
        if (!cancelled && data.session?.access_token) {
          setLoading(true);
          void fetchBackendProfile(data.session.access_token);
        }
      });
    };
    window.addEventListener("online", handleOnline);

    return () => {
      cancelled = true;
      subscription.unsubscribe();
      window.removeEventListener("online", handleOnline);
    };
  }, [fetchBackendProfile, resolveSession]);

  const refreshAuth = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.auth.getSession();
    await resolveSession(data.session);
  }, [resolveSession]);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const register = useCallback(
    async (email: string, password: string, fullName: string): Promise<RegisterResult> => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      if (error) throw error;
      // No session => project requires email confirmation first
      return { needsEmailConfirmation: !data.session };
    },
    [],
  );

  const loginWithOAuth = useCallback(async (provider: "google" | "github") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + "/",
      },
    });
    if (error) throw error;
  }, []);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setHasSession(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        backendAvailable,
        hasSession,
        login,
        register,
        loginWithOAuth,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
