import { useQuery } from '@tanstack/react-query';
import api from '../../../services/api';
import { authStore } from '../../auth/store/auth.store';

export function useProfesionalByUsuario() {
  const user = authStore.getUser();
  const usuarioId = user?.id;

  return useQuery({
    queryKey: ['profesional-by-usuario', usuarioId],
    queryFn: async () => {
      if (!usuarioId) return null;

      const { data } = await api.get(
        `/profesionales/usuario/${usuarioId}`
      );

      return data;
    },
    enabled: !!usuarioId,
  });
}