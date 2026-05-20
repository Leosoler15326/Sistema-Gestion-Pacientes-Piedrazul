import { useState, type FormEvent } from 'react';
import type { LoginRequestDto } from '../types/auth.types';

interface LoginFormProps {
  onSubmit: (values: LoginRequestDto) => Promise<void>;
  loading?: boolean;
}

export default function LoginForm({ onSubmit, loading = false }: LoginFormProps) {
  const [form, setForm] = useState<LoginRequestDto>({
    nombreUsuario: '',
    contrasena: '',
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.nombreUsuario.trim() || !form.contrasena.trim()) {
      return;
    }

    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="nombreUsuario"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Usuario
        </label>
        <input
          id="nombreUsuario"
          type="text"
          value={form.nombreUsuario}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, nombreUsuario: e.target.value }))
          }
          placeholder="Ingresa tu usuario"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label
          htmlFor="contrasena"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Contraseña
        </label>
        <input
          id="contrasena"
          type="password"
          value={form.contrasena}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, contrasena: e.target.value }))
          }
          placeholder="Ingresa tu contraseña"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Ingresando...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}