import { useState, type FormEvent } from 'react';
import type { ActualizarPacienteDto, PacienteDto } from '../types/paciente.types';

interface PacienteEditFormProps {
  initialData: PacienteDto;
  onSubmit: (values: ActualizarPacienteDto) => Promise<void>;
  loading?: boolean;
}

export default function PacienteEditForm({
  initialData,
  onSubmit,
  loading = false,
}: PacienteEditFormProps) {
  const [form, setForm] = useState<ActualizarPacienteDto>({
    nombres: initialData.nombres,
    apellidos: initialData.apellidos,
    documento: initialData.documento,
    email: initialData.email,
    telefono: initialData.telefono,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow">
      <input
        type="text"
        value={form.nombres ?? ''}
        onChange={(e) => setForm((prev) => ({ ...prev, nombres: e.target.value }))}
        className="w-full rounded-lg border px-3 py-2"
      />

      <input
        type="text"
        value={form.apellidos ?? ''}
        onChange={(e) => setForm((prev) => ({ ...prev, apellidos: e.target.value }))}
        className="w-full rounded-lg border px-3 py-2"
      />

      <input
        type="text"
        value={form.documento ?? ''}
        onChange={(e) => setForm((prev) => ({ ...prev, documento: e.target.value }))}
        className="w-full rounded-lg border px-3 py-2"
      />

      <input
        type="email"
        value={form.email ?? ''}
        onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
        className="w-full rounded-lg border px-3 py-2"
      />

      <input
        type="text"
        value={form.telefono ?? ''}
        onChange={(e) => setForm((prev) => ({ ...prev, telefono: e.target.value }))}
        className="w-full rounded-lg border px-3 py-2"
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white"
      >
        {loading ? 'Guardando...' : 'Actualizar paciente'}
      </button>
    </form>
  );
}