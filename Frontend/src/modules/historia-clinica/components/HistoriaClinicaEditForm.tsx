import { useState, type FormEvent } from 'react';
import type { HistoriaClinicaDto, UpdateHistoriaClinicaRequestDto } from '../types/historiaClinica.types';

interface HistoriaClinicaEditFormProps {
  initialData: HistoriaClinicaDto;
  onSubmit: (values: UpdateHistoriaClinicaRequestDto) => Promise<void>;
  loading?: boolean;
}

export default function HistoriaClinicaEditForm({
  initialData,
  onSubmit,
  loading = false,
}: HistoriaClinicaEditFormProps) {
  const [descripcion, setDescripcion] = useState(initialData.descripcion);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({ descripcion });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl bg-white p-6 shadow">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          rows={6}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white"
      >
        {loading ? 'Guardando...' : 'Actualizar historia clínica'}
      </button>
    </form>
  );
}