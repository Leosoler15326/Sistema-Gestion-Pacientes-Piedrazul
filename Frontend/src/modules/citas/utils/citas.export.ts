import type { CitaDto } from '../types/cita.types';

function escapeCsv(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return '""';
  const s = String(value).replace(/"/g, '""');
  return `"${s}"`;
}

/** CSV con separador ; y BOM para Excel en español */
export const exportCitasToCsv = (items: CitaDto[], filename = 'citas.csv') => {
  const headers = [
    'ID',
    'Fecha y hora',
    'Documento paciente',
    'Paciente',
    'Profesional',
    'Especialidad',
    'Estado',
    'Tipo atención',
  ];

  const rows = items.map((c) => [
    c.id,
    c.fechaHora,
    c.pacienteDocumento ?? '',
    c.pacienteNombre,
    c.profesionalNombre,
    c.especialidad ?? '',
    c.estado,
    c.tipoAtencion,
  ]);

  const line = (cells: (string | number)[]) =>
    cells.map((c) => escapeCsv(c)).join(';');

  const csvContent = ['\uFEFF', line(headers), ...rows.map(line)].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
