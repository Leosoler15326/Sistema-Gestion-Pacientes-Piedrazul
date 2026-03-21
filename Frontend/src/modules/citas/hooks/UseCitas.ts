import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { citasService } from '../services/citas.service';
import type {
  CancelarCitaRequestDto,
  CreateCitaRequestDto,
  ListarCitasProfesionalParamsDto,
  ReagendarCitaRequestDto,
} from '../types/cita.types';

export const useCitasPorProfesional = (
  params?: ListarCitasProfesionalParamsDto
) => {
  return useQuery({
    queryKey: ['citas-profesional', params],
    queryFn: () => citasService.listarPorProfesional(params as ListarCitasProfesionalParamsDto),
    enabled: Boolean(params?.profesionalId && params?.fecha),
  });
};

export const useCitasPorPaciente = (pacienteId?: number) => {
  return useQuery({
    queryKey: ['citas-paciente', pacienteId],
    queryFn: () => citasService.listarPorPaciente(pacienteId as number),
    enabled: Boolean(pacienteId),
  });
};

export const useCitaDetail = (id?: number) => {
  return useQuery({
    queryKey: ['cita-detail', id],
    queryFn: () => citasService.buscarPorId(id as number),
    enabled: Boolean(id),
  });
};

export const useCreateCita = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCitaRequestDto) => citasService.agendar(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas-profesional'] });
      queryClient.invalidateQueries({ queryKey: ['citas-paciente'] });
    },
  });
};

export const useReagendarCita = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: ReagendarCitaRequestDto;
    }) => citasService.reagendar(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['citas-profesional'] });
      queryClient.invalidateQueries({ queryKey: ['citas-paciente'] });
      queryClient.invalidateQueries({
        queryKey: ['cita-detail', variables.id],
      });
    },
  });
};

export const useCancelarCita = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload?: CancelarCitaRequestDto;
    }) => citasService.cancelar(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas-profesional'] });
      queryClient.invalidateQueries({ queryKey: ['citas-paciente'] });
    },
  });
};