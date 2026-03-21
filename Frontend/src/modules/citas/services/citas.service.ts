import api from '../../../services/api';
import type {
  CancelarCitaRequestDto,
  CitaDto,
  CreateCitaRequestDto,
  ListarCitasProfesionalParamsDto,
  ReagendarCitaRequestDto,
  SlotsDisponiblesParamsDto,
} from '../types/cita.types';

const CITAS_BASE = '/citas';

export const citasService = {
  async obtenerSlotsDisponibles(
    params: SlotsDisponiblesParamsDto
  ): Promise<string[]> {
    const { data } = await api.get<string[]>(`${CITAS_BASE}/slots`, {
      params,
    });
    return data;
  },

  async agendar(payload: CreateCitaRequestDto): Promise<CitaDto> {
    const { data } = await api.post<CitaDto>(CITAS_BASE, payload);
    return data;
  },

  async reagendar(
    id: number,
    payload: ReagendarCitaRequestDto
  ): Promise<CitaDto> {
    const { data } = await api.put<CitaDto>(
      `${CITAS_BASE}/${id}/reagendar`,
      payload
    );
    return data;
  },

  async cancelar(
    id: number,
    payload: CancelarCitaRequestDto = {}
  ): Promise<void> {
    await api.patch(`${CITAS_BASE}/${id}/cancelar`, payload);
  },

  async listarPorProfesional(
    params: ListarCitasProfesionalParamsDto
  ): Promise<CitaDto[]> {
    const { data } = await api.get<CitaDto[]>(`${CITAS_BASE}/profesional`, {
      params,
    });
    return data;
  },

  async listarPorPaciente(pacienteId: number): Promise<CitaDto[]> {
    const { data } = await api.get<CitaDto[]>(
      `${CITAS_BASE}/paciente/${pacienteId}`
    );
    return data;
  },

  async buscarPorId(id: number): Promise<CitaDto> {
    const { data } = await api.get<CitaDto>(`${CITAS_BASE}/${id}`);
    return data;
  },
};