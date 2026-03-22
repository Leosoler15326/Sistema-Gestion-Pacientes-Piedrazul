export type EstadoCita =
  | 'PROGRAMADA'
  | 'CONFIRMADA'
  | 'CANCELADA'
  | 'COMPLETADA'
  | 'REAGENDADA'
  | string;

export interface CitaDto {
  id: number;
  fechaHora: string;
  tipoAtencion: string;
  motivoConsulta?: string;
  estado?: EstadoCita;

  pacienteId: number;
  pacienteNombre: string;
  pacienteDocumento?: string;

  profesionalId: number;
  profesionalNombre: string;
  especialidad?: string;

  creadoPor?: string;
}

export interface CreateCitaRequestDto {
  profesionalId: number;
  pacienteId: number;
  fechaHora: string;
  tipoAtencion: string;
  motivoConsulta?: string;
}

export interface ReagendarCitaRequestDto {
  nuevaFechaHora: string;
  motivo?: string;
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
  fecha: string;
}
export interface CitasFiltersDto {
  fecha?: string;
  estado?: string;
  paciente?: string;
  profesional?: string;
}