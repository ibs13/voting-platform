/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { setAuthToken, setAuthRole, api } from "../api/axios";

type AuthState = {
  electionId: string | null;
  email: string | null;
  token: string | null;
  role: string | null;
  setElectionId: (id: string) => void;
  setEmail: (email: string) => void;
  setToken: (token: string) => void;
  setRole: (role: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [electionId, setElectionIdState] = useState<string | null>(() =>
    localStorage.getItem("electionId"),
  );

  const [email, setEmailState] = useState<string | null>(() =>
    localStorage.getItem("email"),
  );

  const [token, setTokenState] = useState<string | null>(() => {
    const stored = localStorage.getItem("token");
    if (stored) {
      setAuthToken(stored); // 🔥 set axios header immediately
    }
    return stored;
  });

  const [role, setRoleState] = useState<string | null>(() => {
    const stored = localStorage.getItem("role");
    if (stored) {
      setAuthRole(stored); // 🔥 set axios header immediately
    }
    return stored;
  });

  useEffect(() => {
    const boot = async () => {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) return;

      setTokenState(savedToken);
      setAuthToken(savedToken);

      try {
        const res = await api.get("/auth/me");
        const r = res.data.role as "admin" | "voter";

        setRoleState(r);
        localStorage.setItem("role", r);

        if (r === "voter") {
          if (res.data.electionId) {
            setElectionIdState(res.data.electionId);
            localStorage.setItem("electionId", res.data.electionId);
          }
          if (res.data.email) {
            setEmailState(res.data.email);
            localStorage.setItem("email", res.data.email);
          }
        }
      } catch {
        // token invalid/expired
      }
    };

    boot();
  }, []);

  const setElectionId = (id: string) => {
    setElectionIdState(id);
    localStorage.setItem("electionId", id);
  };

  const setEmail = (value: string) => {
    setEmailState(value);
    localStorage.setItem("email", value);
  };

  const setToken = (value: string) => {
    setTokenState(value);
    localStorage.setItem("token", value);
    setAuthToken(value);
  };

  const setRole = (value: string) => {
    setRoleState(value);
    localStorage.setItem("role", value);
    setAuthRole(value);
  };

  const logout = () => {
    setTokenState(null);
    setRoleState(null);
    setElectionId("");
    setEmail("");

    localStorage.removeItem("token");
    localStorage.removeItem("electionId");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    setAuthToken(null);
    setAuthRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        electionId,
        email,
        token,
        role,
        setElectionId,
        setEmail,
        setToken,
        setRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");

  return context;
}
