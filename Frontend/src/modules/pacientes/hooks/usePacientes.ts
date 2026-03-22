import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pacientesService } from '../Services/pacientes.service';
import type {
  ActualizarPacienteDto,
  CrearPacienteDto,
} from '../types/paciente.types';

export const usePacientes = () => {
  return useQuery({
    queryKey: ['pacientes'],
    queryFn: () => pacientesService.listar(),
  });
};

export const usePacientesPorNombre = (nombre?: string) => {
  return useQuery({
    queryKey: ['pacientes-buscar', nombre],
    queryFn: () => pacientesService.buscarPorNombre(nombre as string),
    enabled: Boolean(nombre && nombre.trim()),
  });
};

export const usePacientePorDocumento = (documento?: string) => {
  return useQuery({
    queryKey: ['paciente-documento', documento],
    queryFn: () => pacientesService.buscarPorDocumento(documento as string),
    enabled: Boolean(documento && documento.trim()),
  });
};

export const usePacienteDetail = (id?: number) => {
  return useQuery({
    queryKey: ['paciente-detail', id],
    queryFn: () => pacientesService.buscarPorId(id as number),
    enabled: Boolean(id),
  });
};


export const useCreatePaciente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CrearPacienteDto) => pacientesService.crear(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      queryClient.invalidateQueries({ queryKey: ['pacientes-buscar'] });
    },
  });
};

export const useUpdatePaciente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: ActualizarPacienteDto;
    }) => pacientesService.actualizar(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      queryClient.invalidateQueries({ queryKey: ['pacientes-buscar'] });
      queryClient.invalidateQueries({ queryKey: ['paciente-detail', variables.id] });
    },
  });
};