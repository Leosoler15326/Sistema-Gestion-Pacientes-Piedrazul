export interface HistoriaPacienteResumenDto {
  id: number;
  fullName: string;
  documentNumber?: string;
}

export interface HistoriaProfesionalResumenDto {
  id: number;
  fullName: string;
  specialty?: string;
}

export interface AntecedentesDto {
  personales?: string;
  familiares?: string;
  alergias?: string;
  medicamentos?: string;
}

export interface HistoriaClinicaDto {
  id: number;
  citaId: number;
  fechaRegistro: string;
  motivoConsulta: string;
  diagnostico: string;
  tratamiento: string;
  observaciones?: string;
  antecedentes: AntecedentesDto;
  paciente: HistoriaPacienteResumenDto;
  profesional: HistoriaProfesionalResumenDto;
  editable?: boolean;
}

export interface CreateHistoriaClinicaRequestDto {
  citaId: number;
  motivoConsulta: string;
  diagnostico: string;
  tratamiento: string;
  observaciones?: string;
  antecedentes: AntecedentesDto;
}

export interface UpdateHistoriaClinicaRequestDto {
  motivoConsulta?: string;
  diagnostico?: string;
  tratamiento?: string;
  observaciones?: string;
  antecedentes?: AntecedentesDto;
}

export interface HistoriaClinicaFiltersDto {
  paciente?: string;
  profesional?: string;
  fecha?: string;
}