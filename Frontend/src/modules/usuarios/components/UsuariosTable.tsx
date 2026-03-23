import { Link } from 'react-router-dom';
import type { UsuarioDto } from '../types/usuario.types';
import { APP_ROUTES } from '../../../app/router/routes';

interface UsuariosTableProps {
  items: UsuarioDto[];
  onDesactivar?: (id: number) => void;
}

export default function UsuariosTable({ items, onDesactivar }: UsuariosTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">Usuario</th>
            <th className="px-4 py-3 text-left">Nombre completo</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Rol</th>
            <th className="px-4 py-3 text-left">Estado acceso</th>
            <th className="px-4 py-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(items)&&items.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="px-4 py-3">{item.nombreUsuario || item.username || 'N/A'}</td>
              <td className="px-4 py-3">{item.nombreCompleto || item.nombres || 'N/A'}</td>
              <td className="px-4 py-3">{item.email || 'N/A'}</td>
              <td className="px-4 py-3">{item.rol || 'N/A'}</td>
              <td className="px-4 py-3">
                {item.estado ?? (item.activo ? 'ACTIVO' : 'INACTIVO')}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={APP_ROUTES.USUARIOS_DETALLE.replace(':id', String(item.id))}
                    className="rounded-lg bg-gray-800 px-3 py-1 text-sm text-white"
                  >
                    Ver
                  </Link>

                  {onDesactivar && (
                    <button
                      type="button"
                      onClick={() => onDesactivar(item.id)}
                      className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white"
                    >
                      Desactivar acceso
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