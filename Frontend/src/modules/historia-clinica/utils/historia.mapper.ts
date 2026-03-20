
import type { HistoriaClinicaDto } from '../types/historiaClinica.types';

export const mapHistoriaToTableRow = (historia: HistoriaClinicaDto) => ({
  id: historia.id,
  fechaRegistro: historia.fechaRegistro,
  paciente: historia.paciente.fullName,
  profesional: historia.profesional.fullName,
  motivoConsulta: historia.motivoConsulta,
});