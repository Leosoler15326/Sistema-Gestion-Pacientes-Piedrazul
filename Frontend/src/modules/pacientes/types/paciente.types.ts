export interface PacienteDto {
  id: number;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  documento: string;
  email: string;
  telefono: string;
  totalCitas: number;
}

export interface CrearPacienteDto {
  nombres: string;
  apellidos: string;
  documento: string;
  email: string;
  telefono: string;
}

export interface ActualizarPacienteDto {
  nombres?: string;
  apellidos?: string;
  documento?: string;
  email?: string;
  telefono?: string;
}