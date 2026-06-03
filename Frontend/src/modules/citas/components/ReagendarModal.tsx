import { useState } from 'react';
import { useDisponibilidad } from '../hooks/UseDisponibilidad';
import type { ReagendarCitaRequestDto } from '../types/cita.types';
import FestivosDatePicker from '../../../components/common/FestivosDatePicker';

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
  currentProfesionalId?: number;
}

function getFechaMin(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

export default function ReagendarModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  profesionales,
  currentProfesionalId,
}: ReagendarModalProps) {
  const [fecha, setFecha] = useState('');
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [motivo, setMotivo] = useState('');
  const [nuevoProfesionalId, setNuevoProfesionalId] = useState('');

  const efectivoProfId = nuevoProfesionalId
    ? Number(nuevoProfesionalId)
    : currentProfesionalId;

  const { data: slots, isLoading: slotsLoading } = useDisponibilidad(
    efectivoProfId,
    fecha || undefined
  );

  if (!isOpen) return null;

  const handleProfesionalChange = (val: string) => {
    setNuevoProfesionalId(val);
    setHoraSeleccionada('');
  };

  const handleFechaChange = (val: string) => {
    setFecha(val);
    setHoraSeleccionada('');
  };

  const handleSubmit = async () => {
    await onSubmit({
      nuevaFechaHora: horaSeleccionada,
      motivo: motivo.trim() || undefined,
      nuevoProfesionalId: nuevoProfesionalId ? Number(nuevoProfesionalId) : undefined,
    });
  };

  const puedeEnviar = Boolean(horaSeleccionada) && !loading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-lg sm:p-6">
        <h2 className="mb-4 text-xl font-bold">Reagendar cita</h2>

        <div className="space-y-4">
          {profesionales && profesionales.length > 0 && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Cambiar profesional{' '}
                <span className="text-xs text-slate-400">(opcional)</span>
              </label>
              <select
                value={nuevoProfesionalId}
                onChange={(e) => handleProfesionalChange(e.target.value)}
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
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Nueva fecha <span className="text-red-500">*</span>
            </label>
            <FestivosDatePicker
              value={fecha}
              onChange={handleFechaChange}
              minDate={new Date(getFechaMin() + 'T12:00:00')}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Horario disponible <span className="text-red-500">*</span>
            </label>
            {!efectivoProfId || !fecha ? (
              <p className="text-sm text-slate-500">
                Selecciona el profesional y la fecha para ver los horarios.
              </p>
            ) : slotsLoading ? (
              <p className="text-sm text-slate-500">Buscando horarios...</p>
            ) : Array.isArray(slots) && slots.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot.fechaHora}
                    type="button"
                    onClick={() => setHoraSeleccionada(slot.fechaHora)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      horaSeleccionada === slot.fechaHora
                        ? 'bg-blue-600 text-white shadow'
                        : 'border border-slate-300 bg-white hover:bg-blue-50 hover:border-blue-300'
                    }`}
                  >
                    {slot.horaFormateada}
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                No hay horarios disponibles para ese profesional en esa fecha.
                Prueba con otro día.
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Motivo del cambio
            </label>
            <textarea
              rows={2}
              placeholder="Motivo del reagendamiento (opcional)"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!puedeEnviar}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            {loading ? 'Guardando...' : 'Confirmar reagendamiento'}
          </button>
        </div>
      </div>
    </div>
  );
}
