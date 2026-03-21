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
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nombreUsuario">Usuario</label>
        <input
          id="nombreUsuario"
          type="text"
          value={form.nombreUsuario}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, nombreUsuario: e.target.value }))
          }
          placeholder="Ingresa tu usuario"
        />
      </div>

      <div>
        <label htmlFor="contrasena">Contraseña</label>
        <input
          id="contrasena"
          type="password"
          value={form.contrasena}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, contrasena: e.target.value }))
          }
          placeholder="********"
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Ingresando...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}