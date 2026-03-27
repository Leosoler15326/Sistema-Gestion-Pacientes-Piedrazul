import { useState, type FormEvent } from 'react';
import type { CrearPacienteDto } from '../types/paciente.types';

interface PacienteFormProps {
  onSubmit: (values: CrearPacienteDto) => Promise<void>;
  loading?: boolean;
}

export default function PacienteForm({
  onSubmit,
  loading = false,
}: PacienteFormProps) {
  const [form, setForm] = useState<CrearPacienteDto>({
    nombres: '',
    apellidos: '',
    documento: '',
    email: '',
    telefono: '',
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.nombres.trim() || !form.apellidos.trim()) {
      alert('Nombres y apellidos son obligatorios.');
      return;
    }

    if (!form.documento.trim()) {
      alert('El documento es obligatorio.');
      return;
    }

    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow">
      <input
        type="text"
        placeholder="Nombres"
        value={form.nombres}
        onChange={(e) => setForm((prev) => ({ ...prev, nombres: e.target.value }))}
        className="w-full rounded-lg border px-3 py-2"
        required
      />

      <input
        type="text"
        placeholder="Apellidos"
        value={form.apellidos}
        onChange={(e) => setForm((prev) => ({ ...prev, apellidos: e.target.value }))}
        className="w-full rounded-lg border px-3 py-2"
        required
      />

      <input
        type="text"
        placeholder="Documento"
        value={form.documento}
        onChange={(e) => setForm((prev) => ({ ...prev, documento: e.target.value }))}
        className="w-full rounded-lg border px-3 py-2"
        required
      />

      <input
        type="email"
        placeholder="Correo electrónico"
        value={form.email}
        onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
        className="w-full rounded-lg border px-3 py-2"
        required
      />

      <input
        type="text"
        placeholder="Teléfono"
        value={form.telefono}
        onChange={(e) => setForm((prev) => ({ ...prev, telefono: e.target.value }))}
        className="w-full rounded-lg border px-3 py-2"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? 'Guardando...' : 'Guardar paciente'}
      </button>
    </form>
  );
}