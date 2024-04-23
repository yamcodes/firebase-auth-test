import { FatAuth } from 'fat-auth/core';

let fatAuth: FatAuth | undefined;

export const getFatAuth = (): FatAuth => {
  if (!fatAuth) fatAuth = new FatAuth();
  return fatAuth;
};
