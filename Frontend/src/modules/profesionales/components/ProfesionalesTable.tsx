import { Link } from 'react-router-dom';
import type { ProfesionalDto } from '../types/profesional.types';
import { APP_ROUTES } from '../../../app/router/routes';

interface ProfesionalesTableProps {
  items: ProfesionalDto[];
}

export default function ProfesionalesTable({ items }: ProfesionalesTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Nombres</th>
            <th className="px-4 py-3 text-left">Tipo</th>
            <th className="px-4 py-3 text-left">Especialidad</th>
            <th className="px-4 py-3 text-left">Intervalo</th>
            <th className="px-4 py-3 text-left">Estado</th>
            <th className="px-4 py-3 text-left">Usuario vinculado</th>
            <th className="px-4 py-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.profesionalId} className="border-t">
              <td className="px-4 py-3">{item.profesionalId}</td>
              <td className="px-4 py-3">{item.nombres}</td>
              <td className="px-4 py-3">{item.tipo}</td>
              <td className="px-4 py-3">{item.especialidad}</td>
              <td className="px-4 py-3">{item.intervaloMinutos} min</td>
              <td className="px-4 py-3">{item.estado}</td>
              <td className="px-4 py-3">{item.usuarioVinculado ? 'Sí' : 'No'}</td>
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
  );
}