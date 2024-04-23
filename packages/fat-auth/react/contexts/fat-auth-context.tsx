import { createContextAndHook } from 'utilities/react';
import { type User } from '../../core';

export const [FatAuthContext, useFatAuth, useFatAuthWithoutGuarantee] =
  createContextAndHook<{
    isLoggedIn: boolean;
    isLoading: boolean;
    user: User | null;
  }>('FatAuthContext');
