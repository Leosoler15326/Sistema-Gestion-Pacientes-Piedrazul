import { Link } from 'react-router-dom';
import type { HistoriaClinicaDto } from '../types/historiaClinica.types';
import { APP_ROUTES } from '../../../app/router/routes';

interface HistoriaClinicaTableProps {
  items: HistoriaClinicaDto[];
}

export default function HistoriaClinicaTable({ items }: HistoriaClinicaTableProps) {
  return (
    <>
      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {items.map((historia) => (
          <div key={historia.id} className="rounded-xl bg-white p-4 shadow">
            <p className="text-sm text-slate-500">Historia #{historia.id} · Cita #{historia.citaId}</p>
            {historia.descripcion && (
              <p className="mt-1 text-sm text-slate-700 line-clamp-2">{historia.descripcion}</p>
            )}
            <div className="mt-3">
              <Link
                to={APP_ROUTES.HISTORIA_CLINICA_DETALLE.replace(':id', String(historia.citaId))}
                className="rounded-lg bg-gray-800 px-3 py-1.5 text-sm text-white"
              >
                Ver por cita
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-xl bg-white shadow">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Cita ID</th>
              <th className="px-4 py-3 text-left">Descripción</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((historia) => (
              <tr key={historia.id} className="border-t">
                <td className="px-4 py-3">{historia.id}</td>
                <td className="px-4 py-3">{historia.citaId}</td>
                <td className="px-4 py-3">{historia.descripcion}</td>
                <td className="px-4 py-3">
                  <Link
                    to={APP_ROUTES.HISTORIA_CLINICA_DETALLE.replace(':id', String(historia.citaId))}
                    className="rounded-lg bg-gray-800 px-3 py-1 text-sm text-white"
                  >
                    Ver por cita
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
