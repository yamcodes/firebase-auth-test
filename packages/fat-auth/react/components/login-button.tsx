import { type PropsWithChildren } from 'react';
import { FatAuth } from '../../core';

export const LoginButton = ({ children }: PropsWithChildren) => {
  const auth = new FatAuth();

  const handleLogin = async () => {
    await auth.login();
  };

  return (
    <div
      onClick={() => {
        void handleLogin();
      }}
    >
      {children}
    </div>
  );
};
