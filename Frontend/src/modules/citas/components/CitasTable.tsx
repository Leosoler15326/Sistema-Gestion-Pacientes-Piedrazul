import { Link } from 'react-router-dom';
import EstadoCitaBadge from './EstadoCitaBadge';
import type { CitaDto } from '../types/cita.types';
import { APP_ROUTES } from '../../../app/router/routes';

interface CitasTableProps {
  items: CitaDto[];
  onCancel?: (id: number) => void;
}

export default function CitasTable({ items, onCancel }: CitasTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">Fecha</th>
            <th className="px-4 py-3 text-left">Hora</th>
            <th className="px-4 py-3 text-left">Paciente</th>
            <th className="px-4 py-3 text-left">Profesional</th>
            <th className="px-4 py-3 text-left">Estado</th>
            <th className="px-4 py-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((cita) => (
            <tr key={cita.id} className="border-t">
              <td className="px-4 py-3">{cita.fecha}</td>
              <td className="px-4 py-3">
                {cita.horaInicio} - {cita.horaFin}
              </td>
              <td className="px-4 py-3">{cita.paciente.fullName}</td>
              <td className="px-4 py-3">{cita.profesional.fullName}</td>
              <td className="px-4 py-3">
                <EstadoCitaBadge estado={cita.estado} />
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={APP_ROUTES.CITAS_DETALLE.replace(':id', String(cita.id))}
                    className="rounded-lg bg-gray-800 px-3 py-1 text-sm text-white"
                  >
                    Ver
                  </Link>

                  {cita.puedeReagendar && (
                    <Link
                      to={APP_ROUTES.CITAS_REAGENDAR.replace(':id', String(cita.id))}
                      className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white"
                    >
                      Reagendar
                    </Link>
                  )}

                  {cita.puedeCancelar && onCancel && (
                    <button
                      type="button"
                      onClick={() => onCancel(cita.id)}
                      className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white"
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
  );
}