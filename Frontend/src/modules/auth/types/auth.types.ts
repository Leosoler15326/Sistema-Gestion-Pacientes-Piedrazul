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
  token: string;
  user: AuthUserDto;
}

export interface RegisterRequestDto {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}