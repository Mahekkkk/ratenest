import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./auth-context";
import {
  clearSession,
  getSavedUser,
  saveSession,
  setUnauthorizedHandler,
} from "../services/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser);

  const signIn = useCallback((token, nextUser) => {
    saveSession(token, nextUser);
    setUser(nextUser);
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  // An expired or rejected token on any request ends the session.
  useEffect(() => {
    setUnauthorizedHandler(signOut);
  }, [signOut]);

  const value = useMemo(() => ({ user, signIn, signOut }), [user, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
