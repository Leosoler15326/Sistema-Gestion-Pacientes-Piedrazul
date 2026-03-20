import { useState, type FormEvent } from 'react';
import AntecedentesSection from './AntecedentesSection';
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
    motivoConsulta: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: '',
    antecedentes: {
      personales: '',
      familiares: '',
      alergias: '',
      medicamentos: '',
    },
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl bg-white p-6 shadow">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">ID de la cita</label>
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
        <label className="mb-1 block text-sm font-medium text-gray-700">Motivo de consulta</label>
        <textarea
          rows={3}
          value={form.motivoConsulta}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, motivoConsulta: e.target.value }))
          }
          className="w-full rounded-lg border px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Diagnóstico</label>
        <textarea
          rows={3}
          value={form.diagnostico}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, diagnostico: e.target.value }))
          }
          className="w-full rounded-lg border px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Tratamiento</label>
        <textarea
          rows={3}
          value={form.tratamiento}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, tratamiento: e.target.value }))
          }
          className="w-full rounded-lg border px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Antecedentes</label>
        <AntecedentesSection
          value={form.antecedentes}
          onChange={(antecedentes) =>
            setForm((prev) => ({ ...prev, antecedentes }))
          }
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Observaciones</label>
        <textarea
          rows={4}
          value={form.observaciones}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, observaciones: e.target.value }))
          }
          className="w-full rounded-lg border px-3 py-2"
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
