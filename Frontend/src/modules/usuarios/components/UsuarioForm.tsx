import { useState, type FormEvent } from 'react';
import type { CrearUsuarioDto } from '../types/usuario.types';

interface UsuarioFormProps {
  onSubmit: (values: CrearUsuarioDto) => Promise<void>;
  loading?: boolean;
}

export default function UsuarioForm({
  onSubmit,
  loading = false,
}: UsuarioFormProps) {
  const [form, setForm] = useState<CrearUsuarioDto>({
    nombreUsuario: '',
    contrasena: '',
    nombreCompleto: '',
    email: '',
    rol: '',
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.nombreUsuario.trim() || !form.contrasena.trim()) {
      alert('Usuario y contraseña son obligatorios.');
      return;
    }

    if (!form.nombreCompleto.trim() || !form.email.trim()) {
      alert('Nombre completo y correo son obligatorios.');
      return;
    }

    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow">
      <input
        type="text"
        placeholder="Nombre de usuario"
        value={form.nombreUsuario}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, nombreUsuario: e.target.value }))
        }
        className="w-full rounded-lg border px-3 py-2"
        required
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={form.contrasena}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, contrasena: e.target.value }))
        }
        className="w-full rounded-lg border px-3 py-2"
        required
      />

      <input
        type="text"
        placeholder="Nombre completo"
        value={form.nombreCompleto}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, nombreCompleto: e.target.value }))
        }
        className="w-full rounded-lg border px-3 py-2"
        required
      />

      <input
        type="email"
        placeholder="Correo electrónico"
        value={form.email}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, email: e.target.value }))
        }
        className="w-full rounded-lg border px-3 py-2"
        required
      />

      <input
        type="text"
        placeholder="Rol (ej: RECEPCIONISTA)"
        value={form.rol}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, rol: e.target.value }))
        }
        className="w-full rounded-lg border px-3 py-2"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? 'Guardando...' : 'Guardar usuario'}
      </button>
    </form>
  );
}
