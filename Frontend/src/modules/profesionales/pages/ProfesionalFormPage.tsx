import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import InlineMessage from '../../../components/common/InlineMessage';
import { APP_ROUTES } from '../../../app/router/routes';
import ProfesionalForm from '../components/ProfesionalForm';
import { useCreateProfesional } from '../hooks/useprofesionales';
import { useCreateUsuario } from '../../usuarios/hooks/useUsuarios';
import type { CrearProfesionalDto } from '../types/profesional.types';

type TipoPersonal = 'MEDICO' | 'TERAPISTA' | 'AGENDADOR';

const TIPO_CARDS: { value: TipoPersonal; label: string; desc: string; icon: string }[] = [
  {
    value: 'MEDICO',
    label: 'Médico',
    desc: 'Tiene agenda propia, franjas horarias e intervalo de atención.',
    icon: '🩺',
  },
  {
    value: 'TERAPISTA',
    label: 'Terapista',
    desc: 'Agenda de terapias con franjas e intervalo configurables.',
    icon: '🤲',
  },
  {
    value: 'AGENDADOR',
    label: 'Agendador',
    desc: 'Gestiona citas y pacientes. No tiene agenda propia.',
    icon: '📋',
  },
];

export default function ProfesionalFormPage() {
  const navigate = useNavigate();
  const createProfesionalMutation = useCreateProfesional();
  const createUsuarioMutation = useCreateUsuario();

  const [tipoPersonal, setTipoPersonal] = useState<TipoPersonal | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [agendador, setAgendador] = useState({
    nombreCompleto: '',
    email: '',
    nombreUsuario: '',
    contrasena: '',
  });

  /* ── submit profesional (médico / terapista) ───────── */

  const handleSubmitProfesional = async (values: CrearProfesionalDto) => {
    setErrorMessage('');
    await createProfesionalMutation.mutateAsync(values);
    navigate(APP_ROUTES.PROFESIONALES, {
      state: { successMessage: 'Profesional registrado correctamente.' },
    });
  };

  /* ── submit agendador ──────────────────────────────── */

  const handleSubmitAgendador = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const { nombreCompleto, email, nombreUsuario, contrasena } = agendador;
    if (!nombreCompleto.trim() || !email.trim() || !nombreUsuario.trim() || !contrasena.trim()) {
      setErrorMessage('Todos los campos son obligatorios.');
      return;
    }
    try {
      await createUsuarioMutation.mutateAsync({
        nombreCompleto: nombreCompleto.trim(),
        email: email.trim(),
        nombreUsuario: nombreUsuario.trim(),
        contrasena: contrasena.trim(),
        rol: 'AGENDADOR',
      });
      navigate(APP_ROUTES.PROFESIONALES, {
        state: { successMessage: 'Agendador creado correctamente.' },
      });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'No fue posible crear el agendador.';
      setErrorMessage(msg);
    }
  };

  const tipoSeleccionado = TIPO_CARDS.find((c) => c.value === tipoPersonal);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <PageHeader
        title="Nuevo personal"
        subtitle="Elige el tipo de rol antes de completar el formulario."
      />

      {errorMessage && (
        <div className="mb-4">
          <InlineMessage type="error" message={errorMessage} />
        </div>
      )}

      {/* Selector de tipo — siempre visible */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3 max-w-3xl">
        {TIPO_CARDS.map((card) => (
          <button
            key={card.value}
            type="button"
            onClick={() => {
              setTipoPersonal(card.value);
              setErrorMessage('');
            }}
            className={`rounded-xl border-2 p-5 text-left transition-all ${
              tipoPersonal === card.value
                ? 'border-blue-600 bg-blue-50 shadow-md'
                : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
            }`}
          >
            <span className="text-2xl">{card.icon}</span>
            <p
              className={`mt-2 font-semibold ${
                tipoPersonal === card.value ? 'text-blue-700' : 'text-slate-800'
              }`}
            >
              {card.label}
            </p>
            <p className="mt-1 text-xs text-slate-500">{card.desc}</p>
          </button>
        ))}
      </div>

      {/* Formulario según tipo seleccionado */}
      {tipoPersonal && (tipoPersonal === 'MEDICO' || tipoPersonal === 'TERAPISTA') && (
        <div className="max-w-xl">
          <p className="mb-4 text-sm font-medium text-slate-600">
            {tipoSeleccionado?.icon} Registrando:{' '}
            <span className="font-semibold text-slate-800">{tipoSeleccionado?.label}</span>
          </p>
          <ProfesionalForm
            tipoFijo={tipoPersonal}
            onSubmit={handleSubmitProfesional}
            loading={createProfesionalMutation.isPending}
          />
        </div>
      )}

      {tipoPersonal === 'AGENDADOR' && (
        <form
          onSubmit={handleSubmitAgendador}
          className="max-w-xl space-y-4 rounded-xl bg-white p-4 shadow sm:p-6"
        >
          <p className="text-sm text-slate-600">
            📋 El agendador podrá iniciar sesión y gestionar citas y pacientes, pero no
            tendrá agenda propia ni franjas horarias.
          </p>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Nombre completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ej: Ana Gómez"
              value={agendador.nombreCompleto}
              onChange={(e) => setAgendador((p) => ({ ...p, nombreCompleto: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Correo electrónico <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="correo@piedrazul.com"
              value={agendador.email}
              onChange={(e) => setAgendador((p) => ({ ...p, email: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Nombre de usuario <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ej: ana.gomez"
              value={agendador.nombreUsuario}
              onChange={(e) => setAgendador((p) => ({ ...p, nombreUsuario: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={agendador.contrasena}
              onChange={(e) => setAgendador((p) => ({ ...p, contrasena: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <button
            type="submit"
            disabled={createUsuarioMutation.isPending}
            className="w-full rounded-lg bg-blue-600 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {createUsuarioMutation.isPending ? 'Creando agendador...' : 'Crear agendador'}
          </button>
        </form>
      )}
    </div>
  );
}
