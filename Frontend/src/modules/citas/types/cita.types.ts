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
  pacienteDocumento?: string;
  profesionalId: number;
  profesionalNombre: string;
  especialidad?: string;
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
  nuevaFechaHora: string;
  motivo?: string;
  nuevoProfesionalId?: number;
}

export interface CancelarCitaRequestDto {
  motivo?: string;
}

export interface PacienteContactoDto {
  documento: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  genero: 'HOMBRE' | 'MUJER' | 'OTRO';
  fechaNacimiento?: string;
  email?: string;
}

export interface AgendarContactoRequestDto {
  paciente: PacienteContactoDto;
  profesionalId: number;
  fechaHora: string;
  tipoAtencion: string;
  motivoConsulta?: string;
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
