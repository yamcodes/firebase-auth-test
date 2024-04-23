import { useState, useEffect, type PropsWithChildren } from 'react';
import { FatAuth, type User } from '../../core';
import { FatAuthContext } from '../contexts/fat-auth-context';

export const FatAuthProvider = ({ children }: PropsWithChildren) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = new FatAuth();
    auth.subscribe((incomingUser) => {
      setIsLoggedIn(Boolean(incomingUser));
      setUser(incomingUser);
      setIsLoading(false);
    });

    return () => {
      auth.unsubscribe();
    };
  }, []);

  return (
    <FatAuthContext.Provider value={{ isLoggedIn, isLoading, user }}>
      {children}
    </FatAuthContext.Provider>
  );
};
