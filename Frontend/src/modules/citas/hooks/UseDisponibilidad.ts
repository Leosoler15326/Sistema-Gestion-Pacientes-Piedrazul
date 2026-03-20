import { useQuery } from '@tanstack/react-query';
import { citasService } from '../services/citas.service';

export const useDisponibilidad = (
  profesionalId?: number,
  fecha?: string
) => {
  return useQuery({
    queryKey: ['disponibilidad', profesionalId, fecha],
    queryFn: () => citasService.getDisponibilidad(profesionalId as number, fecha as string),
    enabled: Boolean(profesionalId && fecha),
  });
};