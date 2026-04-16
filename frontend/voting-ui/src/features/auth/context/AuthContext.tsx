/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { setAuthToken, api } from "@/shared/api/axios";

type Role = "admin" | "voter" | null;

type AuthState = {
  electionId: string | null;
  email: string | null;
  token: string | null;
  role: Role;
  setElectionId: (id: string | null) => void;
  setEmail: (email: string | null) => void;
  setToken: (token: string | null) => void;
  setRole: (role: Role) => void;
  isAuthReady: boolean;
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

  const [role, setRoleState] = useState<Role>(() => {
    const stored = localStorage.getItem("role");
    return stored === "admin" || stored === "voter" ? stored : null;
  });

  const [isAuthReady, setIsAuthReady] = useState(false);

  const setElectionId = (id: string | null) => {
    setElectionIdState(id);
    if (id) {
      localStorage.setItem("electionId", id);
    } else {
      localStorage.removeItem("electionId");
    }
  };

  const setEmail = (value: string | null) => {
    setEmailState(value);
    if (value) {
      localStorage.setItem("email", value);
    } else {
      localStorage.removeItem("email");
    }
  };

  const setToken = (value: string | null) => {
    setTokenState(value);
    if (value) {
      localStorage.setItem("token", value);
      setAuthToken(value);
    } else {
      localStorage.removeItem("token");
      setAuthToken(null);
    }
  };

  const setRole = (value: Role) => {
    setRoleState(value);
    if (value) {
      localStorage.setItem("role", value);
    } else {
      localStorage.removeItem("role");
    }
  };

  const logout = useCallback(() => {
    setTokenState(null);
    setRoleState(null);
    setElectionIdState(null);
    setEmailState(null);

    localStorage.removeItem("token");
    localStorage.removeItem("electionId");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    setAuthToken(null);
  }, []);

  useEffect(() => {
    const boot = async () => {
      const savedToken = localStorage.getItem("token");

      if (!savedToken) {
        setIsAuthReady(true);
        return;
      }

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
        } else {
          setElectionIdState(null);
          setEmailState(null);
          localStorage.removeItem("electionId");
          localStorage.removeItem("email");
        }
      } catch {
        // token invalid/expired
        logout();
      } finally {
        setIsAuthReady(true);
      }
    };

    boot();
  }, [logout]);

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
        isAuthReady,
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
