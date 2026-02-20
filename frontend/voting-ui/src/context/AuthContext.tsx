/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { setAuthToken } from "../api/axios";

type AuthState = {
  electionId: string | null;
  email: string | null;
  token: string | null;
  setElectionId: (id: string) => void;
  setEmail: (email: string) => void;
  setToken: (token: string) => void;
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

  // useEffect(() => {
  //   if (token) setAuthToken(token);
  // }, [token]);

  return (
    <AuthContext.Provider
      value={{ electionId, email, token, setElectionId, setEmail, setToken }}
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
