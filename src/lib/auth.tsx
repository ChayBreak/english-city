import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { backend } from "./backend";
import type { Profile } from "./types";
import { isActive } from "./util";

type AuthState = {
  ready: boolean;
  profile: Profile | null;
  accessUntil: string | null;
  /** Subscription is active, or the viewer is an admin. */
  hasAccess: boolean;
  isAdmin: boolean;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

type Session = { profile: Profile | null; accessUntil: string | null };

async function loadSession(): Promise<Session> {
  try {
    const userId = await backend.currentUserId();
    if (!userId) return { profile: null, accessUntil: null };
    const [profile, accessUntil] = await Promise.all([backend.getProfile(userId), backend.getAccessUntil(userId)]);
    return { profile, accessUntil };
  } catch {
    return { profile: null, accessUntil: null };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [accessUntil, setAccessUntil] = useState<string | null>(null);

  const apply = useCallback((session: Session) => {
    setProfile(session.profile);
    setAccessUntil(session.accessUntil);
    setReady(true);
  }, []);

  const refresh = useCallback(async () => apply(await loadSession()), [apply]);

  useEffect(() => {
    let alive = true;
    const load = () => {
      void loadSession().then((session) => alive && apply(session));
    };
    load();
    const unsubscribe = backend.onAuthChange(load);
    return () => {
      alive = false;
      unsubscribe();
    };
  }, [apply]);

  const isAdmin = profile?.role === "admin";
  return (
    <AuthContext.Provider
      value={{ ready, profile, accessUntil, isAdmin, hasAccess: isAdmin || isActive(accessUntil), refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth outside AuthProvider");
  return value;
}
