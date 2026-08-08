"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  fetchCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "@/lib/auth-api";

import type {
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  authenticated: boolean;
  login: (
    request: LoginRequest,
  ) => Promise<void>;
  register: (
    request: RegisterRequest,
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [loading, setLoading] =
    useState(true);

  const refreshUser =
    useCallback(async () => {
        try {
        const currentUser =
            await fetchCurrentUser();

        setUser(currentUser);
        } catch {
        setUser(null);
        }
    }, []);

  useEffect(() => {
  let active = true;

  async function restoreSession() {
    try {
      const currentUser =
        await fetchCurrentUser();

      if (active) {
        setUser(currentUser);
      }
    } catch {
      if (active) {
        setUser(null);
      }
    } finally {
      if (active) {
        setLoading(false);
      }
    }
  }

  void restoreSession();

  return () => {
    active = false;
  };
}, []);

  const login = useCallback(
  async (
    request: LoginRequest,
  ): Promise<void> => {
    setUser(null);

    const response =
      await loginUser(request);

    setUser(response.user);
  },
  [],
);

  const register = useCallback(
  async (
    request: RegisterRequest,
  ): Promise<void> => {
    setUser(null);

    await registerUser(request);

    const response = await loginUser({
      email: request.email,
      password: request.password,
    });

    setUser(response.user);
  },
  [],
);

  const logout = useCallback(
  async (): Promise<void> => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  }, 
  [],
);

  const value = useMemo(
    () => ({
      user,
      loading,
      authenticated: user !== null,
      login,
      register,
      logout,
      refreshUser,
    }),
    [
      user,
      loading,
      login,
      register,
      logout,
      refreshUser,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider.",
    );
  }

  return context;
}