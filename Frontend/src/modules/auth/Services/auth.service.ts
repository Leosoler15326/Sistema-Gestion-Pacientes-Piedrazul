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
    await api.post(`${AUTH_BASE}/register`, payload);
  },

  async me() {
    const { data } = await api.get(`${AUTH_BASE}/me`);
    return data;
  },

  async logout(): Promise<void> {
    await api.post(`${AUTH_BASE}/logout`);
  },
};