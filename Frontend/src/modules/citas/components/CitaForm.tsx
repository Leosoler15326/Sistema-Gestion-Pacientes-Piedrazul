import { useEffect, useMemo, useState, type FormEvent } from 'react';
import api from '../../../services/api';
import { useAuth } from '../../auth/hooks/useAuth';
import {
  usePacientesPorNombre,
  useCreatePaciente,
} from '../../pacientes/hooks/usePacientes';
import { useProfesionalesActivos } from '../../profesionales/hooks/useprofesionales';
import { useDisponibilidad } from '../hooks/UseDisponibilidad';
import type { CreateCitaRequestDto } from '../types/cita.types';
import type {
  CrearPacienteDto,
  PacienteDto,
} from '../../pacientes/types/paciente.types';
import { ESPECIALIDAD_OPTIONS, TIPO_ATENCION_OPTIONS } from '../../../constants/enums';

interface CitaFormProps {
  onSubmit: (values: CreateCitaRequestDto) => Promise<void>;
  loading?: boolean;
  initialPacienteId?: number;
  initialPacienteNombre?: string;
}

type ProfesionalPerfilDto = {
  profesionalId?: number;
  id?: number;
  nombres?: string;
  nombre?: string;
  especialidad?: string;
};

export default function CitaForm({
  onSubmit,
  loading = false,
  initialPacienteId,
  initialPacienteNombre,
}: CitaFormProps) {
  const { user } = useAuth();
  const normalizedRole = String(user?.rol ?? '').toUpperCase().replace('ROLE_', '');
  const esProfesional = normalizedRole === 'MEDICO_TERAPISTA';

  const [fecha, setFecha] = useState('');
  const [horaManual, setHoraManual] = useState('');
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [nombrePaciente, setNombrePaciente] = useState(initialPacienteNombre ?? '');
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState('');
  const [message, setMessage] = useState('');
  const [showCreatePaciente, setShowCreatePaciente] = useState(false);
  const [perfilLoading, setPerfilLoading] = useState(false);
  const [profesionalActualNombre, setProfesionalActualNombre] = useState('');
  const [perfilError, setPerfilError] = useState('');


  const [form, setForm] = useState<Omit<CreateCitaRequestDto, 'fechaHora'>>({
    pacienteId: initialPacienteId ?? 0,
    profesionalId: 0,
    tipoAtencion: '',
    motivoConsulta: '',
  });

  const [nuevoPaciente, setNuevoPaciente] = useState<CrearPacienteDto>({
    nombres: '',
    apellidos: '',
    documento: '',
    email: '',
    telefono: '',
  });

  const {
    data: pacientes,
    isLoading: pacientesLoading,
  } = usePacientesPorNombre(nombrePaciente);


  const { data: profesionales } = useProfesionalesActivos();
  const createPacienteMutation = useCreatePaciente();


  useEffect(() => {
    let cancelled = false;

    const cargarPerfilProfesional = async () => {
      if (!esProfesional || !user?.id) return;

      try {
        setPerfilLoading(true);
        setPerfilError('');

        let data: ProfesionalPerfilDto;

        try {
          const response = await api.get<ProfesionalPerfilDto>('/profesionales/mi-perfil');
          data = response.data;
        } catch {
          const response = await api.get<ProfesionalPerfilDto>(
            `/profesionales/usuario/${user.id}`
          );
          data = response.data;
        }

        if (cancelled) return;

        const profesionalId = Number(data.profesionalId ?? data.id ?? 0);

        setForm((prev) => ({
          ...prev,
          profesionalId,
        }));

        setProfesionalActualNombre(data.nombres ?? data.nombre ?? user.nombreCompleto ?? '');
        setEspecialidadSeleccionada(data.especialidad ?? '');
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setPerfilError('No fue posible cargar el profesional autenticado.');
        }
      } finally {
        if (!cancelled) {
          setPerfilLoading(false);
        }
      }
    };

    cargarPerfilProfesional();

    return () => {
      cancelled = true;
    };
  }, [esProfesional, user?.id, user?.nombreCompleto]);


    useEffect(() => {
    if (initialPacienteId) {
      setForm((prev) => ({
        ...prev,
        pacienteId: initialPacienteId,
      }));
    }

    if (initialPacienteNombre) {
      setNombrePaciente(initialPacienteNombre);
    }
  }, [initialPacienteId, initialPacienteNombre]);
   const profesionalesFiltrados = Array.isArray(profesionales)
    ? profesionales.filter((p: ProfesionalPerfilDto) =>
        especialidadSeleccionada ? p.especialidad === especialidadSeleccionada : true
      )
    : [];

  const { data: slots, isLoading: slotsLoading } = useDisponibilidad(
    form.profesionalId || undefined,
    fecha || undefined
  );

  const pacienteSeleccionado = useMemo(() => {
    if (initialPacienteId && initialPacienteNombre) {
      return {
        id: initialPacienteId,
        nombreCompleto: initialPacienteNombre,
      };
    }

    return pacientes?.find((p) => p.id === form.pacienteId);
  }, [pacientes, form.pacienteId, initialPacienteId, initialPacienteNombre]);

  const handleCrearPaciente = async () => {
    try {
      setMessage('');

      if (
        !nuevoPaciente.nombres.trim() ||
        !nuevoPaciente.apellidos.trim() ||
        !nuevoPaciente.documento.trim() ||
        !nuevoPaciente.email.trim() ||
        !nuevoPaciente.telefono.trim()
      ) {
        setMessage('Completa todos los campos del nuevo paciente.');
        return;
      }

      const pacienteCreado = (await createPacienteMutation.mutateAsync(
        nuevoPaciente
      )) as PacienteDto;

      setForm((prev) => ({
        ...prev,
        pacienteId: pacienteCreado.id,
      }));

      setNombrePaciente(pacienteCreado.nombreCompleto);
      setShowCreatePaciente(false);
      setNuevoPaciente({
        nombres: '',
        apellidos: '',
        documento: '',
        email: '',
        telefono: '',
      });
      setMessage('Paciente creado y seleccionado correctamente.');
    } catch (error) {
      console.error(error);
      setMessage('No fue posible crear el paciente.');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    if (!form.pacienteId) {
      setMessage('Debes seleccionar un paciente.');
      return;
    }

    if (!form.profesionalId) {
      setMessage(
        esProfesional
          ? 'No fue posible identificar el profesional autenticado.'
          : 'Debes seleccionar un profesional.'
      );
      return;
    }

    if (!fecha) {
      setMessage('Debes seleccionar una fecha.');
      return;
    }

    if (!form.tipoAtencion) {
      setMessage('Debes seleccionar el tipo de atención.');
      return;
    }

    let fechaHoraFinal = '';

    if (horaSeleccionada) {
      fechaHoraFinal = horaSeleccionada;
    } else {
      if (!horaManual) {
        setMessage('Debes seleccionar un horario disponible o escribir una hora manual.');
        return;
      }

      fechaHoraFinal = `${fecha}T${horaManual}:00`;
    }

    try {
      await onSubmit({
        ...form,
        fechaHora: fechaHoraFinal,
      });
    } catch (error) {
      console.error(error);
      setMessage('No fue posible agendar la cita.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl bg-white p-4 shadow sm:p-6-sm"
    >
      {(message || perfilError) && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            (message || perfilError).includes('correctamente')
              ? 'border-green-200 bg-green-50 text-green-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {perfilError || message}
        </div>
      )}

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm font-medium text-slate-700">
            Buscar paciente por nombre
          </label>

          {!initialPacienteId && (
            <button
              type="button"
              onClick={() => {
                setShowCreatePaciente((prev) => !prev);
                setMessage('');
              }}
              className="rounded-lg border border-blue-200 px-3 py-1 text-sm text-blue-700 hover:bg-blue-50"
            >
              {showCreatePaciente ? 'Cancelar nuevo paciente' : 'Crear nuevo paciente'}
            </button>
          )}
        </div>

        <input
          type="text"
          placeholder="Escribe el nombre del paciente"
          value={nombrePaciente}
          onChange={(e) => {
            setNombrePaciente(e.target.value);
            setForm((prev) => ({ ...prev, pacienteId: 0 }));
            setMessage('');
          }}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          disabled={Boolean(initialPacienteId)}
        />

        {pacientesLoading && (
          <p className="mt-2 text-sm text-slate-500">Buscando pacientes...</p>
        )}

        {!pacientesLoading &&
          nombrePaciente.trim().length > 0 &&
          pacientes &&
          pacientes.length > 0 && (
            <div className="mt-2 rounded-xl border border-slate-200 bg-white shadow-sm">
              {pacientes.map((paciente) => (
                <button
                  key={paciente.id}
                  type="button"
                  onClick={() => {
                    setForm((prev) => ({ ...prev, pacienteId: paciente.id }));
                    setNombrePaciente(paciente.nombreCompleto);
                    setMessage('');
                  }}
                  className="block w-full border-b border-slate-100 px-4 py-3 text-left hover:bg-blue-50 last:border-b-0"
                >
                  <div className="font-medium text-slate-800">
                    {paciente.nombreCompleto}
                  </div>
                  <div className="text-sm text-slate-500">
                    Documento: {paciente.documento} · Email: {paciente.email}
                  </div>
                </button>
              ))}
            </div>
          )}

        {pacienteSeleccionado && (
          <div className="mt-3 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            Paciente seleccionado: <strong>{pacienteSeleccionado.nombreCompleto}</strong>
          </div>
        )}
      </div>

      {showCreatePaciente && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="mb-4 text-base font-semibold text-slate-800">Nuevo paciente</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Nombres"
              value={nuevoPaciente.nombres}
              onChange={(e) =>
                setNuevoPaciente((prev) => ({ ...prev, nombres: e.target.value }))
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-3"
            />

            <input
              type="text"
              placeholder="Apellidos"
              value={nuevoPaciente.apellidos}
              onChange={(e) =>
                setNuevoPaciente((prev) => ({ ...prev, apellidos: e.target.value }))
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-3"
            />

            <input
              type="text"
              placeholder="Documento"
              value={nuevoPaciente.documento}
              onChange={(e) =>
                setNuevoPaciente((prev) => ({ ...prev, documento: e.target.value }))
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-3"
            />

            <input
              type="email"
              placeholder="Email"
              value={nuevoPaciente.email}
              onChange={(e) =>
                setNuevoPaciente((prev) => ({ ...prev, email: e.target.value }))
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-3"
            />

            <input
              type="text"
              placeholder="Teléfono"
              value={nuevoPaciente.telefono}
              onChange={(e) =>
                setNuevoPaciente((prev) => ({ ...prev, telefono: e.target.value }))
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 md:col-span-2"
            />
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={handleCrearPaciente}
              disabled={createPacienteMutation.isPending}
              className="rounded-xl bg-emerald-600 px-4 py-2.5 font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {createPacienteMutation.isPending ? 'Creando paciente...' : 'Guardar paciente'}
            </button>
          </div>
        </div>
      )}

      {!esProfesional && (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Especialidad
          </label>

          <select
            value={especialidadSeleccionada}
            onChange={(e) => {
              setEspecialidadSeleccionada(e.target.value);
              setForm((prev) => ({ ...prev, profesionalId: 0 }));
              setHoraSeleccionada('');
              setHoraManual('');
              setMessage('');
            }}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Todas las especialidades</option>
            {ESPECIALIDAD_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Profesional
        </label>

        {esProfesional ? (
          <div className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-700">
            {perfilLoading
              ? 'Cargando profesional autenticado...'
              : profesionalActualNombre || 'Profesional asignado automáticamente'}
          </div>
        ) : (
          <>
            <select
              value={form.profesionalId ? String(form.profesionalId) : ''}
              onChange={(e) => {
                const selectedValue = e.target.value;

                setForm((prev) => ({
                  ...prev,
                  profesionalId: selectedValue ? Number(selectedValue) : 0,
                }));

                setHoraSeleccionada('');
                setHoraManual('');
                setMessage('');
              }}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Selecciona un profesional</option>

              {profesionalesFiltrados.map((p: ProfesionalPerfilDto) => {
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
              <p className="mt-2 text-sm text-slate-500">
                No hay profesionales disponibles para esta especialidad.
              </p>
            )}
          </>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Fecha</label>

        <input
          type="date"
          value={fecha}
          onChange={(e) => {
            setFecha(e.target.value);
            setHoraSeleccionada('');
            setHoraManual('');
            setMessage('');
          }}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Tipo de atención
        </label>

        <select
          value={form.tipoAtencion}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, tipoAtencion: e.target.value }))
          }
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Horarios disponibles
        </label>

        {!form.profesionalId || !fecha ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            Selecciona profesional y fecha para consultar disponibilidad.
          </div>
        ) : slotsLoading ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            Cargando horarios disponibles...
          </div>
        ) : Array.isArray(slots) && slots.length > 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {slots.map((slot) => (
                <button
                  key={slot.fechaHora}
                  type="button"
                  onClick={() => {
                    setHoraSeleccionada(slot.fechaHora);
                    setHoraManual('');
                    setMessage('');
                  }}
                  className={`rounded-lg px-3 py-2 text-sm ${
                    horaSeleccionada === slot.fechaHora
                      ? 'bg-blue-600 text-white'
                      : 'border border-slate-300 bg-white hover:bg-blue-50'
                  }`}
                >
                  {slot.horaFormateada}
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-500">
              Puedes usar uno de estos horarios o escribir una hora manual más abajo.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            No hay horarios sugeridos para esta fecha. Puedes escribir la hora manualmente.
          </div>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Hora manual
        </label>

        <input
          type="time"
          value={horaManual}
          onChange={(e) => {
            setHoraManual(e.target.value);
            setHoraSeleccionada('');
            setMessage('');
          }}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <p className="mt-2 text-xs text-slate-500">
          Puedes escribir una hora exacta aunque no haya slots disponibles.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Motivo de consulta
        </label>

        <textarea
          placeholder="Motivo de consulta"
          value={form.motivoConsulta}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, motivoConsulta: e.target.value }))
          }
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          rows={4}
        />
      </div>

      <button
        type="submit"
        disabled={loading || (esProfesional && perfilLoading)}
        className="rounded-xl bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? 'Guardando...' : 'Agendar cita'}
      </button>
    </form>
  );
}