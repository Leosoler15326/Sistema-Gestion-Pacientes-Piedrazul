export type EstadoUsuario = 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO' | string;
export type RolUsuario =
  | 'ADMIN'
  | 'ADMINISTRADOR'
  | 'MEDICO'
  | 'TERAPISTA'
  | 'RECEPCIONISTA'
  | string;

export interface UsuarioDto {
  id: number;
  nombreUsuario?: string;
  username?: string;
  email?: string;
  nombreCompleto?: string;
  nombres?: string;
  rol?: RolUsuario;
  estado?: EstadoUsuario;
  activo?: boolean;
}

export interface CrearUsuarioDto {
  nombreUsuario: string;
  contrasena: string;
  nombreCompleto: string;
  email: string;
  rol: RolUsuario;
}

export interface ActualizarUsuarioDto {
  nombreUsuario?: string;
  nombreCompleto?: string;
  email?: string;
  rol?: RolUsuario;
  estado?: EstadoUsuario;
}
