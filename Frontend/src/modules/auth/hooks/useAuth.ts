import { useMemo } from 'react';
import { authStore } from '../store/auth.store';
import type { UserRole } from '../types/auth.types';

export const useAuth = () => {
  const token = authStore.getToken();
  const user = authStore.getUser();

  const isAuthenticated = Boolean(token);

  const hasRole = (roles: UserRole[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  return useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
      hasRole,
      hasPermission,
    }),
    [token, user, isAuthenticated]
  );
};