import api from '../../../services/api';
import type {
  ActualizarProfesionalDto,
  CrearProfesionalDto,
  FranjaHorariaDto,
  ProfesionalDto,
} from '../types/profesional.types';

const PROFESIONALES_BASE = '/profesionales';

export const profesionalesService = {
  async listar(): Promise<ProfesionalDto[]> {
    const { data } = await api.get<ProfesionalDto[]>(PROFESIONALES_BASE);
    return data;
  },

  async listarActivos(): Promise<ProfesionalDto[]> {
    const { data } = await api.get<ProfesionalDto[]>(`${PROFESIONALES_BASE}/activos`);
    return data;
  },

  async listarPorEspecialidad(especialidad: string): Promise<ProfesionalDto[]> {
    const { data } = await api.get<ProfesionalDto[]>(
      `${PROFESIONALES_BASE}/especialidad/${especialidad}`
    );
    return data;
  },

  async buscarPorId(id: number): Promise<ProfesionalDto> {
    const { data } = await api.get<ProfesionalDto>(`${PROFESIONALES_BASE}/${id}`);
    return data;
  },

  async crear(payload: CrearProfesionalDto): Promise<ProfesionalDto> {
    const { data } = await api.post<ProfesionalDto>(PROFESIONALES_BASE, payload);
    return data;
  },

  async actualizar(id: number, payload: ActualizarProfesionalDto): Promise<ProfesionalDto> {
    const { data } = await api.put<ProfesionalDto>(`${PROFESIONALES_BASE}/${id}`, payload);
    return data;
  },

  async cambiarEstado(id: number, estado: string): Promise<void> {
    await api.patch(`${PROFESIONALES_BASE}/${id}/estado`, null, {
      params: { estado },
    });
  },

  async listarFranjas(id: number): Promise<FranjaHorariaDto[]> {
    const { data } = await api.get<FranjaHorariaDto[]>(`${PROFESIONALES_BASE}/${id}/franjas`);
    return data;
  },

  async actualizarFranjas(id: number, franjas: FranjaHorariaDto[]): Promise<void> {
    await api.put(`${PROFESIONALES_BASE}/${id}/franjas`, franjas);
  },
};