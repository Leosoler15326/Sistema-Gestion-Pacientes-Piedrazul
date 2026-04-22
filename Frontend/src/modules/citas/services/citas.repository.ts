import api from '../../../services/api';

import type {
  AgendarContactoRequestDto,
  CancelarCitaRequestDto,
  CitaDto,
  CreateCitaRequestDto,
  ListarCitasProfesionalParamsDto,
  ReagendarCitaRequestDto,
  SlotDisponibleDto,
  SlotsDisponiblesParamsDto,
} from '../types/cita.types';

const CITAS_BASE = '/citas';

/**
 * Puerto (DIP): la UI y los hooks dependen de esta abstracción;
 * la implementación HTTP puede sustituirse en pruebas sin tocar consumidores.
 */
export interface CitasRepository {
  obtenerSlotsDisponibles(params: SlotsDisponiblesParamsDto): Promise<SlotDisponibleDto[]>;
  agendar(payload: CreateCitaRequestDto): Promise<CitaDto>;
  agendarDesdeContacto(payload: AgendarContactoRequestDto): Promise<CitaDto>;
  reagendar(id: number, payload: ReagendarCitaRequestDto): Promise<CitaDto>;
  cancelar(id: number, payload?: CancelarCitaRequestDto): Promise<void>;
  listarPorProfesional(params: ListarCitasProfesionalParamsDto): Promise<CitaDto[]>;
  listarPorPaciente(pacienteId: number): Promise<CitaDto[]>;
  listarMisCitasPaciente(): Promise<CitaDto[]>;
  buscarPorId(id: number): Promise<CitaDto>;
  exportarCsvProfesionalFecha(profesionalId: number, fecha: string): Promise<Blob>;
}

class HttpCitasRepository implements CitasRepository {
  async obtenerSlotsDisponibles(
    params: SlotsDisponiblesParamsDto
  ): Promise<SlotDisponibleDto[]> {
    const response = await api.get(`${CITAS_BASE}/slots`, {
      params,
    });

    const data = response.data;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.content)) return data.content;

    return [];
  }

  async agendar(payload: CreateCitaRequestDto): Promise<CitaDto> {
    const { data } = await api.post<CitaDto>(CITAS_BASE, payload);
    return data;
  }

  async agendarDesdeContacto(payload: AgendarContactoRequestDto): Promise<CitaDto> {
    const { data } = await api.post<CitaDto>(`${CITAS_BASE}/agendar-contacto`, payload);
    return data;
  }

  async reagendar(
    id: number,
    payload: ReagendarCitaRequestDto
  ): Promise<CitaDto> {
    const { data } = await api.put<CitaDto>(
      `${CITAS_BASE}/${id}/reagendar`,
      payload
    );
    return data;
  }

  async cancelar(
    id: number,
    payload: CancelarCitaRequestDto = {}
  ): Promise<void> {
    await api.patch(`${CITAS_BASE}/${id}/cancelar`, payload);
  }

  async listarPorProfesional(
    params: ListarCitasProfesionalParamsDto
  ): Promise<CitaDto[]> {
    const { data } = await api.get<CitaDto[]>(`${CITAS_BASE}/profesional`, {
      params: {
        profesionalId: params.profesionalId,
        fechaInicio: params.fechaDesde,
        fechaFin: params.fechaHasta ?? params.fechaDesde,
      },
    });

    return data;
  }

  async listarPorPaciente(pacienteId: number): Promise<CitaDto[]> {
    const { data } = await api.get<CitaDto[]>(
      `${CITAS_BASE}/paciente/${pacienteId}`
    );
    return data;
  }

  async listarMisCitasPaciente(): Promise<CitaDto[]> {
    const { data } = await api.get<CitaDto[]>(`${CITAS_BASE}/consulta/mis-citas`);
    return data;
  }

  async buscarPorId(id: number): Promise<CitaDto> {
    const { data } = await api.get<CitaDto>(`${CITAS_BASE}/${id}`);
    return data;
  }

  async exportarCsvProfesionalFecha(
    profesionalId: number,
    fecha: string
  ): Promise<Blob> {
    const response = await api.get(`${CITAS_BASE}/exportar-csv`, {
      params: { profesionalId, fecha },
      responseType: 'blob',
    });
    return response.data as Blob;
  }
}

/** Instancia por defecto (adaptador HTTP). */
export const citasService: CitasRepository = new HttpCitasRepository();
