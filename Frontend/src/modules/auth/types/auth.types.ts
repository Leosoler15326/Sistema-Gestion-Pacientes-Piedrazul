import Long from "long";
export type UserRole = 'ADMIN' | 'MEDICO' | 'TERAPISTA' | 'RECEPCIONISTA';

export interface AuthUserDto {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  permissions: string[];
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: String;
  refreshToken: String;
  nombreUsuario: String;
  nombreCompleto: String;
  rol: String;
  idUsuario: Long;
  idProfesional: Long;//FALTA IMPLEMENTACION
}

export interface RegisterRequestDto {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}