import api from '../../../services/api';
import type {
  ActualizarPacienteDto,
  CrearPacienteDto,
  PacienteDto,
} from '../types/paciente.types';

const PACIENTES_BASE = '/pacientes';

export const pacientesService = {
  async listar(): Promise<PacienteDto[]> {
    const { data } = await api.get<PacienteDto[]>(PACIENTES_BASE);
    return data;
  },

  async buscarPorNombre(nombre: string): Promise<PacienteDto[]> {
    const { data } = await api.get<PacienteDto[]>(`${PACIENTES_BASE}/buscar`, {
      params: { nombre },
    });
    return data;
  },

  async buscarPorDocumento(documento: string): Promise<PacienteDto> {
    const { data } = await api.get<PacienteDto>(
      `${PACIENTES_BASE}/documento/${documento}`
    );
    return data;
  },

  async buscarPorId(id: number): Promise<PacienteDto> {
    const { data } = await api.get<PacienteDto>(`${PACIENTES_BASE}/${id}`);
    return data;
  },

  async crear(payload: CrearPacienteDto): Promise<PacienteDto> {
    const { data } = await api.post<PacienteDto>(PACIENTES_BASE, payload);
    return data;
  },

  async actualizar(id: number, payload: ActualizarPacienteDto): Promise<PacienteDto> {
    const { data } = await api.put<PacienteDto>(`${PACIENTES_BASE}/${id}`, payload);
    return data;
  },
};