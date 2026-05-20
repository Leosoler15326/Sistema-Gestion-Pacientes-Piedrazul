import { useCallback, useMemo } from 'react';
import { authStore } from '../store/auth.store';
import type { UserRole } from '../types/auth.types';

export const useAuth = () => {
  const accessToken = authStore.getAccessToken();
  const refreshToken = authStore.getRefreshToken();
  const user = authStore.getUser();

  const isAuthenticated = Boolean(accessToken);

  const hasAnyRole = useCallback(
    (roles: UserRole[]) => {
      if (!user) return false;
      return roles.includes(user.rol);
    },
    [user]
  );

  return useMemo(
    () => ({
      accessToken,
      refreshToken,
      user,
      isAuthenticated,
      hasAnyRole,
    }),
    [accessToken, refreshToken, user, isAuthenticated, hasAnyRole]
  );
};