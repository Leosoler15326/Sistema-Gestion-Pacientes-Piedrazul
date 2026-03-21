export type UserRole = 'ADMIN' | 'MEDICO' | 'TERAPISTA' | 'RECEPCIONISTA';

export interface LoginRequestDto {
  nombreUsuario: string; // ajustar si backend usa email
  contrasena: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  nombreUsuario: string;
  nombreCompleto: string;
  rol: UserRole;
  id: number;
}

export interface RegisterRequestDto {
  nombreUsuario: string;
  contrasena: string;
  nombreCompleto: string;
  email: string;
  rol: UserRole;
}

export interface AuthUserDto {
  id: number;
  nombreUsuario: string;
  nombreCompleto: string;
  rol: UserRole;
}