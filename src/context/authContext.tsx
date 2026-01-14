import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthContextType } from "./authContextType";

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const BASE_URL = import.meta.env.VITE_API_URL;

interface Props {
  children: ReactNode;
}

interface JwtPayload {
  userId: string;
  email: string;
}

export const AuthProvider = ({ children }: Props) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [userId, setUserId] = useState<string | null>(() =>
    localStorage.getItem("userId")
  );
  const [email, setEmail] = useState<string | null>(() =>
    localStorage.getItem("email")
  );

  const isAuthenticated = Boolean(token);

  const saveAuth = (token: string, userId: string, email: string) => {
    setToken(token);
    setUserId(userId);
    setEmail(email);

    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("email", email);
  };

  const decodeToken = (token: string): JwtPayload => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      throw new Error("Invalid token");
    }
  };

  const login = async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");

    const decoded = decodeToken(data.token);
    saveAuth(data.token, decoded.userId, decoded.email);
  };

  const signup = async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Signup failed");

    const decoded = decodeToken(data.token);
    saveAuth(data.token, decoded.userId, decoded.email);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    setEmail(null);

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        email,
        isAuthenticated,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
