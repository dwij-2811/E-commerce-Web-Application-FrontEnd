import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AuthContextType {
  authToken: string | null;

  resetMessage: string | null;
  resetMessageSet: (token: string) => void;
  resetMessageRemove: () => void;

  setAuthToken: (token: string | null) => void;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
    children: ReactNode;
  }

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setAuthToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('resetMessage');
    if (storedToken) {
      setResetMessage(storedToken);
    }
  }, []);

  const login = (token: string) => {
    setAuthToken(token);
    localStorage.setItem('authToken', token);
  };

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem('authToken');
  };

  const resetMessageSet = (message: string) => {
    setResetMessage(message);
    localStorage.setItem('resetMessage', message);
  };

  const resetMessageRemove = () => {
    setResetMessage(null);
    localStorage.removeItem('resetMessage');
  };

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken, login, logout, resetMessage, resetMessageSet, resetMessageRemove }}>
      {children}
    </AuthContext.Provider>
  );
}
