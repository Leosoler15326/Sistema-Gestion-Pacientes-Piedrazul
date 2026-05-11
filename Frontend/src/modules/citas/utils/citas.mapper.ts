import type { CitaDto } from '../types/cita.types';

export const mapCitaToTableRow = (cita: CitaDto) => {
  const fh = cita.fechaHora ? new Date(cita.fechaHora) : null;
  const fechaStr = fh && !Number.isNaN(fh.getTime()) ? fh.toLocaleDateString() : '';
  const horaStr = fh && !Number.isNaN(fh.getTime())
    ? fh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';
  return {
    id: cita.id,
    fecha: fechaStr,
    hora: horaStr,
    paciente: cita.pacienteNombre,
    profesional: cita.profesionalNombre,
    estado: cita.estado,
  };
};
