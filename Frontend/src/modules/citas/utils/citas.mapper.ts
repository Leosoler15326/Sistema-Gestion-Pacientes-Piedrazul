import type { CitaDto } from '../types/cita.types';

export const mapCitaToTableRow = (cita: CitaDto) => ({
  id: cita.id,
  fecha: cita.fecha,
  hora: `${cita.horaInicio} - ${cita.horaFin}`,
  paciente: cita.paciente.fullName,
  profesional: cita.profesional.fullName,
  estado: cita.estado,
});