import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usuariosService } from '../services/usuarios.service';
import type {
  ActualizarUsuarioDto,
  CrearUsuarioDto,
} from '../types/usuario.types';

export const useUsuarios = () => {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: () => usuariosService.listar(),
  });
};

export const useUsuarioDetail = (id?: number) => {
  return useQuery({
    queryKey: ['usuario-detail', id],
    queryFn: () => usuariosService.buscarPorId(id as number),
    enabled: Boolean(id),
  });
};

export const useCreateUsuario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CrearUsuarioDto) => usuariosService.crear(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
};

export const useUpdateUsuario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: ActualizarUsuarioDto;
    }) => usuariosService.actualizar(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['usuario-detail', variables.id] });
    },
  });
};

export const useDesactivarUsuario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => usuariosService.desactivar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
};
