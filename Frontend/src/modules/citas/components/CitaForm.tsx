import { useMemo, useState, type FormEvent } from 'react';
import { usePacientesPorNombre } from '../../pacientes/hooks/usePacientes';
import { useProfesionalesActivos } from '../../profesionales/hooks/useprofesionales';
import { useDisponibilidad } from '../hooks/UseDisponibilidad';
import type { CreateCitaRequestDto } from '../types/cita.types';
import { TIPO_ATENCION_OPTIONS } from '../../../constants/enums';
import { ESPECIALIDAD_OPTIONS } from '../../../constants/enums';

interface CitaFormProps {
  onSubmit: (values: CreateCitaRequestDto) => Promise<void>;
  loading?: boolean;
}

export default function CitaForm({
  onSubmit,
  loading = false,
}: CitaFormProps) {
  const [fecha, setFecha] = useState('');
  const [nombrePaciente, setNombrePaciente] = useState('');
  const [message, setMessage] = useState('');
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState('');
 const { data: profesionales } = useProfesionalesActivos();
  const [form, setForm] = useState<Omit<CreateCitaRequestDto, 'fechaHora'>>({
    pacienteId: 0,
    profesionalId: 0,
    tipoAtencion: '',
    motivoConsulta: '',
  });
  
  const [horaSeleccionada, setHoraSeleccionada] = useState('');

  const { data: pacientes, isLoading: pacientesLoading } =
    usePacientesPorNombre(nombrePaciente);

  const profesionalesFiltrados = Array.isArray(profesionales)
  ? profesionales.filter((p: any) =>
      especialidadSeleccionada
        ? p.especialidad === especialidadSeleccionada
        : true
    )
  : [];
  
  const { data: slots, isLoading: slotsLoading } = useDisponibilidad(
    form.profesionalId,
    fecha
  );

  const pacienteSeleccionado = useMemo(() => {
    return pacientes?.find((p) => p.id === form.pacienteId);
  }, [pacientes, form.pacienteId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    if (!form.pacienteId) {
      setMessage('Debes seleccionar un paciente.');
      return;
    }

    if (!form.profesionalId) {
      setMessage('Debes seleccionar un profesional.');
      return;
    }

    if (!fecha) {
      setMessage('Debes seleccionar una fecha.');
      return;
    }

    if (!horaSeleccionada) {
      setMessage('Debes seleccionar un horario disponible.');
      return;
    }

    if (!form.tipoAtencion) {
      setMessage('Debes seleccionar el tipo de atención.');
      return;
    }

    await onSubmit({
      ...form,
      fechaHora: horaSeleccionada,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl bg-white p-6 shadow">
      {message && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {message}
        </div>
      )}

      <div>
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
          pacientes &&
          pacientes.length > 0 && (
            <div className="mt-2 rounded-lg border bg-white">
              {pacientes.map((paciente) => (
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
    Especialidad
  </label>

  <select
    value={especialidadSeleccionada}
    onChange={(e) => {
      setEspecialidadSeleccionada(e.target.value);
      setForm((prev) => ({ ...prev, profesionalId: 0 }));
      setHoraSeleccionada('');
      setMessage('');
    }}
    className="w-full rounded-lg border px-3 py-2"
  >
    <option value="">Todas las especialidades</option>

    {ESPECIALIDAD_OPTIONS.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
</div>

    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Profesional
      </label>

      <select
        value={form.profesionalId ? String(form.profesionalId) : ''}
        onChange={(e) => {
          const selectedValue = e.target.value;

          setForm((prev) => ({
            ...prev,
            profesionalId: selectedValue ? Number(selectedValue) : 0,
          }));

          setHoraSeleccionada('');
          setMessage('');
        }}
        className="w-full rounded-lg border px-3 py-2"
      >
        <option value="">Selecciona un profesional</option>

        {profesionalesFiltrados.map((p: any) => {
          const optionValue = p.profesionalId ?? p.id;
          const optionLabel = `${p.nombres ?? p.nombre ?? 'Profesional'}${
            p.especialidad ? ` - ${p.especialidad}` : ''
          }`;

          return (
            <option key={optionValue} value={String(optionValue)}>
              {optionLabel}
            </option>
          );
        })}
      </select>

      {especialidadSeleccionada && profesionalesFiltrados.length === 0 && (
        <p className="mt-2 text-sm text-gray-500">
          No hay profesionales disponibles para esta especialidad.
        </p>
      )}
    </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Fecha
        </label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => {
            setFecha(e.target.value);
            setHoraSeleccionada('');
          }}
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Tipo de atención
        </label>

        <select
          value={form.tipoAtencion}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, tipoAtencion: e.target.value }))
          }
          className="w-full rounded-lg border px-3 py-2"
          required
        >
          <option value="">Selecciona tipo de atención</option>
          {TIPO_ATENCION_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Horarios disponibles
        </label>

        {!form.profesionalId || !fecha ? (
          <div className="rounded-lg border bg-gray-50 px-4 py-3 text-sm text-gray-500">
            Selecciona profesional y fecha para consultar disponibilidad.
          </div>
        ) : slotsLoading ? (
          <div className="rounded-lg border bg-gray-50 px-4 py-3 text-sm text-gray-500">
            Cargando horarios disponibles...
          </div>
        ) : Array.isArray(slots) && slots.length > 0 ? (
          <div className="flex flex-wrap gap-2 rounded-lg border bg-gray-50 p-4">
            {slots.map((slot) => (
              <button
                key={slot.fechaHora}
                type="button"
                onClick={() => setHoraSeleccionada(slot.fechaHora)}
                className={`rounded-lg px-3 py-2 text-sm ${
                  horaSeleccionada === slot.fechaHora
                    ? 'bg-blue-600 text-white'
                    : 'border bg-white hover:bg-blue-50'
                }`}
              >
                {slot.horaFormateada}
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border bg-gray-50 px-4 py-3 text-sm text-gray-500">
            No hay horarios disponibles para la fecha seleccionada.
          </div>
        )}
      </div>

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