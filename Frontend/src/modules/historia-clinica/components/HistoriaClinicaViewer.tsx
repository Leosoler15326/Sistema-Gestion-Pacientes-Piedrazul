import type { HistoriaClinicaDto } from '../types/historiaClinica.types';

interface HistoriaClinicaViewerProps {
  item: HistoriaClinicaDto;
}

export default function HistoriaClinicaViewer({ item }: HistoriaClinicaViewerProps) {
  return (
    <div className="space-y-4 rounded-xl bg-white p-6 shadow">
      <p><strong>ID:</strong> {item.id}</p>
      <p><strong>Cita ID:</strong> {item.citaId}</p>
      <p><strong>Fecha de registro:</strong> {item.fechaRegistro}</p>
      <p><strong>Paciente:</strong> {item.paciente.fullName}</p>
      <p><strong>Profesional:</strong> {item.profesional.fullName}</p>
      <p><strong>Especialidad:</strong> {item.profesional.specialty ?? 'N/A'}</p>

      <div>
        <h3 className="mb-1 text-lg font-semibold">Motivo de consulta</h3>
        <p>{item.motivoConsulta}</p>
      </div>

      <div>
        <h3 className="mb-1 text-lg font-semibold">Diagnóstico</h3>
        <p>{item.diagnostico}</p>
      </div>

      <div>
        <h3 className="mb-1 text-lg font-semibold">Tratamiento</h3>
        <p>{item.tratamiento}</p>
      </div>

      <div>
        <h3 className="mb-1 text-lg font-semibold">Antecedentes</h3>
        <p><strong>Personales:</strong> {item.antecedentes.personales || 'N/A'}</p>
        <p><strong>Familiares:</strong> {item.antecedentes.familiares || 'N/A'}</p>
        <p><strong>Alergias:</strong> {item.antecedentes.alergias || 'N/A'}</p>
        <p><strong>Medicamentos:</strong> {item.antecedentes.medicamentos || 'N/A'}</p>
      </div>

      <div>
        <h3 className="mb-1 text-lg font-semibold">Observaciones</h3>
        <p>{item.observaciones || 'Sin observaciones'}</p>
      </div>
    </div>
  );
}
