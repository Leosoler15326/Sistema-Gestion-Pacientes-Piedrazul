import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { citasService } from '../services/citas.service';
import type {
  CitasFiltersDto,
  CreateCitaRequestDto,
  ReagendarCitaRequestDto,
} from '../types/cita.types';

export const useCitas = (filters?: CitasFiltersDto) => {
  return useQuery({
    queryKey: ['citas', filters],
    queryFn: () => citasService.getAll(filters),
  });
};

export const useCitaDetail = (id?: number) => {
  return useQuery({
    queryKey: ['cita-detail', id],
    queryFn: () => citasService.getById(id as number),
    enabled: Boolean(id),
  });
};

export const useCreateCita = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCitaRequestDto) => citasService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas'] });
    },
  });
};

export const useCancelCita = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => citasService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas'] });
    },
  });
};

export const useReagendarCita = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ReagendarCitaRequestDto }) =>
      citasService.reagendar(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas'] });
      queryClient.invalidateQueries({ queryKey: ['cita-detail'] });
    },
  });
};