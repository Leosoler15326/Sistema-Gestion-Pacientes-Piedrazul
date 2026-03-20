import type { ReactNode } from 'react';
import { authStore } from '../../modules/auth/store/auth.store';
import type { UserRole } from '../../modules/auth/types/auth.types';

interface ProtectedSectionProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: string;
  fallback?: ReactNode;
}

export default function ProtectedSection({
  children,
  allowedRoles,
  requiredPermission,
  fallback = null,
}: ProtectedSectionProps) {
  const user = authStore.getUser();

  if (!user) return <>{fallback}</>;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  if (requiredPermission && !user.permissions.includes(requiredPermission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}