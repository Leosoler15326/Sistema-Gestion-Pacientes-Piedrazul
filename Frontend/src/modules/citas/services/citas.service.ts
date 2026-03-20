import api from '../../../services/api';
import type {
  CitaDto,
  CitasFiltersDto,
  CreateCitaRequestDto,
  DisponibilidadDto,
  ReagendarCitaRequestDto,
  UpdateCitaRequestDto,
} from '../types/cita.types';

const CITAS_BASE = '/citas';

export const citasService = {
  async getAll(filters?: CitasFiltersDto): Promise<CitaDto[]> {
    const { data } = await api.get<CitaDto[]>(CITAS_BASE, {
      params: filters,
    });
    return data;
  },

  async getById(id: number): Promise<CitaDto> {
    const { data } = await api.get<CitaDto>(`${CITAS_BASE}/${id}`);
    return data;
  },

  async create(payload: CreateCitaRequestDto): Promise<CitaDto> {
    const { data } = await api.post<CitaDto>(CITAS_BASE, payload);
    return data;
  },

  async update(id: number, payload: UpdateCitaRequestDto): Promise<CitaDto> {
    const { data } = await api.put<CitaDto>(`${CITAS_BASE}/${id}`, payload);
    return data;
  },

  async cancel(id: number): Promise<void> {
    await api.patch(`${CITAS_BASE}/${id}/cancelar`);
  },

  async reagendar(id: number, payload: ReagendarCitaRequestDto): Promise<CitaDto> {
    const { data } = await api.patch<CitaDto>(`${CITAS_BASE}/${id}/reagendar`, payload);
    return data;
  },

  async getDisponibilidad(
    profesionalId: number,
    fecha: string
  ): Promise<DisponibilidadDto[]> {
    const { data } = await api.get<DisponibilidadDto[]>(
      `${CITAS_BASE}/disponibilidad`,
      {
        params: { profesionalId, fecha },
      }
    );
    return data;
  },
};