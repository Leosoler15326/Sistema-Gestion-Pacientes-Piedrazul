import { useState, type FormEvent } from 'react';
import type { CreateHistoriaClinicaRequestDto } from '../types/historiaClinica.types';

interface HistoriaClinicaFormProps {
  onSubmit: (values: CreateHistoriaClinicaRequestDto) => Promise<void>;
  loading?: boolean;
}

export default function HistoriaClinicaForm({
  onSubmit,
  loading = false,
}: HistoriaClinicaFormProps) {
  const [form, setForm] = useState<CreateHistoriaClinicaRequestDto>({
    citaId: 0,
    descripcion: '',
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl bg-white p-6 shadow">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          ID de la cita
        </label>
        <input
          type="number"
          value={form.citaId || ''}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, citaId: Number(e.target.value) }))
          }
          className="w-full rounded-lg border px-3 py-2"
          required
        />
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