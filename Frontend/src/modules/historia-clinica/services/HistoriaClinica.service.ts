
import api from '../../../services/api';
import type {
  CreateHistoriaClinicaRequestDto,
  HistoriaClinicaDto,
  HistoriaClinicaFiltersDto,
  UpdateHistoriaClinicaRequestDto,
} from '../types/historiaClinica.types';

const HISTORIA_BASE = '/historias-clinicas';

export const historiaClinicaService = {
  async getAll(filters?: HistoriaClinicaFiltersDto): Promise<HistoriaClinicaDto[]> {
    const { data } = await api.get<HistoriaClinicaDto[]>(HISTORIA_BASE, {
      params: filters,
    });
    return data;
  },

  async getById(id: number): Promise<HistoriaClinicaDto> {
    const { data } = await api.get<HistoriaClinicaDto>(`${HISTORIA_BASE}/${id}`);
    return data;
  },

  async create(payload: CreateHistoriaClinicaRequestDto): Promise<HistoriaClinicaDto> {
    const { data } = await api.post<HistoriaClinicaDto>(HISTORIA_BASE, payload);
    return data;
  },

  async update(
    id: number,
    payload: UpdateHistoriaClinicaRequestDto
  ): Promise<HistoriaClinicaDto> {
    const { data } = await api.put<HistoriaClinicaDto>(`${HISTORIA_BASE}/${id}`, payload);
    return data;
  },
};