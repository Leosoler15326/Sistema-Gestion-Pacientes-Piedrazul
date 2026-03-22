import { useState, type FormEvent } from 'react';
import type { ActualizarUsuarioDto, UsuarioDto } from '../types/usuario.types';
import { ROL_USUARIO_OPTIONS } from '../../../constants/enums';

interface UsuarioEditFormProps {
  initialData: UsuarioDto;
  onSubmit: (values: ActualizarUsuarioDto) => Promise<void>;
  loading?: boolean;
}

export default function UsuarioEditForm({
  initialData,
  onSubmit,
  loading = false,
}: UsuarioEditFormProps) {
  const [form, setForm] = useState<ActualizarUsuarioDto>({
    nombreUsuario: initialData.nombreUsuario || initialData.username || '',
    nombreCompleto: initialData.nombreCompleto || initialData.nombres || '',
    email: initialData.email || '',
    rol: initialData.rol || '',
    estado: initialData.estado || '',
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow">
      <input
        type="text"
        value={form.nombreUsuario ?? ''}
        onChange={(e) => setForm((prev) => ({ ...prev, nombreUsuario: e.target.value }))}
        className="w-full rounded-lg border px-3 py-2"
      />

      <input
        type="text"
        value={form.nombreCompleto ?? ''}
        onChange={(e) => setForm((prev) => ({ ...prev, nombreCompleto: e.target.value }))}
        className="w-full rounded-lg border px-3 py-2"
      />

      <input
        type="email"
        value={form.email ?? ''}
        onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
        className="w-full rounded-lg border px-3 py-2"
      />

      <select
        value={form.rol ?? ''}
        onChange={(e) => setForm((prev) => ({ ...prev, rol: e.target.value }))}
        className="w-full rounded-lg border px-3 py-2"
      >
        <option value="">Selecciona un rol</option>
        {ROL_USUARIO_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={form.estado ?? ''}
        onChange={(e) => setForm((prev) => ({ ...prev, estado: e.target.value }))}
        className="w-full rounded-lg border px-3 py-2"
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white"
      >
        {loading ? 'Guardando...' : 'Actualizar usuario'}
      </button>
    </form>
  );
}