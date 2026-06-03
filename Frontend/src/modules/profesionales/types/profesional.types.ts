export type TipoProfesional =
  | 'MEDICO'
  | 'TERAPISTA'
  | string;

export type Especialidad =
  | 'TERAPIA_NEURAL'
  | 'QUIROPRAXIA'
  | 'FISIOTERAPIA'
  | string;

export type EstadoProfesional =
  | 'ACTIVO'
  | 'INACTIVO'
  | string;
  
export interface ProfesionalDto {
  profesionalId: number;
  nombres: string;
  especialidad: string;
  tipo: string;
  intervaloMinutos: number;
  estado: string;
  usuarioId?: number | null;
  nombreUsuario?: string | null;
  rolUsuario?: string | null;
  usuarioVinculado?: boolean;
  habilidadesAdicionales?: string | null;
}

export interface CrearProfesionalDto {
  nombres: string;
  tipo: TipoProfesional;
  especialidad: Especialidad;
  intervaloMinutos: number;
  habilidadesAdicionales?: string | null;
  crearUsuario: boolean;
  nombreUsuario?: string;
  contrasena?: string;
}

export interface ActualizarProfesionalDto {
  nombres?: string;
  tipo?: TipoProfesional;
  especialidad?: Especialidad;
  intervaloMinutos?: number;
  habilidadesAdicionales?: string | null;
}

export interface FranjaHorariaDto {
  id?: number;
  diaSemana?: string;
  horaInicio?: string;
  horaFin?: string;
}
