
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { historiaClinicaService } from '../services/HistoriaClinica.service';
import type {
  CreateHistoriaClinicaRequestDto,
  HistoriaClinicaFiltersDto,
  UpdateHistoriaClinicaRequestDto,
} from '../types/historiaClinica.types';

export const useHistoriasClinicas = (filters?: HistoriaClinicaFiltersDto) => {
  return useQuery({
    queryKey: ['historias-clinicas', filters],
    queryFn: () => historiaClinicaService.getAll(filters),
  });
};

export const useHistoriaClinicaDetail = (id?: number) => {
  return useQuery({
    queryKey: ['historia-clinica-detail', id],
    queryFn: () => historiaClinicaService.getById(id as number),
    enabled: Boolean(id),
  });
};

export const useCreateHistoriaClinica = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateHistoriaClinicaRequestDto) =>
      historiaClinicaService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historias-clinicas'] });
    },
  });
};

export const useUpdateHistoriaClinica = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateHistoriaClinicaRequestDto;
    }) => historiaClinicaService.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['historias-clinicas'] });
      queryClient.invalidateQueries({
        queryKey: ['historia-clinica-detail', variables.id],
      });
    },
  });
};