import { AuthService } from 'fat-auth';

let authService: AuthService | undefined;

export const getAuthService = (): AuthService => {
  if (!authService) authService = new AuthService();
  return authService;
};
