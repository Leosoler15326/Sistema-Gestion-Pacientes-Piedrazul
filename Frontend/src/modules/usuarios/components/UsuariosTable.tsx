import { Link } from 'react-router-dom';
import type { UsuarioDto } from '../types/usuario.types';
import { APP_ROUTES } from '../../../app/router/routes';

interface UsuariosTableProps {
  items: UsuarioDto[];
  currentUserId?: number;
  onDesactivar?: (id: number) => void;
  onReactivar?: (id: number) => void;
}

function estadoAcceso(item: UsuarioDto): string {
  const raw = item.estado ?? (item.activo ? 'ACTIVO' : 'INACTIVO');
  return String(raw).toUpperCase();
}

function AccionBtn({
  item,
  currentUserId,
  onDesactivar,
  onReactivar,
}: {
  item: UsuarioDto;
  currentUserId?: number;
  onDesactivar?: (id: number) => void;
  onReactivar?: (id: number) => void;
}) {
  if (item.rol === 'ADMINISTRADOR') {
    return (
      <button type="button" disabled className="rounded-lg bg-gray-300 px-3 py-1 text-sm text-gray-600">
        Sin cambio de acceso
      </button>
    );
  }
  if (item.id === currentUserId) {
    return (
      <button type="button" disabled className="rounded-lg bg-gray-300 px-3 py-1 text-sm text-gray-600">
        Tu usuario
      </button>
    );
  }
  if (estadoAcceso(item) === 'INACTIVO') {
    return onReactivar ? (
      <button
        type="button"
        onClick={() => onReactivar(item.id)}
        className="rounded-lg bg-emerald-600 px-3 py-1 text-sm text-white"
      >
        Reactivar acceso
      </button>
    ) : null;
  }
  return onDesactivar ? (
    <button
      type="button"
      onClick={() => onDesactivar(item.id)}
      className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white"
    >
      Desactivar acceso
    </button>
  ) : null;
}

export default function UsuariosTable({
  items,
  currentUserId,
  onDesactivar,
  onReactivar,
}: UsuariosTableProps) {
  return (
    <>
      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {Array.isArray(items) && items.map((item) => (
          <div key={item.id} className="rounded-xl bg-white p-4 shadow">
            <p className="font-semibold text-slate-800">
              {item.nombreCompleto || item.nombres || 'N/A'}
            </p>
            <p className="text-sm text-slate-500">@{item.nombreUsuario || item.username || 'N/A'}</p>
            {item.email && <p className="text-sm text-slate-500">{item.email}</p>}
            <div className="mt-1 flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                {item.rol || 'N/A'}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                estadoAcceso(item) === 'ACTIVO'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {estadoAcceso(item)}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                to={APP_ROUTES.USUARIOS_DETALLE.replace(':id', String(item.id))}
                className="rounded-lg bg-gray-800 px-3 py-1.5 text-sm text-white"
              >
                Ver
              </Link>
              <AccionBtn
                item={item}
                currentUserId={currentUserId}
                onDesactivar={onDesactivar}
                onReactivar={onReactivar}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-xl bg-white shadow">
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
            {Array.isArray(items) && items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3">{item.nombreUsuario || item.username || 'N/A'}</td>
                <td className="px-4 py-3">{item.nombreCompleto || item.nombres || 'N/A'}</td>
                <td className="px-4 py-3">{item.email || 'N/A'}</td>
                <td className="px-4 py-3">{item.rol || 'N/A'}</td>
                <td className="px-4 py-3">{estadoAcceso(item)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={APP_ROUTES.USUARIOS_DETALLE.replace(':id', String(item.id))}
                      className="rounded-lg bg-gray-800 px-3 py-1 text-sm text-white"
                    >
                      Ver
                    </Link>
                    <AccionBtn
                      item={item}
                      currentUserId={currentUserId}
                      onDesactivar={onDesactivar}
                      onReactivar={onReactivar}
                    />
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
