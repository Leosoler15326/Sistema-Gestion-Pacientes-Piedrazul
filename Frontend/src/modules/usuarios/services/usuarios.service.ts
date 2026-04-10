import api from '../../../services/api';
import type {
  ActualizarUsuarioDto,
  CrearUsuarioDto,
  UsuarioDto,
} from '../types/usuario.types';
import { authStore } from '../../auth/store/auth.store';

const USUARIOS_BASE = '/usuarios';

export const usuariosService = {
  async listar(): Promise<UsuarioDto[]> {
  const response = await api.get('/usuarios');
  const data = response.data;

  console.log('Respuesta /usuarios:', data);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.content)) return data.content;

  return [];
  },

  async buscarPorId(id: number): Promise<UsuarioDto> {
    const { data } = await api.get<UsuarioDto>(`${USUARIOS_BASE}/${id}`);
    return data;
  },

  async crear(payload: CrearUsuarioDto): Promise<UsuarioDto> {
    const { data } = await api.post<UsuarioDto>(USUARIOS_BASE, payload);
    return data;
  },

  async actualizar(id: number, payload: ActualizarUsuarioDto): Promise<UsuarioDto> {
    const responsable = authStore.getUser()?.nombreUsuario || 'sistema';

    const { data } = await api.put<UsuarioDto>(`${USUARIOS_BASE}/${id}`, payload, {
      headers: {
        'X-Usuario-Responsable': responsable,
      },
    });

    return data;
  },

  async desactivar(id: number): Promise<void> {
    const responsable = authStore.getUser()?.nombreUsuario || 'sistema';

    await api.patch(`${USUARIOS_BASE}/${id}/desactivar`, {}, {
      headers: {
        'X-Usuario-Responsable': responsable,
      },
    });
  },

  async reactivar(id: number): Promise<void> {
    const responsable = authStore.getUser()?.nombreUsuario || 'sistema';

    await api.patch(`${USUARIOS_BASE}/${id}/reactivar`, {}, {
      headers: {
        'X-Usuario-Responsable': responsable,
      },
    });
  },

  async verificarEmail(token: string): Promise<string> {
    const { data } = await api.get<string>(`${USUARIOS_BASE}/verificar-email`, {
      params: { token },
    });
    return data;
  },
};