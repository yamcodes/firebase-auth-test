import { type PropsWithChildren } from 'react';
import { useFatAuth } from '../contexts';

export const LoggedOut = ({ children }: PropsWithChildren) => {
  const { user } = useFatAuth();

  if (!user) return <>{children}</>;
  return null;
};
