import { useState, type FormEvent } from 'react';
import type { CreateCitaRequestDto } from '../types/cita.types';

interface CitaFormProps {
  onSubmit: (values: CreateCitaRequestDto) => Promise<void>;
  loading?: boolean;
}

export default function CitaForm({ onSubmit, loading = false }: CitaFormProps) {
  const [form, setForm] = useState<CreateCitaRequestDto>({
    pacienteId: 0,
    profesionalId: 0,
    fecha: '',
    horaInicio: '',
    horaFin: '',
    motivo: '',
    observaciones: '',
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <input
          type="number"
          placeholder="ID paciente"
          value={form.pacienteId || ''}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, pacienteId: Number(e.target.value) }))
          }
          className="rounded-lg border px-3 py-2"
          required
        />

        <input
          type="number"
          placeholder="ID profesional"
          value={form.profesionalId || ''}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, profesionalId: Number(e.target.value) }))
          }
          className="rounded-lg border px-3 py-2"
          required
        />

        <input
          type="date"
          value={form.fecha}
          onChange={(e) => setForm((prev) => ({ ...prev, fecha: e.target.value }))}
          className="rounded-lg border px-3 py-2"
          required
        />

        <input
          type="time"
          value={form.horaInicio}
          onChange={(e) => setForm((prev) => ({ ...prev, horaInicio: e.target.value }))}
          className="rounded-lg border px-3 py-2"
          required
        />

        <input
          type="time"
          value={form.horaFin}
          onChange={(e) => setForm((prev) => ({ ...prev, horaFin: e.target.value }))}
          className="rounded-lg border px-3 py-2"
          required
        />
      </div>

      <input
        type="text"
        placeholder="Motivo de la cita"
        value={form.motivo}
        onChange={(e) => setForm((prev) => ({ ...prev, motivo: e.target.value }))}
        className="w-full rounded-lg border px-3 py-2"
        required
      />

      <textarea
        placeholder="Observaciones"
        value={form.observaciones}
        onChange={(e) => setForm((prev) => ({ ...prev, observaciones: e.target.value }))}
        className="w-full rounded-lg border px-3 py-2"
        rows={4}
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? 'Guardando...' : 'Guardar cita'}
      </button>
    </form>
  );
}