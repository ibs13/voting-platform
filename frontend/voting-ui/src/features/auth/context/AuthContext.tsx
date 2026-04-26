/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, setAuthToken } from "@/shared/api/axios";

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
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setAuthToken(storedToken);
    }

    return storedToken;
  });

  const [role, setRoleState] = useState<Role>(() => {
    const storedRole = localStorage.getItem("role");

    return storedRole === "admin" || storedRole === "voter" ? storedRole : null;
  });

  const [isAuthReady, setIsAuthReady] = useState(false);

  const setElectionId = useCallback((id: string | null) => {
    setElectionIdState(id);

    if (id) {
      localStorage.setItem("electionId", id);
    } else {
      localStorage.removeItem("electionId");
    }
  }, []);

  const setEmail = useCallback((value: string | null) => {
    setEmailState(value);

    if (value) {
      localStorage.setItem("email", value);
    } else {
      localStorage.removeItem("email");
    }
  }, []);

  const setToken = useCallback((value: string | null) => {
    setTokenState(value);

    if (value) {
      localStorage.setItem("token", value);
      setAuthToken(value);
    } else {
      localStorage.removeItem("token");
      setAuthToken(null);
    }
  }, []);

  const setRole = useCallback((value: Role) => {
    setRoleState(value);

    if (value) {
      localStorage.setItem("role", value);
    } else {
      localStorage.removeItem("role");
    }
  }, []);

  const logout = useCallback(() => {
    setTokenState(null);
    setRoleState(null);
    setElectionIdState(null);
    setEmailState(null);

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("electionId");
    localStorage.removeItem("email");

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
        const response = await api.get("/auth/me");
        const savedRole = response.data.role as Role;

        setRoleState(savedRole);

        if (savedRole) {
          localStorage.setItem("role", savedRole);
        } else {
          localStorage.removeItem("role");
        }

        if (savedRole === "voter") {
          if (response.data.electionId) {
            setElectionIdState(response.data.electionId);
            localStorage.setItem("electionId", response.data.electionId);
          }

          if (response.data.email) {
            setEmailState(response.data.email);
            localStorage.setItem("email", response.data.email);
          }
        }

        if (savedRole === "admin") {
          setElectionIdState(null);
          setEmailState(null);
          localStorage.removeItem("electionId");
          localStorage.removeItem("email");
        }
      } catch {
        logout();
      } finally {
        setIsAuthReady(true);
      }
    };

    boot();
  }, [logout]);

  const value = useMemo<AuthState>(
    () => ({
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
    }),
    [
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
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
