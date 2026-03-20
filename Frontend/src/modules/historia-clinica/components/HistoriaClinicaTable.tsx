import { Link } from 'react-router-dom';
import type { HistoriaClinicaDto } from '../types/historiaClinica.types';
import { APP_ROUTES } from '../../../app/router/routes';

interface HistoriaClinicaTableProps {
  items: HistoriaClinicaDto[];
}

export default function HistoriaClinicaTable({ items }: HistoriaClinicaTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">Fecha</th>
            <th className="px-4 py-3 text-left">Paciente</th>
            <th className="px-4 py-3 text-left">Profesional</th>
            <th className="px-4 py-3 text-left">Motivo</th>
            <th className="px-4 py-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((historia) => (
            <tr key={historia.id} className="border-t">
              <td className="px-4 py-3">{historia.fechaRegistro}</td>
              <td className="px-4 py-3">{historia.paciente.fullName}</td>
              <td className="px-4 py-3">{historia.profesional.fullName}</td>
              <td className="px-4 py-3">{historia.motivoConsulta}</td>
              <td className="px-4 py-3">
                <Link
                  to={APP_ROUTES.HISTORIA_CLINICA_DETALLE.replace(':id', String(historia.id))}
                  className="rounded-lg bg-gray-800 px-3 py-1 text-sm text-white"
                >
                  Ver
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
