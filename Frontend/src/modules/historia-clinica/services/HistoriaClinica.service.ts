import api from '../../../services/api';
import type {
  CreateHistoriaClinicaRequestDto,
  HistoriaClinicaDto,
  UpdateHistoriaClinicaRequestDto,
} from '../types/historiaClinica.types';

const HISTORIA_BASE = '/historias';

export const historiaClinicaService = {
  async create(payload: CreateHistoriaClinicaRequestDto): Promise<HistoriaClinicaDto> {
    const { data } = await api.post<HistoriaClinicaDto>(HISTORIA_BASE, payload);
    return data;
  },

  async update(
    id: number,
    payload: UpdateHistoriaClinicaRequestDto
  ): Promise<HistoriaClinicaDto> {
    const { data } = await api.put<HistoriaClinicaDto>(
      `${HISTORIA_BASE}/${id}`,
      payload
    );
    return data;
  },

  async getByCitaId(citaId: number): Promise<HistoriaClinicaDto> {
    const { data } = await api.get<HistoriaClinicaDto>(
      `${HISTORIA_BASE}/cita/${citaId}`
    );
    return data;
  },

  async getByPacienteId(pacienteId: number): Promise<HistoriaClinicaDto[]> {
    const { data } = await api.get<HistoriaClinicaDto[]>(
      `${HISTORIA_BASE}/paciente/${pacienteId}`
    );
    return data;
  },

  async getByProfesionalId(profesionalId: number): Promise<HistoriaClinicaDto[]> {
    const { data } = await api.get<HistoriaClinicaDto[]>(
      `${HISTORIA_BASE}/profesional/${profesionalId}`
    );
    return data;
  },
};