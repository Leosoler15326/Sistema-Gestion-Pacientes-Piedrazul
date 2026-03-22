import type { ReactNode } from 'react';
import { authStore } from '../../modules/auth/store/auth.store';
import type { UserRole } from '../../modules/auth/types/auth.types';

interface ProtectedSectionProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  fallback?: ReactNode;
}

export default function ProtectedSection({
  children,
  allowedRoles,
  fallback = null,
}: ProtectedSectionProps) {
  const user = authStore.getUser();

  if (!user) return <>{fallback}</>;

  if (allowedRoles) {
    const normalizedRole = String(user.rol).toUpperCase().replace('ROLE_', '');
    const normalizedAllowedRoles = allowedRoles.map((role) =>
      String(role).toUpperCase().replace('ROLE_', '')
    );

    if (!normalizedAllowedRoles.includes(normalizedRole)) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}