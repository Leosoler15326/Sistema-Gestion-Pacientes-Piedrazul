import { useState } from 'react';
import type { ReagendarCitaRequestDto } from '../types/cita.types';

type ProfesionalItem = {
  profesionalId?: number;
  id?: number;
  nombres?: string;
};

interface ReagendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ReagendarCitaRequestDto) => Promise<void>;
  loading?: boolean;
  profesionales?: ProfesionalItem[];
}

export default function ReagendarModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  profesionales,
}: ReagendarModalProps) {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [motivo, setMotivo] = useState('');
  const [nuevoProfesionalId, setNuevoProfesionalId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const nuevaFechaHora = `${fecha}T${hora}:00`;
    await onSubmit({
      nuevaFechaHora,
      motivo: motivo.trim() || undefined,
      nuevoProfesionalId: nuevoProfesionalId ? Number(nuevoProfesionalId) : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-lg sm:p-6">
        <h2 className="mb-4 text-xl font-bold">Reagendar cita</h2>

        <div className="space-y-4">
          {profesionales && profesionales.length > 0 && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Cambiar profesional <span className="text-slate-400 text-xs">(opcional)</span>
              </label>
              <select
                value={nuevoProfesionalId}
                onChange={(e) => setNuevoProfesionalId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
              >
                <option value="">Mantener profesional actual</option>
                {profesionales.map((p) => {
                  const pId = p.profesionalId ?? p.id;
                  return (
                    <option key={pId} value={pId}>
                      {p.nombres ?? 'Profesional'}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Nueva fecha <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Hora <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Motivo
            </label>
            <textarea
              rows={3}
              placeholder="Motivo del reagendamiento"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
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
            disabled={loading || !fecha || !hora}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
          >
            {loading ? 'Guardando...' : 'Reagendar'}
          </button>
        </div>
      </div>
    </div>
  );
}
