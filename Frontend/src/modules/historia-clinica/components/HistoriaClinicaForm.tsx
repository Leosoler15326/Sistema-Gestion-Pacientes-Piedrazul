import { useState, type FormEvent } from 'react';
import type { CreateHistoriaClinicaRequestDto } from '../types/historiaClinica.types';

interface HistoriaClinicaFormProps {
  onSubmit: (values: CreateHistoriaClinicaRequestDto) => Promise<void>;
  loading?: boolean;
  initialCitaId?: number;
  citaLabel?: string;
}

export default function HistoriaClinicaForm({
  onSubmit,
  loading = false,
  initialCitaId,
  citaLabel,
}: HistoriaClinicaFormProps) {
  const [message, setMessage] = useState('');
  const [citaIdInput, setCitaIdInput] = useState(
    initialCitaId ? String(initialCitaId) : ''
  );

  const [form, setForm] = useState<CreateHistoriaClinicaRequestDto>({
    citaId: initialCitaId ?? 0,
    descripcion: '',
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    if (!form.citaId) {
      setMessage('Debes seleccionar una cita válida.');
      return;
    }

    if (!form.descripcion.trim()) {
      setMessage('La descripción es obligatoria.');
      return;
    }

    try {
      await onSubmit({
        citaId: form.citaId,
        descripcion: form.descripcion.trim(),
      });
    } catch (error) {
      console.error(error);
      setMessage('No fue posible guardar la historia clínica.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl bg-white p-4 shadow sm:p-6">
      {message && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {message}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          ID de la cita
        </label>

        <input
          type="text"
          inputMode="numeric"
          value={citaIdInput}
          onChange={(e) => {
            setCitaIdInput(e.target.value);
            setForm((prev) => ({
              ...prev,
              citaId: e.target.value ? Number(e.target.value) : 0,
            }));
          }}
          className="w-full rounded-lg border px-3 py-2"
          required
          disabled={Boolean(initialCitaId)}
        />

        {citaLabel && (
          <p className="mt-2 text-sm text-gray-600">{citaLabel}</p>
        )}

        <p className="mt-2 text-xs text-gray-500">
          La historia clínica se registra sobre una cita ya existente.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Descripción
        </label>

        <textarea
          rows={6}
          value={form.descripcion}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, descripcion: e.target.value }))
          }
          className="w-full rounded-lg border px-3 py-2"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? 'Guardando...' : 'Guardar historia clínica'}
      </button>
    </form>
  );
}