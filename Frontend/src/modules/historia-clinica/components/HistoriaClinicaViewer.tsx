import type { HistoriaClinicaDto } from '../types/historiaClinica.types';

interface HistoriaClinicaViewerProps {
  item: HistoriaClinicaDto;
}

export default function HistoriaClinicaViewer({ item }: HistoriaClinicaViewerProps) {
  return (
    <div className="space-y-4 rounded-xl bg-white p-6 shadow">
      <p><strong>ID:</strong> {item.id}</p>
      <p><strong>Cita ID:</strong> {item.citaId}</p>
      {item.fechaRegistro && (
        <p><strong>Fecha de registro:</strong> {item.fechaRegistro}</p>
      )}

      {item.pacienteId && (
        <p><strong>Paciente ID:</strong> {item.pacienteId}</p>
      )}

      {item.profesionalId && (
        <p><strong>Profesional ID:</strong> {item.profesionalId}</p>
      )}

      <div>
        <h3 className="mb-1 text-lg font-semibold">Descripción</h3>
        <p>{item.descripcion}</p>
      </div>
    </div>
  );
}