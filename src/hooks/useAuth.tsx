import { createContext, useContext, useState, ReactNode } from "react";

type Role = "guest" | "user" | "admin";

interface AuthContextType {
  role: Role;
  isAuthenticated: boolean;
  setRole: (role: Role) => void;
  login: (role?: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  role: "guest",
  isAuthenticated: false,
  setRole: () => {},
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("guest");
  
  const login = (r: Role = "user") => setRole(r);
  const logout = () => setRole("guest");

  return (
    <AuthContext.Provider value={{ role, isAuthenticated: role !== "guest", setRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
