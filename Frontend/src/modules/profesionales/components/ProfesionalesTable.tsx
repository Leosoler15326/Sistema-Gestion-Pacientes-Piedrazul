import { Link } from 'react-router-dom';
import type { ProfesionalDto } from '../types/profesional.types';
import { APP_ROUTES } from '../../../app/router/routes';

interface ProfesionalesTableProps {
  items: ProfesionalDto[];
}

export default function ProfesionalesTable({ items }: ProfesionalesTableProps) {
  return (
    <>
      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {items.map((item) => (
          <div key={item.profesionalId} className="rounded-xl bg-white p-4 shadow">
            <p className="font-semibold text-slate-800">{item.nombres}</p>
            <p className="mt-1 text-sm text-slate-500">
              {item.tipo}{item.especialidad ? ` · ${item.especialidad}` : ''}
            </p>
            <p className="text-sm text-slate-500">
              Intervalo: {item.intervaloMinutos} min · {item.estado}
            </p>
            <p className="text-sm text-slate-500">
              {item.usuarioVinculado ? 'Con acceso al sistema' : 'Sin acceso al sistema'}
            </p>
            <div className="mt-3">
              <Link
                to={APP_ROUTES.PROFESIONALES_DETALLE.replace(':id', String(item.profesionalId))}
                className="rounded-lg bg-gray-800 px-3 py-1.5 text-sm text-white"
              >
                Ver detalle
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
              <th className="px-4 py-3 text-left">Profesional</th>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">Especialidad</th>
              <th className="px-4 py-3 text-left">Intervalo</th>
              <th className="px-4 py-3 text-left">Estado laboral</th>
              <th className="px-4 py-3 text-left">Acceso al sistema</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.profesionalId} className="border-t">
                <td className="px-4 py-3">{item.nombres}</td>
                <td className="px-4 py-3">{item.tipo}</td>
                <td className="px-4 py-3">{item.especialidad}</td>
                <td className="px-4 py-3">{item.intervaloMinutos} min</td>
                <td className="px-4 py-3">{item.estado}</td>
                <td className="px-4 py-3">{item.usuarioVinculado ? 'Con acceso' : 'Sin acceso'}</td>
                <td className="px-4 py-3">
                  <Link
                    to={APP_ROUTES.PROFESIONALES_DETALLE.replace(':id', String(item.profesionalId))}
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
    </>
  );
}
