import type { CitaDto } from '../types/cita.types';

export const exportCitasToCsv = (items: CitaDto[]) => {
  const headers = ['ID', 'Fecha', 'Hora inicio', 'Hora fin', 'Paciente', 'Profesional', 'Estado'];

  const rows = items.map((item) => [
    item.id,
    item.fecha,
    item.horaInicio,
    item.horaFin,
    item.paciente.fullName,
    item.profesional.fullName,
    item.estado,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'citas.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};