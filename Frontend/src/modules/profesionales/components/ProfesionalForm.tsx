
import { useState, type FormEvent } from 'react';
import type { CrearProfesionalDto } from '../types/profesional.types';
import {
  ESPECIALIDAD_OPTIONS,
  TIPO_PROFESIONAL_OPTIONS,
} from '../../../constants/enums';

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
  const [intervaloInput, setIntervaloInput] = useState('30');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.nombres.trim()) {
      alert('El nombre del profesional es obligatorio.');
      return;
    }

    if (!form.tipo.trim() || !form.especialidad.trim()) {
      alert('Tipo y especialidad son obligatorios.');
      return;
    }

    if (form.crearUsuario && (!form.nombreUsuario?.trim() || !form.contrasena?.trim())) {
      alert('Debes ingresar usuario y contraseña para crear usuario vinculado.');
      return;
    }

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

      <select
        value={form.tipo}
        onChange={(e) => setForm((prev) => ({ ...prev, tipo: e.target.value }))}
        className="w-full rounded-lg border px-3 py-2"
        required
      >
        <option value="">Selecciona tipo profesional</option>
        {TIPO_PROFESIONAL_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Especialidad
        </label>

        <select
          value={especialidadSeleccionada}
          onChange={(e) => {
            setEspecialidadSeleccionada(e.target.value);
            setForm((prev) => ({ ...prev, profesionalId: 0 }));
            setHoraSeleccionada('');
          }}
          className="w-full rounded-lg border px-3 py-2"
        >
          <option value="">Todas las especialidades</option>

          {ESPECIALIDAD_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <input
        type="text"
        inputMode="numeric"
        placeholder="Intervalo en minutos"
        value={intervaloInput}
        onChange={(e) => {
          setIntervaloInput(e.target.value);
          setForm((prev) => ({
            ...prev,
            intervaloMinutos: e.target.value ? Number(e.target.value) : 0,
          }));
        }}
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