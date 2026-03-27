export type EstadoCita =
  | 'PROGRAMADA'
  | 'CONFIRMADA'
  | 'CANCELADA'
  | 'COMPLETADA'
  | string;

export interface CitaDto {
  id: number;
  pacienteId: number;
  pacienteNombre: string;
  profesionalId: number;
  profesionalNombre: string;
  fechaHora: string;
  estado: EstadoCita;
  tipoAtencion: string;
  motivoConsulta?: string;
}

export interface CreateCitaRequestDto {
  pacienteId: number;
  profesionalId: number;
  fechaHora: string;
  tipoAtencion: string;
  motivoConsulta?: string;
}

export interface ReagendarCitaRequestDto {
  fechaHora: string;
}

export interface CancelarCitaRequestDto {
  motivo?: string;
}

export interface SlotDisponibleDto {
  fechaHora: string;
  horaFormateada: string;
}

export interface SlotsDisponiblesParamsDto {
  profesionalId: number;
  fecha: string;
}

export interface ListarCitasProfesionalParamsDto {
  profesionalId: number;
  fechaDesde: string;
  fechaHasta?: string;
}
export interface CitasFiltersDto {
  fecha?: string;
  estado?: string;
  paciente?: string;
  profesional?: string;
}