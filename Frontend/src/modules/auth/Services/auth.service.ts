import api from '../../../services/api';
import type {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
} from '../types/auth.types';

const AUTH_BASE = '/auth';

export const authService = {
  async login(payload: LoginRequestDto): Promise<LoginResponseDto> {
    const { data } = await api.post<LoginResponseDto>(`${AUTH_BASE}/login`, payload);
    return data;
  },

  async register(payload: RegisterRequestDto): Promise<void> {
    await api.post(`${AUTH_BASE}/registro`, payload);
  },

  async refreshToken(refreshToken: string): Promise<LoginResponseDto> {
    const { data } = await api.post<LoginResponseDto>(`${AUTH_BASE}/refresh`, {
      refreshToken,
    });
    return data;
  },

  async verificarEmail(email: string): Promise<boolean> {
    const { data } = await api.get<boolean>(`${AUTH_BASE}/verificar-email`, {
      params: { email },
    });
    return data;
  },
};