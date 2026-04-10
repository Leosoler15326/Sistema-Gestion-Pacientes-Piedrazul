import api from '../../../services/api';

export interface ConfigAgendamientoDto {
  ventanaSemanasAgendar: number;
}

export const configuracionService = {
  async obtenerAgendamiento(): Promise<ConfigAgendamientoDto> {
    const { data } = await api.get<ConfigAgendamientoDto>(
      '/configuracion/agendamiento'
    );
    return data;
  },

  async actualizarVentanaSemanas(
    ventanaSemanasAgendar: number
  ): Promise<ConfigAgendamientoDto> {
    const { data } = await api.patch<ConfigAgendamientoDto>(
      '/configuracion/agendamiento/ventana-semanas',
      { ventanaSemanasAgendar }
    );
    return data;
  },
};
