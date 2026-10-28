"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { DEFAULT_CENTER, DEMO_ACCOUNTS } from "@/lib/constants";
import * as store from "@/lib/demo-store";
import type { DemoUser } from "@/lib/demo-seed";
import { isSupabaseConfigured, getSupabase } from "@/lib/supabase";
import type { Profile, Role } from "@/types";

/**
 * Auth facade: real Supabase Auth when configured, otherwise the demo store
 * (seeded accounts, credentials checked client-side — demo mode only).
 */

interface SignUpInput {
  email: string;
  password: string;
  name: string;
  role: Role;
  orgName?: string;
}

interface AuthContextValue {
  user: Profile | null;
  loading: boolean;
  demoMode: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  signInDemo: (role: keyof typeof DEMO_ACCOUNTS) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  demoMode: true,
  signIn: async () => {},
  signUp: async () => {},
  signInDemo: async () => {},
  signOut: async () => {},
  refresh: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

function stripPassword(u: DemoUser): Profile {
  const profile = { ...u } as Record<string, unknown>;
  delete profile.password; // demo-only plaintext creds never leave the store
  return profile as unknown as Profile;
}

function profileFromSupabase(user: { id: string }): Promise<Profile | null> {
  return (async () => {
    const sb = getSupabase()!;
    const { data, error } = await sb
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (data ?? null) as unknown as Profile | null;
  })();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const demo = !isSupabaseConfigured();
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDemoSession = useCallback(() => {
    const id = localStorage.getItem("fb-demo-session");
    if (!id) return setUser(null);
    const u = store.listUsers().find((p) => p.id === id);
    setUser(u ? stripPassword(u) : null);
  }, []);

  useEffect(() => {
    let unsub = () => {};
    const init = async () => {
      try {
        if (demo) loadDemoSession();
        else {
          const sb = getSupabase()!;
          const { data } = await sb.auth.getSession();
          const id = data.session?.user.id;
          setUser(id ? await profileFromSupabase({ id }) : null);
          const { data: sub } = sb.auth.onAuthStateChange(async (event, session) => {
            if (event === "SIGNED_OUT") setUser(null);
            else if (session?.user) setUser(await profileFromSupabase(session.user));
          });
          unsub = sub.subscription.unsubscribe;
        }
      } finally {
        setLoading(false);
      }
    };
    void init();
    return () => {
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = useCallback(async () => {
    if (demo) loadDemoSession();
    else {
      const sb = getSupabase()!;
      const { data } = await sb.auth.getSession();
      if (data.session) setUser(await profileFromSupabase(data.session.user));
    }
  }, [demo, loadDemoSession]);

  const signInDemoMode = useCallback(
    async (email: string, password: string) => {
      const u = store.findUserByEmail(email);
      if (!u || u.password !== password)
        throw new Error("Wrong email or password. Try a demo login below.");
      localStorage.setItem("fb-demo-session", u.id);
      loadDemoSession();
    },
    [loadDemoSession]
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (demo) return signInDemoMode(email, password);
      const sb = getSupabase()!;
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      const { data } = await sb.auth.getSession();
      if (data.session) setUser(await profileFromSupabase(data.session.user));
    },
    [demo, signInDemoMode]
  );

  const signUp = useCallback(
    async (input: SignUpInput) => {
      if (demo) {
        if (store.findUserByEmail(input.email))
          throw new Error("An account with this email already exists (demo data).");
        const u: DemoUser = {
          id: `u_${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`,
          email: input.email,
          name: input.role === "ngo" && input.orgName ? input.orgName : input.name,
          role: input.role,
          orgName: input.orgName,
          approved: input.role !== "ngo",
          address: "Hyderabad (demo)",
          ...DEFAULT_CENTER,
          createdAt: new Date().toISOString(),
          password: input.password,
        };
        store.addUser(u);
        localStorage.setItem("fb-demo-session", u.id);
        loadDemoSession();
        return;
      }
      const sb = getSupabase()!;
      const { data, error } = await sb.auth.signUp({
        email: input.email,
        password: input.password,
      });
      if (error) throw new Error(error.message);
      const uid = data.user?.id;
      if (!uid) throw new Error("Signup succeeded but no user id — confirm your email or try again.");
      const profile: Omit<Profile, "id"> = {
        email: input.email,
        name: input.role === "ngo" && input.orgName ? input.orgName : input.name,
        role: input.role,
        orgName: input.orgName,
        approved: input.role !== "ngo",
        address: null as unknown as string,
        createdAt: new Date().toISOString(),
      };
      const { error: pErr } = await sb
        .from("profiles")
        .insert({ id: uid, ...profile, address: "" });
      if (pErr) throw new Error(pErr.message);
      setUser(await profileFromSupabase({ id: uid }));
    },
    [demo, loadDemoSession]
  );

  const signInDemo = useCallback(
    async (role: keyof typeof DEMO_ACCOUNTS) => {
      const acc = DEMO_ACCOUNTS[role];
      return signIn(acc.email, acc.password);
    },
    [signIn]
  );

  const signOut = useCallback(async () => {
    if (demo) {
      localStorage.removeItem("fb-demo-session");
      setUser(null);
    } else {
      await getSupabase()!.auth.signOut();
      setUser(null);
    }
  }, [demo]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        demoMode: demo,
        signIn,
        signUp,
        signInDemo,
        signOut,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/** Quick, purely client-side redirect helper for guards. */
export function roleHome(role: Role | null): string {
  switch (role) {
    case "donor":
      return "/donor/new";
    case "ngo":
      return "/browse";
    case "volunteer":
      return "/volunteer/tasks";
    case "admin":
      return "/admin";
    default:
      return "/";
  }
}
