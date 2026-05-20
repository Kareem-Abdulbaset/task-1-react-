import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getCurrentUserRequest, loginRequest } from "../api/authApi.js";
import {
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
  getApiErrorMessage,
} from "../api/apiClient.js";

const AuthContext = createContext(null);

function getStoredUser() {
  const rawUser = localStorage.getItem(USER_STORAGE_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

function getTokenFromPayload(payload) {
  return payload?.token || payload?.access || payload?.access_token || payload?.key;
}

function getUserFromPayload(payload) {
  return payload?.user || payload?.profile || null;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem(TOKEN_STORAGE_KEY),
  );
  const [user, setUser] = useState(getStoredUser);
  const [isUserLoading, setIsUserLoading] = useState(false);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async (credentials) => {
    const payload = await loginRequest(credentials);
    const nextToken = getTokenFromPayload(payload);
    const nextUser = getUserFromPayload(payload);

    if (!nextToken) {
      throw new Error("Login succeeded but no token was returned.");
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    setToken(nextToken);

    if (nextUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
      setUser(nextUser);
    }

    return payload;
  }, []);

  const refreshUser = useCallback(async () => {
    if (!localStorage.getItem(TOKEN_STORAGE_KEY)) {
      return null;
    }

    setIsUserLoading(true);

    try {
      const nextUser = await getCurrentUserRequest();
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
      setUser(nextUser);
      return nextUser;
    } finally {
      setIsUserLoading(false);
    }
  }, []);

  useEffect(() => {
    function handleAuthExpired() {
      clearSession();
    }

    window.addEventListener("auth:expired", handleAuthExpired);
    return () => window.removeEventListener("auth:expired", handleAuthExpired);
  }, [clearSession]);

  useEffect(() => {
    if (token && !user) {
      refreshUser().catch(() => {
        clearSession();
      });
    }
  }, [clearSession, refreshUser, token, user]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isUserLoading,
      login,
      logout: clearSession,
      refreshUser,
      getApiErrorMessage,
    }),
    [clearSession, isUserLoading, login, refreshUser, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
