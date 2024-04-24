import { useState, useEffect, type PropsWithChildren, useMemo } from 'react';
import { FatAuth, type User } from '../../core';
import { FatAuthContext } from '../contexts/fat-auth-context';

export const FatAuthProvider = ({ children }: PropsWithChildren) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null | undefined>(undefined);

  const auth = useMemo(() => new FatAuth(), []);

  useEffect(() => {
    return auth.subscribe((incomingUser) => {
      setIsLoading(false);
      setIsLoggedIn(Boolean(incomingUser));
      setUser(incomingUser);
    });
  }, []);

  const login = async () => {
    setIsLoading(true);
    await auth.login();
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    await auth.logout();
    setIsLoading(false);
  };

  return (
    <FatAuthContext.Provider
      value={{ isLoggedIn, isLoading, user, login, logout }}
    >
      {children}
    </FatAuthContext.Provider>
  );
};
