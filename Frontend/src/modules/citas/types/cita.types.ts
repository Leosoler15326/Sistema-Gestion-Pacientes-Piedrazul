export type EstadoCita =
  | 'PENDIENTE'
  | 'CONFIRMADA'
  | 'CANCELADA'
  | 'COMPLETADA'
  | 'REAGENDADA';

export interface PacienteResumenDto {
  id: number;
  fullName: string;
  documentNumber?: string;
}

export interface ProfesionalResumenDto {
  id: number;
  fullName: string;
  specialty?: string;
}

export interface CitaDto {
  id: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: EstadoCita;
  motivo: string;
  observaciones?: string;
  paciente: PacienteResumenDto;
  profesional: ProfesionalResumenDto;
  puedeCancelar?: boolean;
  puedeReagendar?: boolean;
}

export interface CreateCitaRequestDto {
  pacienteId: number;
  profesionalId: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  motivo: string;
  observaciones?: string;
}

export interface UpdateCitaRequestDto {
  fecha?: string;
  horaInicio?: string;
  horaFin?: string;
  motivo?: string;
  observaciones?: string;
  estado?: EstadoCita;
}

export interface ReagendarCitaRequestDto {
  fecha: string;
  horaInicio: string;
  horaFin: string;
  motivoReagenda?: string;
}

export interface CitasFiltersDto {
  fecha?: string;
  estado?: EstadoCita | '';
  paciente?: string;
  profesional?: string;
}

export interface DisponibilidadDto {
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
}