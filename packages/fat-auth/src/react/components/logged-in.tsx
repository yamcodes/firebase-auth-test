import { type PropsWithChildren } from 'react';
import { useFatAuth } from '../contexts';

export const LoggedIn = ({ children }: PropsWithChildren) => {
  const { user } = useFatAuth();
  if (!user) return null;
  return <>{children}</>;
};
