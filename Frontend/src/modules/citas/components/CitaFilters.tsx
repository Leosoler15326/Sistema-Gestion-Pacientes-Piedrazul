import { useState, type FormEvent } from 'react';
import type { CitasFiltersDto, EstadoCita } from '../types/cita.types';

interface CitaFiltersProps {
  onApply: (filters: CitasFiltersDto) => void;
}

export default function CitaFilters({ onApply }: CitaFiltersProps) {
  const [filters, setFilters] = useState<CitasFiltersDto>({
    fecha: '',
    estado: '',
    paciente: '',
    profesional: '',
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onApply(filters);
  };

  const handleClear = () => {
    const emptyFilters: CitasFiltersDto = {
      fecha: '',
      estado: '',
      paciente: '',
      profesional: '',
    };
    setFilters(emptyFilters);
    onApply(emptyFilters);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 grid grid-cols-1 gap-4 rounded-xl bg-white p-4 shadow md:grid-cols-4"
    >
      <input
        type="date"
        value={filters.fecha}
        onChange={(e) => setFilters((prev) => ({ ...prev, fecha: e.target.value }))}
        className="rounded-lg border px-3 py-2"
      />

      <select
        value={filters.estado}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            estado: e.target.value as EstadoCita | '',
          }))
        }
        className="rounded-lg border px-3 py-2"
      >
        <option value="">Todos los estados</option>
        <option value="PENDIENTE">Pendiente</option>
        <option value="CONFIRMADA">Confirmada</option>
        <option value="CANCELADA">Cancelada</option>
        <option value="COMPLETADA">Completada</option>
        <option value="REAGENDADA">Reagendada</option>
      </select>

      <input
        type="text"
        placeholder="Paciente"
        value={filters.paciente}
        onChange={(e) => setFilters((prev) => ({ ...prev, paciente: e.target.value }))}
        className="rounded-lg border px-3 py-2"
      />

      <input
        type="text"
        placeholder="Profesional"
        value={filters.profesional}
        onChange={(e) => setFilters((prev) => ({ ...prev, profesional: e.target.value }))}
        className="rounded-lg border px-3 py-2"
      />

      <div className="md:col-span-4 flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Aplicar filtros
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100"
        >
          Limpiar
        </button>
      </div>
    </form>
  );
}