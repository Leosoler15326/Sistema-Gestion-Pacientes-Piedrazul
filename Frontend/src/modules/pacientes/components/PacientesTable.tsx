import { Link } from 'react-router-dom';
import type { PacienteDto } from '../types/paciente.types';
import { APP_ROUTES } from '../../../app/router/routes';

interface PacientesTableProps {
  items: PacienteDto[];
}

export default function PacientesTable({ items }: PacientesTableProps) {
  return (
    <>
      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl bg-white p-4 shadow">
            <p className="font-semibold text-slate-800">{item.nombreCompleto}</p>
            <p className="mt-1 text-sm text-slate-500">Doc: {item.documento}</p>
            {item.email && <p className="text-sm text-slate-500">{item.email}</p>}
            {item.telefono && <p className="text-sm text-slate-500">Tel: {item.telefono}</p>}
            <p className="text-sm text-slate-500">Citas: {item.totalCitas}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                to={APP_ROUTES.PACIENTES_DETALLE.replace(':id', String(item.id))}
                className="rounded-lg bg-gray-800 px-3 py-1.5 text-sm text-white"
              >
                Ver
              </Link>
              <Link
                to={`${APP_ROUTES.CITAS}?pacienteId=${item.id}`}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white"
              >
                Ver citas
              </Link>
              <Link
                to={`${APP_ROUTES.CITAS_NUEVA}?pacienteId=${item.id}&pacienteNombre=${encodeURIComponent(item.nombreCompleto)}`}
                className="rounded-lg bg-sky-600 px-3 py-1.5 text-sm text-white"
              >
                Nueva cita
              </Link>
              <Link
                to={`${APP_ROUTES.HISTORIA_CLINICA}?pacienteId=${item.id}`}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm text-white"
              >
                Historia
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
              <th className="px-4 py-3 text-left">Paciente</th>
              <th className="px-4 py-3 text-left">Documento</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Teléfono</th>
              <th className="px-4 py-3 text-left">Total citas</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3">{item.nombreCompleto}</td>
                <td className="px-4 py-3">{item.documento}</td>
                <td className="px-4 py-3">{item.email}</td>
                <td className="px-4 py-3">{item.telefono}</td>
                <td className="px-4 py-3">{item.totalCitas}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={APP_ROUTES.PACIENTES_DETALLE.replace(':id', String(item.id))}
                      className="rounded-lg bg-gray-800 px-3 py-1 text-sm text-white"
                    >
                      Ver
                    </Link>
                    <Link
                      to={`${APP_ROUTES.CITAS}?pacienteId=${item.id}`}
                      className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white"
                    >
                      Ver citas
                    </Link>
                    <Link
                      to={`${APP_ROUTES.CITAS_NUEVA}?pacienteId=${item.id}&pacienteNombre=${encodeURIComponent(item.nombreCompleto)}`}
                      className="rounded-lg bg-sky-600 px-3 py-1 text-sm text-white"
                    >
                      Nueva cita
                    </Link>
                    <Link
                      to={`${APP_ROUTES.HISTORIA_CLINICA}?pacienteId=${item.id}`}
                      className="rounded-lg bg-emerald-600 px-3 py-1 text-sm text-white"
                    >
                      Ver historia
                    </Link>
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
