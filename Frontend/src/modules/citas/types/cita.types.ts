export type EstadoCita =
  | 'PROGRAMADA'
  | 'CONFIRMADA'
  | 'CANCELADA'
  | 'COMPLETADA'
  | 'REAGENDADA'
  | string;

export interface PacienteResumenDto {
  id?: number;
  nombres?: string;
  nombreCompleto?: string;
  documento?: string;
}

export interface ProfesionalResumenDto {
  id?: number;
  nombres?: string;
  nombreCompleto?: string;
  especialidad?: string;
  tipo?: string;
}

export interface CitaDto {
  id: number;
  fechaHora: string;
  tipoAtencion: string;
  motivoConsulta?: string;
  estado?: EstadoCita;
  paciente?: PacienteResumenDto;
  profesional?: ProfesionalResumenDto;
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

export interface SlotsDisponiblesParamsDto {
  profesionalId: number;
  fecha: string;
}

export interface ListarCitasProfesionalParamsDto {
  profesionalId: number;
  fecha: string;
}