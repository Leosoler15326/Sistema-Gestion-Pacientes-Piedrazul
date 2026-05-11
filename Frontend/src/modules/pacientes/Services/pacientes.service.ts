import api from '../../../services/api';
import type {
  ActualizarPacienteDto,
  CompletarPerfilPacienteDto,
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

  async sugerenciasPorDocumento(prefijo: string): Promise<PacienteDto[]> {
    if (!prefijo || prefijo.trim().length < 2) return [];
    const { data } = await api.get<PacienteDto[]>(
      `${PACIENTES_BASE}/sugerencias-documento`,
      { params: { prefijo: prefijo.trim() } }
    );
    return data;
  },

  async obtenerMiPerfilPaciente(): Promise<PacienteDto | null> {
    try {
      const { data } = await api.get<PacienteDto>(`${PACIENTES_BASE}/mi-perfil`);
      return data;
    } catch (e: unknown) {
      const status = (e as { response?: { status?: number } })?.response?.status;
      if (status === 404) return null;
      throw e;
    }
  },

  async completarMiPerfil(payload: CompletarPerfilPacienteDto): Promise<PacienteDto> {
    const { data } = await api.post<PacienteDto>(
      `${PACIENTES_BASE}/mi-perfil`,
      payload
    );
    return data;
  },
};