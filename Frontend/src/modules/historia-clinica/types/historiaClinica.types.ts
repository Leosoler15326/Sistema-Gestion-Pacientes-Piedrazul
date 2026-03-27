export interface HistoriaClinicaDto {
  id: number;
  citaId: number;
  descripcion: string;

  fechaAtencion?: string;
  fechaCita?: string;

  pacienteId?: number;
  pacienteNombre?: string;
  pacienteDocumento?: string;

  profesionalId?: number;
  profesionalNombre?: string;
  especialidad?: string;
}

export interface CreateHistoriaClinicaRequestDto {
  citaId: number;
  descripcion: string;
}

export interface UpdateHistoriaClinicaRequestDto {
  descripcion: string;
}