import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import InlineMessage from '../../../components/common/InlineMessage';
import { APP_ROUTES } from '../../../app/router/routes';
import { ESPECIALIDAD_OPTIONS, GENERO_PACIENTE_OPTIONS, TIPO_ATENCION_OPTIONS } from '../../../constants/enums';
import { useProfesionalesActivos } from '../../profesionales/hooks/useprofesionales';
import { useDisponibilidad } from '../hooks/UseDisponibilidad';
import { useAgendarDesdeContacto } from '../hooks/UseCitas';
import { useSugerenciasDocumento } from '../../pacientes/hooks/usePacientes';
import type { AgendarContactoRequestDto, PacienteContactoDto } from '../types/cita.types';

export default function AgendarContactoPage() {
  const navigate = useNavigate();
  const { data: profesionales } = useProfesionalesActivos();
  const agendarMutation = useAgendarDesdeContacto();

  const [docPrefijo, setDocPrefijo] = useState('');
  const { data: sugerencias } = useSugerenciasDocumento(docPrefijo);

  const [paciente, setPaciente] = useState<PacienteContactoDto>({
    documento: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    genero: 'OTRO',
    fechaNacimiento: '',
    email: '',
  });

  const [especialidad, setEspecialidad] = useState('');
  const [profesionalId, setProfesionalId] = useState(0);
  const [fecha, setFecha] = useState('');
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [horaManual, setHoraManual] = useState('');
  const [tipoAtencion, setTipoAtencion] = useState('');
  const [motivoConsulta, setMotivoConsulta] = useState('');
  const [message, setMessage] = useState('');

  const { data: slots, isLoading: slotsLoading } = useDisponibilidad(
    profesionalId || undefined,
    fecha || undefined
  );

  const profesionalesFiltrados = Array.isArray(profesionales)
    ? profesionales.filter((p) =>
        especialidad ? p.especialidad === especialidad : true
      )
    : [];

  const aplicarSugerencia = (s: {
    documento: string;
    nombres: string;
    apellidos: string;
    telefono: string;
    email?: string;
  }) => {
    setPaciente((prev) => ({
      ...prev,
      documento: s.documento,
      nombres: s.nombres,
      apellidos: s.apellidos,
      telefono: s.telefono,
      email: s.email ?? prev.email,
    }));
    setDocPrefijo('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!profesionalId || !fecha || !tipoAtencion) {
      setMessage('Completa profesional, fecha y tipo de atención.');
      return;
    }

    let fechaHoraFinal = '';
    if (horaSeleccionada) fechaHoraFinal = horaSeleccionada;
    else if (horaManual) fechaHoraFinal = `${fecha}T${horaManual}:00`;
    else {
      setMessage('Selecciona un horario o indica hora manual.');
      return;
    }

    const body: AgendarContactoRequestDto = {
      paciente: {
        documento: paciente.documento.trim(),
        nombres: paciente.nombres.trim(),
        apellidos: paciente.apellidos.trim(),
        telefono: paciente.telefono.trim(),
        genero: paciente.genero,
        ...(paciente.fechaNacimiento
          ? { fechaNacimiento: paciente.fechaNacimiento }
          : {}),
        ...(paciente.email?.trim() ? { email: paciente.email.trim() } : {}),
      },
      profesionalId,
      fechaHora: fechaHoraFinal,
      tipoAtencion,
      motivoConsulta: motivoConsulta.trim() || undefined,
    };

    try {
      await agendarMutation.mutateAsync(body);
      navigate(APP_ROUTES.CITAS, {
        state: { successMessage: 'Cita registrada desde contacto (alta / actualización de paciente).' },
      });
    } catch {
      setMessage('No fue posible agendar. Revisa datos, disponibilidad y ventana de fechas.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <PageHeader
        title="Agendar desde contacto"
        subtitle="Alta rápida tipo WhatsApp: datos del paciente y cita en un solo paso."
      />

      {message && (
        <div className="mb-4 max-w-4xl">
          <InlineMessage type="error" message={message} />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl space-y-6 rounded-2xl bg-white p-4 shadow-sm sm:p-6"
      >
        <section>
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Paciente</h3>
          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Buscar por documento (autocompletar)
            </label>
            <input
              value={docPrefijo}
              onChange={(e) => setDocPrefijo(e.target.value)}
              placeholder="Escribe al menos 2 dígitos/letras"
              className="w-full max-w-md rounded-lg border px-3 py-2"
            />
            {sugerencias && sugerencias.length > 0 && (
              <div className="mt-2 max-w-md rounded-lg border border-slate-200 bg-slate-50">
                {sugerencias.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => aplicarSugerencia(s)}
                    className="block w-full border-b border-slate-100 px-3 py-2 text-left text-sm last:border-0 hover:bg-blue-50"
                  >
                    {s.documento} — {s.nombreCompleto}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              required
              placeholder="Documento"
              value={paciente.documento}
              onChange={(e) =>
                setPaciente((p) => ({ ...p, documento: e.target.value }))
              }
              className="rounded-lg border px-3 py-2"
            />
            <input
              required
              placeholder="Nombres"
              value={paciente.nombres}
              onChange={(e) =>
                setPaciente((p) => ({ ...p, nombres: e.target.value }))
              }
              className="rounded-lg border px-3 py-2"
            />
            <input
              required
              placeholder="Apellidos"
              value={paciente.apellidos}
              onChange={(e) =>
                setPaciente((p) => ({ ...p, apellidos: e.target.value }))
              }
              className="rounded-lg border px-3 py-2"
            />
            <input
              required
              placeholder="Teléfono"
              value={paciente.telefono}
              onChange={(e) =>
                setPaciente((p) => ({ ...p, telefono: e.target.value }))
              }
              className="rounded-lg border px-3 py-2"
            />
            <select
              required
              value={paciente.genero}
              onChange={(e) =>
                setPaciente((p) => ({
                  ...p,
                  genero: e.target.value as PacienteContactoDto['genero'],
                }))
              }
              className="rounded-lg border px-3 py-2"
            >
              {GENERO_PACIENTE_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            <input
              type="date"
              placeholder="Nacimiento"
              value={paciente.fechaNacimiento ?? ''}
              onChange={(e) =>
                setPaciente((p) => ({ ...p, fechaNacimiento: e.target.value }))
              }
              className="rounded-lg border px-3 py-2"
            />
            <input
              type="email"
              placeholder="Email (opcional)"
              value={paciente.email ?? ''}
              onChange={(e) =>
                setPaciente((p) => ({ ...p, email: e.target.value }))
              }
              className="rounded-lg border px-3 py-2 md:col-span-2"
            />
          </div>
        </section>

        <section className="border-t border-slate-100 pt-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Cita</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs text-slate-600">Especialidad</label>
              <select
                value={especialidad}
                onChange={(e) => {
                  setEspecialidad(e.target.value);
                  setProfesionalId(0);
                  setHoraSeleccionada('');
                  setHoraManual('');
                }}
                className="w-full rounded-lg border px-3 py-2"
              >
                <option value="">Todas</option>
                {ESPECIALIDAD_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs text-slate-600">Profesional</label>
              <select
                value={profesionalId ? String(profesionalId) : ''}
                onChange={(e) => {
                  setProfesionalId(e.target.value ? Number(e.target.value) : 0);
                  setHoraSeleccionada('');
                  setHoraManual('');
                }}
                className="w-full rounded-lg border px-3 py-2"
                required
              >
                <option value="">Selecciona</option>
                {profesionalesFiltrados.map((p) => (
                  <option key={p.profesionalId} value={p.profesionalId}>
                    {p.nombres}
                    {p.especialidad ? ` — ${p.especialidad}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-600">Fecha</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => {
                  setFecha(e.target.value);
                  setHoraSeleccionada('');
                  setHoraManual('');
                }}
                className="w-full rounded-lg border px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-600">Tipo de atención</label>
              <select
                value={tipoAtencion}
                onChange={(e) => setTipoAtencion(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
                required
              >
                <option value="">Selecciona</option>
                {TIPO_ATENCION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3">
            <label className="mb-1 block text-xs text-slate-600">Horarios</label>
            {!profesionalId || !fecha ? (
              <p className="text-sm text-slate-500">Elige profesional y fecha.</p>
            ) : slotsLoading ? (
              <p className="text-sm text-slate-500">Cargando horarios...</p>
            ) : Array.isArray(slots) && slots.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot.fechaHora}
                    type="button"
                    onClick={() => {
                      setHoraSeleccionada(slot.fechaHora);
                      setHoraManual('');
                    }}
                    className={`rounded-lg px-3 py-2 text-sm ${
                      horaSeleccionada === slot.fechaHora
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-300 bg-white'
                    }`}
                  >
                    {slot.horaFormateada}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">Sin slots; usa hora manual.</p>
            )}
          </div>
          <div className="mt-3 max-w-xs">
            <label className="mb-1 block text-xs text-slate-600">Hora manual</label>
            <input
              type="time"
              value={horaManual}
              onChange={(e) => {
                setHoraManual(e.target.value);
                setHoraSeleccionada('');
              }}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div className="mt-3">
            <label className="mb-1 block text-xs text-slate-600">Motivo (opcional)</label>
            <textarea
              value={motivoConsulta}
              onChange={(e) => setMotivoConsulta(e.target.value)}
              rows={2}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
        </section>

        <button
          type="submit"
          disabled={agendarMutation.isPending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
        >
          {agendarMutation.isPending ? 'Guardando...' : 'Registrar cita'}
        </button>
      </form>
    </div>
  );
}
