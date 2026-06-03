import { Link } from 'react-router-dom';
import type { CitaDto } from '../types/cita.types';
import { APP_ROUTES } from '../../../app/router/routes';

interface CitasTableProps {
  items: CitaDto[];
  onCancel?: (id: number) => void;
}

const IconEye = () => (
  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconCalendarEdit = () => (
  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconXCircle = () => (
  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

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
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors"
              >
                <IconEye /> Ver
              </Link>
              <Link
                to={APP_ROUTES.CITAS_REAGENDAR.replace(':id', String(cita.id))}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
              >
                <IconCalendarEdit /> Reagendar
              </Link>
              {onCancel && (
                <button
                  type="button"
                  onClick={() => onCancel(cita.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition-colors"
                >
                  <IconXCircle /> Cancelar
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
                  <div className="flex items-center gap-2">
                    <Link
                      to={APP_ROUTES.CITAS_DETALLE.replace(':id', String(cita.id))}
                      title="Ver detalle"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors"
                    >
                      <IconEye /> Ver
                    </Link>
                    <Link
                      to={APP_ROUTES.CITAS_REAGENDAR.replace(':id', String(cita.id))}
                      title="Reagendar cita"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
                    >
                      <IconCalendarEdit /> Reagendar
                    </Link>
                    {onCancel && (
                      <button
                        type="button"
                        title="Cancelar cita"
                        onClick={() => onCancel(cita.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition-colors"
                      >
                        <IconXCircle /> Cancelar
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
