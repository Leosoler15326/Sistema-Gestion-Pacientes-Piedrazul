import { useState } from 'react';
import type { ReagendarCitaRequestDto } from '../types/cita.types';

interface ReagendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ReagendarCitaRequestDto) => Promise<void>;
  loading?: boolean;
}

export default function ReagendarModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}: ReagendarModalProps) {
  const [form, setForm] = useState<ReagendarCitaRequestDto>({
    fecha: '',
    horaInicio: '',
    horaFin: '',
    motivoReagenda: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async () => {
    await onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Reagendar cita</h2>

        <div className="space-y-4">
          <input
            type="date"
            value={form.fecha}
            onChange={(e) => setForm((prev) => ({ ...prev, fecha: e.target.value }))}
            className="w-full rounded-lg border px-3 py-2"
          />

          <input
            type="time"
            value={form.horaInicio}
            onChange={(e) => setForm((prev) => ({ ...prev, horaInicio: e.target.value }))}
            className="w-full rounded-lg border px-3 py-2"
          />

          <input
            type="time"
            value={form.horaFin}
            onChange={(e) => setForm((prev) => ({ ...prev, horaFin: e.target.value }))}
            className="w-full rounded-lg border px-3 py-2"
          />

          <textarea
            rows={3}
            placeholder="Motivo de reagendamiento"
            value={form.motivoReagenda}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, motivoReagenda: e.target.value }))
            }
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2"
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Reagendar'}
          </button>
        </div>
      </div>
    </div>
  );
}