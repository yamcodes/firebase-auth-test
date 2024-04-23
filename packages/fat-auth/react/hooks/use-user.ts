import { useFatAuth } from '../contexts';

export const useUser = () => {
  const { isLoggedIn, isLoading, user } = useFatAuth();
  return { isLoggedIn, isLoading, user };
};
