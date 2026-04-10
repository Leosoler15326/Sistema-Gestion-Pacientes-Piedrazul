import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import InlineMessage from '../../../components/common/InlineMessage';
import Loader from '../../../components/common/Loader';
import { APP_ROUTES } from '../../../app/router/routes';
import { ESPECIALIDAD_OPTIONS, TIPO_ATENCION_OPTIONS } from '../../../constants/enums';
import { useMiPerfilPaciente } from '../hooks/usePacientes';
import { useProfesionalesActivos } from '../../profesionales/hooks/useprofesionales';
import { useDisponibilidad } from '../../citas/hooks/UseDisponibilidad';
import { useCreateCita } from '../../citas/hooks/UseCitas';

export default function PacienteAgendarCitaPage() {
  const navigate = useNavigate();
  const { data: perfil, isLoading: perfilLoading } = useMiPerfilPaciente();
  const { data: profesionales } = useProfesionalesActivos();
  const createMutation = useCreateCita();

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!perfil?.id) {
      setMessage('No se encontró tu ficha de paciente.');
      return;
    }
    if (!profesionalId) {
      setMessage('Selecciona un profesional.');
      return;
    }
    if (!fecha) {
      setMessage('Selecciona una fecha.');
      return;
    }
    if (!tipoAtencion) {
      setMessage('Selecciona el tipo de atención.');
      return;
    }

    let fechaHoraFinal = '';
    if (horaSeleccionada) {
      fechaHoraFinal = horaSeleccionada;
    } else if (horaManual) {
      fechaHoraFinal = `${fecha}T${horaManual}:00`;
    } else {
      setMessage('Elige un horario disponible o indica una hora manual.');
      return;
    }

    try {
      await createMutation.mutateAsync({
        pacienteId: perfil.id,
        profesionalId,
        fechaHora: fechaHoraFinal,
        tipoAtencion,
        motivoConsulta: motivoConsulta.trim() || undefined,
      });
      navigate(APP_ROUTES.PACIENTE_MIS_CITAS, {
        state: { successMessage: 'Cita agendada correctamente.' },
      });
    } catch {
      setMessage('No fue posible agendar. Verifica disponibilidad y ventana de fechas.');
    }
  };

  if (perfilLoading) {
    return <Loader message="Cargando tu perfil..." />;
  }

  if (perfil === null) {
    return <Navigate to={APP_ROUTES.PACIENTE_COMPLETAR_PERFIL} replace />;
  }

  if (!perfil) {
    return <Loader message="Cargando tu perfil..." />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title="Agendar cita"
        subtitle="Elige especialidad, profesional y horario según disponibilidad."
      />

      {message && (
        <div className="mb-4 max-w-3xl">
          <InlineMessage type="error" message={message} />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl space-y-5 rounded-2xl bg-white p-6 shadow-sm"
      >
        <p className="text-sm text-slate-600">
          Paciente: <strong>{perfil.nombreCompleto}</strong>
        </p>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Especialidad
          </label>
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

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Profesional
          </label>
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
          <label className="mb-1 block text-sm font-medium text-slate-700">Fecha</label>
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
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Tipo de atención
          </label>
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

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Horarios sugeridos
          </label>
          {!profesionalId || !fecha ? (
            <p className="text-sm text-slate-500">Elige profesional y fecha.</p>
          ) : slotsLoading ? (
            <p className="text-sm text-slate-500">Cargando...</p>
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
            <p className="text-sm text-slate-500">
              No hay slots para esta fecha. Usa hora manual si aplica.
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Hora manual</label>
          <input
            type="time"
            value={horaManual}
            onChange={(e) => {
              setHoraManual(e.target.value);
              setHoraSeleccionada('');
            }}
            className="w-full rounded-lg border px-3 py-2 md:max-w-xs"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Motivo (opcional)
          </label>
          <textarea
            value={motivoConsulta}
            onChange={(e) => setMotivoConsulta(e.target.value)}
            rows={3}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
          >
            {createMutation.isPending ? 'Agendando...' : 'Confirmar cita'}
          </button>
          <Link
            to={APP_ROUTES.PACIENTE_MIS_CITAS}
            className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700"
          >
            Ver mis citas
          </Link>
        </div>
      </form>
    </div>
  );
}
