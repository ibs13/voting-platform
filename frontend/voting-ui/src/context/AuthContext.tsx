/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

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
  const [electionId, setElectionId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

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
