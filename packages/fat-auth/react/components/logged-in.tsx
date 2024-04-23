import { type PropsWithChildren } from 'react';
import { useFatAuth } from '../contexts';

export const LoggedIn = ({ children }: PropsWithChildren) => {
  const { user } = useFatAuth();

  console.log('Checking if logged in');
  if (!user) return null;
  console.log('LoggedIn', user);
  return <>{children}</>;
};
