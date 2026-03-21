export type UserRole = 'ADMIN' | 'MEDICO' | 'TERAPISTA' | 'RECEPCIONISTA';

export interface LoginRequestDto {
  nombreUsuario: string;
  contrasena: string;
}

export interface RegisterRequestDto {
  nombreUsuario: string;
  contrasena: string;
  nombreCompleto: string;
  email: string;
  rol: UserRole;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  nombreUsuario: string;
  nombreCompleto: string;
  rol: UserRole;
  id: number;
}

export interface AuthUserDto {
  id: number;
  nombreUsuario: string;
  nombreCompleto: string;
  rol: UserRole;
}