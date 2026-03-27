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
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [motivo, setMotivo] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const nuevaFechaHora = `${fecha}T${hora}:00`;

    await onSubmit({
      nuevaFechaHora,
      motivo,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Reagendar cita</h2>

        <div className="space-y-4">
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          />

          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          />

          <textarea
            rows={3}
            placeholder="Motivo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
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