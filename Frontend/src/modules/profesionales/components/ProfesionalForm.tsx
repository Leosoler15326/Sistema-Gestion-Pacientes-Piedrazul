import { useState, type FormEvent } from 'react';
import type { CrearProfesionalDto } from '../types/profesional.types';
import {
  ESPECIALIDAD_OPTIONS,
  TIPO_PROFESIONAL_OPTIONS,
} from '../../../constants/enums';

interface ProfesionalFormProps {
  onSubmit: (values: CrearProfesionalDto) => Promise<void>;
  loading?: boolean;
  tipoFijo?: string;   // pre-selecciona y oculta el selector de tipo
}

export default function ProfesionalForm({
  onSubmit,
  loading = false,
  tipoFijo,
}: ProfesionalFormProps) {
  const [form, setForm] = useState<CrearProfesionalDto>({
    nombres: '',
    tipo: tipoFijo ?? '',
    especialidad: '',
    intervaloMinutos: 30,
    crearUsuario: false,
    nombreUsuario: '',
    contrasena: '',
  });

  const [intervaloInput, setIntervaloInput] = useState('30');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isLoading = loading || submitting;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    const nombres = form.nombres.trim();
    const tipo = String(form.tipo ?? '').trim();
    const especialidad = String(form.especialidad ?? '').trim();
    const nombreUsuario = String(form.nombreUsuario ?? '').trim();
    const contrasena = String(form.contrasena ?? '').trim();
    const intervaloMinutos = Number(intervaloInput);

    if (!nombres) {
      setMessage('El nombre del profesional es obligatorio.');
      return;
    }

    if (!tipo) {
      setMessage('Debes seleccionar el tipo de profesional.');
      return;
    }

    if (!especialidad) {
      setMessage('Debes seleccionar la especialidad.');
      return;
    }

    if (!Number.isFinite(intervaloMinutos) || intervaloMinutos <= 0) {
      setMessage('El intervalo en minutos debe ser un número mayor que 0.');
      return;
    }

    if (form.crearUsuario) {
      if (!nombreUsuario) {
        setMessage('Debes ingresar el nombre de usuario.');
        return;
      }

      if (!contrasena) {
        setMessage('Debes ingresar la contraseña.');
        return;
      }
    }

    const payload: CrearProfesionalDto = {
      nombres,
      tipo,
      especialidad,
      intervaloMinutos,
      crearUsuario: Boolean(form.crearUsuario),
      nombreUsuario: form.crearUsuario ? nombreUsuario : undefined,
      contrasena: form.crearUsuario ? contrasena : undefined,
    };

    try {
      setSubmitting(true);
      await onSubmit(payload);
    } catch (error) {
      console.error(error);
      setMessage('No fue posible guardar el profesional.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl bg-white p-4 shadow sm:p-6"
    >
      {message && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {message}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Nombres
        </label>
        <input
          type="text"
          placeholder="Nombres del profesional"
          value={form.nombres}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, nombres: e.target.value }))
          }
          className="w-full rounded-lg border px-3 py-2"
          required
        />
      </div>

      {!tipoFijo && (
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Tipo de profesional
          </label>
          <select
            value={form.tipo}
            onChange={(e) => setForm((prev) => ({ ...prev, tipo: e.target.value }))}
            className="w-full rounded-lg border px-3 py-2"
            required
          >
            <option value="">Selecciona tipo profesional</option>
            {TIPO_PROFESIONAL_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option === 'MEDICO' ? 'Médico' : 'Terapista'}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Especialidad
        </label>
        <select
          value={form.especialidad}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, especialidad: e.target.value }))
          }
          className="w-full rounded-lg border px-3 py-2"
          required
        >
          <option value="">Selecciona especialidad</option>
          {ESPECIALIDAD_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Intervalo en minutos
        </label>
        <input
          type="text"
          inputMode="numeric"
          placeholder="Intervalo en minutos"
          value={intervaloInput}
          onChange={(e) => {
            const value = e.target.value.replace(/[^\d]/g, '');
            setIntervaloInput(value);
            setForm((prev) => ({
              ...prev,
              intervaloMinutos: value ? Number(value) : 0,
            }));
          }}
          className="w-full rounded-lg border px-3 py-2"
          required
        />
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={Boolean(form.crearUsuario)}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              crearUsuario: e.target.checked,
              nombreUsuario: e.target.checked ? prev.nombreUsuario ?? '' : '',
              contrasena: e.target.checked ? prev.contrasena ?? '' : '',
            }))
          }
        />
        Crear usuario vinculado
      </label>

      {form.crearUsuario && (
        <>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nombre de usuario
            </label>
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={form.nombreUsuario ?? ''}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  nombreUsuario: e.target.value,
                }))
              }
              className="w-full rounded-lg border px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Contraseña"
              value={form.contrasena ?? ''}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  contrasena: e.target.value,
                }))
              }
              className="w-full rounded-lg border px-3 py-2"
              required
            />
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {isLoading ? 'Guardando...' : 'Guardar profesional'}
      </button>
    </form>
  );
}