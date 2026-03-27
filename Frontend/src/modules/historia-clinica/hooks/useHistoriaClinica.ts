import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { historiaClinicaService } from '../services/HistoriaClinica.service';
import type {
  CreateHistoriaClinicaRequestDto,
  UpdateHistoriaClinicaRequestDto,
} from '../types/historiaClinica.types';

export const useHistoriaPorCita = (citaId?: number) => {
  return useQuery({
    queryKey: ['historia-cita', citaId],
    queryFn: () => historiaClinicaService.getByCitaId(citaId as number),
    enabled: Boolean(citaId),
  });
};

export const useHistoriasPorPaciente = (pacienteId?: number) => {
  return useQuery({
    queryKey: ['historias-paciente', pacienteId],
    queryFn: () => historiaClinicaService.getByPacienteId(pacienteId as number),
    enabled: Boolean(pacienteId),
  });
};

export const useHistoriasPorProfesional = (profesionalId?: number) => {
  return useQuery({
    queryKey: ['historias-profesional', profesionalId],
    queryFn: () => historiaClinicaService.getByProfesionalId(profesionalId as number),
    enabled: Boolean(profesionalId),
  });
};

export const useCreateHistoriaClinica = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateHistoriaClinicaRequestDto) =>
      historiaClinicaService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historias-paciente'] });
      queryClient.invalidateQueries({ queryKey: ['historias-profesional'] });
      queryClient.invalidateQueries({ queryKey: ['historia-cita'] });
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
      queryClient.invalidateQueries({ queryKey: ['historias-paciente'] });
      queryClient.invalidateQueries({ queryKey: ['historias-profesional'] });
      queryClient.invalidateQueries({ queryKey: ['historia-cita'] });
      queryClient.invalidateQueries({ queryKey: ['historia-detail', variables.id] });
    },
  });
};