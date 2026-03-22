import { useMemo, useState, type FormEvent } from 'react';
import { usePacientesPorNombre } from '../../pacientes/hooks/usePacientes';
import type { CreateCitaRequestDto, SlotDisponibleDto } from '../types/cita.types';

interface CitaFormProps {
  onSubmit: (values: CreateCitaRequestDto) => Promise<void>;
  loading?: boolean;
  slotsDisponibles?: SlotDisponibleDto[];
}

export default function CitaForm({
  onSubmit,
  loading = false,
  slotsDisponibles = [],
}: CitaFormProps) {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [nombrePaciente, setNombrePaciente] = useState('');

  const [form, setForm] = useState<Omit<CreateCitaRequestDto, 'fechaHora'>>({
    pacienteId: 0,
    profesionalId: 0,
    tipoAtencion: '',
    motivoConsulta: '',
  });

  const { data: pacientesEncontrados, isLoading: pacientesLoading } =
    usePacientesPorNombre(nombrePaciente);

  const pacienteSeleccionado = useMemo(() => {
    return pacientesEncontrados?.find((p) => p.id === form.pacienteId);
  }, [pacientesEncontrados, form.pacienteId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.pacienteId) {
      alert('Debes seleccionar un paciente.');
      return;
    }

    const fechaHora = `${fecha}T${hora}:00`;

    await onSubmit({
      ...form,
      fechaHora,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Buscar paciente por nombre
          </label>

          <input
            type="text"
            placeholder="Escribe el nombre del paciente"
            value={nombrePaciente}
            onChange={(e) => {
              setNombrePaciente(e.target.value);
              setForm((prev) => ({ ...prev, pacienteId: 0 }));
            }}
            className="w-full rounded-lg border px-3 py-2"
          />

          {pacientesLoading && (
            <p className="mt-2 text-sm text-gray-500">Buscando pacientes...</p>
          )}

          {!pacientesLoading &&
            nombrePaciente.trim().length > 0 &&
            pacientesEncontrados &&
            pacientesEncontrados.length > 0 && (
              <div className="mt-2 rounded-lg border bg-white">
                {pacientesEncontrados.map((paciente) => (
                  <button
                    key={paciente.id}
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, pacienteId: paciente.id }));
                      setNombrePaciente(paciente.nombreCompleto);
                    }}
                    className="block w-full border-b px-3 py-2 text-left hover:bg-blue-50 last:border-b-0"
                  >
                    <div className="font-medium">{paciente.nombreCompleto}</div>
                    <div className="text-sm text-gray-500">
                      Documento: {paciente.documento} · Email: {paciente.email}
                    </div>
                  </button>
                ))}
              </div>
            )}

          {pacienteSeleccionado && (
            <div className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              Paciente seleccionado: <strong>{pacienteSeleccionado.nombreCompleto}</strong>
            </div>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            ID profesional
          </label>
          <input
            type="number"
            placeholder="ID profesional"
            value={form.profesionalId || ''}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, profesionalId: Number(e.target.value) }))
            }
            className="w-full rounded-lg border px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Tipo de atención
          </label>
          <input
            type="text"
            placeholder="Tipo de atención"
            value={form.tipoAtencion}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, tipoAtencion: e.target.value }))
            }
            className="w-full rounded-lg border px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Fecha
          </label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Hora
          </label>
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
            required
          />
        </div>
      </div>

      {slotsDisponibles.length > 0 && (
        <div className="rounded-lg border bg-gray-50 p-4">
          <h3 className="mb-2 font-semibold">Slots disponibles</h3>
          <div className="flex flex-wrap gap-2">
            {slotsDisponibles.map((slot) => (
              <button
                key={slot.fechaHora}
                type="button"
                onClick={() => {
                  const [slotFecha, slotHoraCompleta] = slot.fechaHora.split('T');
                  setFecha(slotFecha);
                  setHora(slotHoraCompleta.slice(0, 5));
                }}
                className="rounded-lg border px-3 py-1 text-sm hover:bg-blue-50"
              >
                {slot.horaFormateada}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Motivo de consulta
        </label>
        <textarea
          placeholder="Motivo de consulta"
          value={form.motivoConsulta}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, motivoConsulta: e.target.value }))
          }
          className="w-full rounded-lg border px-3 py-2"
          rows={4}
        />
      </div>

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