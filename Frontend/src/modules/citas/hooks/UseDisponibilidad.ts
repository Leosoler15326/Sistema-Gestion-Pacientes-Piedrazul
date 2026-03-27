import { useQuery } from '@tanstack/react-query';
import { citasService } from '../services/citas.service';

export const useDisponibilidad = (
  profesionalId?: number,
  fecha?: string
) => {
  return useQuery({
    queryKey: ['slots-disponibles', profesionalId, fecha],
    queryFn: () =>
      citasService.obtenerSlotsDisponibles({
        profesionalId: profesionalId as number,
        fecha: fecha as string,
      }),
    enabled: Boolean(profesionalId && fecha),
  });
};