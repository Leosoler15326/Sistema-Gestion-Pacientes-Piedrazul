export type GeneroPaciente = 'HOMBRE' | 'MUJER' | 'OTRO';

export interface PacienteDto {
  id: number;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  documento: string;
  email: string;
  telefono: string;
  genero?: GeneroPaciente | string;
  fechaNacimiento?: string;
  totalCitas: number;
}

export interface CompletarPerfilPacienteDto {
  documento: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  genero: GeneroPaciente;
  fechaNacimiento?: string;
  email?: string;
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