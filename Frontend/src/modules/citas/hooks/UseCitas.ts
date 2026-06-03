import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { citasService } from '../services/citas.service';
import type {
  AgendarContactoRequestDto,
  CancelarCitaRequestDto,
  CreateCitaRequestDto,
  ListarCitasProfesionalParamsDto,
  ReagendarCitaRequestDto,
} from '../types/cita.types';

export function useCreateCita() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCitaRequestDto) => citasService.agendar(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas'] });
    },
  });
}

export function useAgendarDesdeContacto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AgendarContactoRequestDto) =>
      citasService.agendarDesdeContacto(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas'] });
    },
  });
}

export function useReagendarCita() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: ReagendarCitaRequestDto;
    }) => citasService.reagendar(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas'] });
    },
  });
}

export function useCancelarCita() {
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
      queryClient.invalidateQueries({ queryKey: ['citas'] });
    },
  });
}

export function useCitasPorProfesional(
  params?: ListarCitasProfesionalParamsDto
) {
  return useQuery({
    queryKey: ['citas', 'profesional', params],
    queryFn: () => citasService.listarPorProfesional(params!),
    enabled: Boolean(params?.profesionalId && params?.fechaDesde),
  });
}

export function useCitasPorPaciente(pacienteId?: number) {
  return useQuery({
    queryKey: ['citas', 'paciente', pacienteId],
    queryFn: () => citasService.listarPorPaciente(pacienteId!),
    enabled: Boolean(pacienteId),
  });
}

export function useMisCitasPaciente() {
  return useQuery({
    queryKey: ['citas', 'mis-citas'],
    queryFn: () => citasService.listarMisCitasPaciente(),
  });
}

export function useCita(id?: number) {
  return useQuery({
    queryKey: ['citas', 'detalle', id],
    queryFn: () => citasService.buscarPorId(id!),
    enabled: Boolean(id),
  });
}

export const useCitaDetail = useCita;

export function useCambiarEstadoCita() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      estado,
      observacion,
    }: {
      id: number;
      estado: string;
      observacion?: string;
    }) => citasService.cambiarEstado(id, estado, observacion),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['citas'] });
      queryClient.invalidateQueries({ queryKey: ['citas', 'detalle', variables.id] });
    },
  });
}