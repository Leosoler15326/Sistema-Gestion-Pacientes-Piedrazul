import { useState, type FormEvent } from 'react';
import type { CreateCitaRequestDto } from '../types/cita.types';

interface CitaFormProps {
  onSubmit: (values: CreateCitaRequestDto) => Promise<void>;
  loading?: boolean;
}

export default function CitaForm({ onSubmit, loading = false }: CitaFormProps) {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');

  const [form, setForm] = useState<Omit<CreateCitaRequestDto, 'fechaHora'>>({
    pacienteId: 0,
    profesionalId: 0,
    tipoAtencion: '',
    motivoConsulta: '',
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fechaHora = `${fecha}T${hora}:00`;

    await onSubmit({
      ...form,
      fechaHora,
    });
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
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="rounded-lg border px-3 py-2"
          required
        />

        <input
          type="time"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          className="rounded-lg border px-3 py-2"
          required
        />

        <input
          type="text"
          placeholder="Tipo de atención"
          value={form.tipoAtencion}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, tipoAtencion: e.target.value }))
          }
          className="rounded-lg border px-3 py-2 md:col-span-2"
          required
        />
      </div>

      <textarea
        placeholder="Motivo de consulta"
        value={form.motivoConsulta}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, motivoConsulta: e.target.value }))
        }
        className="w-full rounded-lg border px-3 py-2"
        rows={4}
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? 'Guardando...' : 'Agendar cita'}
      </button>
    </form>
  );
}