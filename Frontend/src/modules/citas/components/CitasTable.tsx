import { Link } from 'react-router-dom';
import type { CitaDto } from '../types/cita.types';
import { APP_ROUTES } from '../../../app/router/routes';

interface CitasTableProps {
  items: CitaDto[];
  onCancel?: (id: number) => void;
}

export default function CitasTable({ items, onCancel }: CitasTableProps) {
  return (
    <>
      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {items.map((cita) => (
          <div key={cita.id} className="rounded-xl bg-white p-4 shadow-sm">
            <p className="font-semibold text-slate-800">{cita.fechaHora}</p>
            <p className="mt-1 text-sm text-slate-600">
              <span className="font-medium">Paciente:</span> {cita.pacienteNombre}
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-medium">Profesional:</span> {cita.profesionalNombre}
            </p>
            {cita.especialidad && (
              <p className="text-sm text-slate-500">Especialidad: {cita.especialidad}</p>
            )}
            <p className="mt-1 text-sm">
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                {cita.estado || 'N/A'}
              </span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                to={APP_ROUTES.CITAS_DETALLE.replace(':id', String(cita.id))}
                className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white"
              >
                Ver
              </Link>
              <Link
                to={APP_ROUTES.CITAS_REAGENDAR.replace(':id', String(cita.id))}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white"
              >
                Reagendar
              </Link>
              {onCancel && (
                <button
                  type="button"
                  onClick={() => onCancel(cita.id)}
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full border-collapse">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Fecha y hora
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Paciente
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Profesional
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Especialidad
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((cita) => (
              <tr key={cita.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-4 text-sm text-slate-700">{cita.fechaHora}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{cita.pacienteNombre}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{cita.profesionalNombre}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{cita.especialidad || 'N/A'}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{cita.estado || 'N/A'}</td>
                <td className="px-4 py-4 text-sm">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={APP_ROUTES.CITAS_DETALLE.replace(':id', String(cita.id))}
                      className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white"
                    >
                      Ver
                    </Link>
                    <Link
                      to={APP_ROUTES.CITAS_REAGENDAR.replace(':id', String(cita.id))}
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white"
                    >
                      Reagendar
                    </Link>
                    {onCancel && (
                      <button
                        type="button"
                        onClick={() => onCancel(cita.id)}
                        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
