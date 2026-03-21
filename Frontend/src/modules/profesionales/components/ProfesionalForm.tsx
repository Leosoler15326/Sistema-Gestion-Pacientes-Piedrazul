
import { useState, type FormEvent } from 'react';
import type { CrearProfesionalDto } from '../types/profesional.types';

interface ProfesionalFormProps {
  onSubmit: (values: CrearProfesionalDto) => Promise<void>;
  loading?: boolean;
}

export default function ProfesionalForm({
  onSubmit,
  loading = false,
}: ProfesionalFormProps) {
  const [form, setForm] = useState<CrearProfesionalDto>({
    nombres: '',
    tipo: '',
    especialidad: '',
    intervaloMinutos: 30,
    crearUsuario: false,
    nombreUsuario: '',
    contrasena: '',
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: CrearProfesionalDto = {
      nombres: form.nombres,
      tipo: form.tipo,
      especialidad: form.especialidad,
      intervaloMinutos: Number(form.intervaloMinutos),
      crearUsuario: form.crearUsuario,
      nombreUsuario: form.crearUsuario ? form.nombreUsuario : undefined,
      contrasena: form.crearUsuario ? form.contrasena : undefined,
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow">
      <input
        type="text"
        placeholder="Nombres"
        value={form.nombres}
        onChange={(e) => setForm((prev) => ({ ...prev, nombres: e.target.value }))}
        className="w-full rounded-lg border px-3 py-2"
        required
      />

      <input
        type="text"
        placeholder="Tipo profesional (ej: MEDICO)"
        value={form.tipo}
        onChange={(e) => setForm((prev) => ({ ...prev, tipo: e.target.value }))}
        className="w-full rounded-lg border px-3 py-2"
        required
      />

      <input
        type="text"
        placeholder="Especialidad (ej: MEDICINA_GENERAL)"
        value={form.especialidad}
        onChange={(e) => setForm((prev) => ({ ...prev, especialidad: e.target.value }))}
        className="w-full rounded-lg border px-3 py-2"
        required
      />

      <input
        type="number"
        placeholder="Intervalo en minutos"
        value={form.intervaloMinutos}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, intervaloMinutos: Number(e.target.value) }))
        }
        className="w-full rounded-lg border px-3 py-2"
        required
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.crearUsuario}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, crearUsuario: e.target.checked }))
          }
        />
        Crear usuario vinculado
      </label>

      {form.crearUsuario && (
        <>
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
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? 'Guardando...' : 'Guardar profesional'}
      </button>
    </form>
  );
}