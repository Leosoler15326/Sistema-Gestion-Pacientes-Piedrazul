import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profesionalesService } from '../services/profesionales.service';
import type {
  ActualizarProfesionalDto,
  CrearProfesionalDto,
  FranjaHorariaDto,
} from '../types/profesional.types';
import { authStore } from '../../auth/store/auth.store';

export const useProfesionales = () => {
  const user = authStore.getUser();

  const normalizedRole = String(user?.rol ?? '')
    .toUpperCase()
    .replace('ROLE_', '');

  const esAdmin = normalizedRole === 'ADMINISTRADOR';

  return useQuery({
    queryKey: ['profesionales', normalizedRole],
    queryFn: () =>
      esAdmin
        ? profesionalesService.listar()
        : profesionalesService.listarActivos(),
  });
};

export const useProfesionalesActivos = () => {
  return useQuery({
    queryKey: ['profesionales-activos'],
    queryFn: () => profesionalesService.listarActivos(),
  });
};

export const useProfesionalesPorEspecialidad = (especialidad?: string) => {
  return useQuery({
    queryKey: ['profesionales-especialidad', especialidad],
    queryFn: () => profesionalesService.listarPorEspecialidad(especialidad as string),
    enabled: Boolean(especialidad),
  });
};

export const useProfesionalDetail = (id?: number) => {
  return useQuery({
    queryKey: ['profesional-detail', id],
    queryFn: () => profesionalesService.buscarPorId(id as number),
    enabled: Boolean(id),
  });
};

export const useCreateProfesional = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CrearProfesionalDto) =>
      profesionalesService.crear(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profesionales'] });
      queryClient.invalidateQueries({ queryKey: ['profesionales-activos'] });
    },
  });
};

export const useUpdateProfesional = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ActualizarProfesionalDto }) =>
      profesionalesService.actualizar(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profesionales'] });
      queryClient.invalidateQueries({ queryKey: ['profesionales-activos'] });
      queryClient.invalidateQueries({ queryKey: ['profesional-detail', variables.id] });
    },
  });
};

export const useCambiarEstadoProfesional = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: string }) =>
      profesionalesService.cambiarEstado(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profesionales'] });
      queryClient.invalidateQueries({ queryKey: ['profesionales-activos'] });
    },
  });
};

export const useFranjasProfesional = (id?: number) => {
  return useQuery({
    queryKey: ['profesional-franjas', id],
    queryFn: () => profesionalesService.listarFranjas(id as number),
    enabled: Boolean(id),
  });
};

export const useActualizarFranjasProfesional = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, franjas }: { id: number; franjas: FranjaHorariaDto[] }) =>
      profesionalesService.actualizarFranjas(id, franjas),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profesional-franjas', variables.id] });
    },
  });
};