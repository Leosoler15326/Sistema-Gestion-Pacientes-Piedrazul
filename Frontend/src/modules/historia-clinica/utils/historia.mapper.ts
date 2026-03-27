import type { HistoriaClinicaDto } from '../types/historiaClinica.types';

export const mapHistoriaToTableRow = (historia: HistoriaClinicaDto) => ({
  id: historia.id,
  citaId: historia.citaId,
  descripcion: historia.descripcion,
});