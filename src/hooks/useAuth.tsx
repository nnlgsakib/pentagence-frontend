import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { authApi, type User } from "@/lib/api";
import { clearStoredUser, clearTokens } from "@/lib/auth-storage";

type Role = "guest" | "user" | "admin";

interface AuthContextType {
  role: Role;
  user: User | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  role: "guest",
  user: null,
  isAuthenticated: false,
  isReady: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  logoutAll: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = authApi.getStoredUser();
    if (!stored) {
      return null;
    }

    return {
      id: stored.id,
      email: stored.email,
      role: stored.role,
    };
  });

  const login = async (email: string, password: string) => {
    const loggedUser = await authApi.login(email, password);
    setUser(loggedUser);
  };

  const register = async (email: string, password: string) => {
    await authApi.register(email, password);
    const loggedUser = await authApi.login(email, password);
    setUser(loggedUser);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const logoutAll = async () => {
    try {
      await authApi.logoutAll();
    } finally {
      clearTokens();
      clearStoredUser();
      setUser(null);
    }
  };

  const role: Role = user?.role || "guest";

  const value = useMemo(
    () => ({
      role,
      user,
      isAuthenticated: role !== "guest",
      isReady: true,
      login,
      register,
      logout,
      logoutAll,
    }),
    [role, user],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
