import { type PropsWithChildren } from 'react';
import { FatAuth } from '~/core';

export const LoginButton = ({ children }: PropsWithChildren) => {
  const auth = new FatAuth();

  const handleLogin = () => {
    auth.login();
  };

  return <div onClick={handleLogin}>{children}</div>;
};
