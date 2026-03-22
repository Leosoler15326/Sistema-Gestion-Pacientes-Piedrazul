import type { HistoriaClinicaDto } from '../types/historiaClinica.types';

interface HistoriaClinicaViewerProps {
  item: HistoriaClinicaDto;
}

export default function HistoriaClinicaViewer({ item }: HistoriaClinicaViewerProps) {
  return (
    <div className="space-y-4 rounded-xl bg-white p-6 shadow">
      <p><strong>ID:</strong> {item.id}</p>
      <p><strong>Cita ID:</strong> {item.citaId}</p>

      {item.fechaAtencion && (
        <p><strong>Fecha de atención:</strong> {item.fechaAtencion}</p>
      )}

      {item.fechaCita && (
        <p><strong>Fecha de cita:</strong> {item.fechaCita}</p>
      )}

      {item.pacienteNombre && (
        <p><strong>Paciente:</strong> {item.pacienteNombre}</p>
      )}

      {item.pacienteDocumento && (
        <p><strong>Documento paciente:</strong> {item.pacienteDocumento}</p>
      )}

      {item.profesionalNombre && (
        <p><strong>Profesional:</strong> {item.profesionalNombre}</p>
      )}

      {item.especialidad && (
        <p><strong>Especialidad:</strong> {item.especialidad}</p>
      )}

      <div>
        <h3 className="mb-1 text-lg font-semibold">Descripción</h3>
        <p>{item.descripcion}</p>
      </div>
    </div>
  );
}