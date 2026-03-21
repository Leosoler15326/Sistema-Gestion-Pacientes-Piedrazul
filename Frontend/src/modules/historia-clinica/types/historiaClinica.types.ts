export interface HistoriaClinicaDto {
  id: number;
  citaId: number;
  descripcion: string;
  pacienteId?: number;
  profesionalId?: number;
  fechaRegistro?: string;
}

export interface CreateHistoriaClinicaRequestDto {
  citaId: number;
  descripcion: string;
}

export interface UpdateHistoriaClinicaRequestDto {
  descripcion: string;
}