import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import InlineMessage from '../../../components/common/InlineMessage';
import Loader from '../../../components/common/Loader';
import { APP_ROUTES } from '../../../app/router/routes';
import { GENERO_PACIENTE_OPTIONS } from '../../../constants/enums';
import { useCompletarMiPerfil, useMiPerfilPaciente } from '../hooks/usePacientes';
import type { CompletarPerfilPacienteDto, GeneroPaciente } from '../types/paciente.types';

export default function PacienteCompletarPerfilPage() {
  const { data: perfil, isLoading, isError } = useMiPerfilPaciente();
  const completarMutation = useCompletarMiPerfil();
  const [errorMessage, setErrorMessage] = useState('');

  const [form, setForm] = useState<CompletarPerfilPacienteDto>({
    documento: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    genero: 'OTRO',
    fechaNacimiento: '',
    email: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const payload: CompletarPerfilPacienteDto = {
        documento: form.documento.trim(),
        nombres: form.nombres.trim(),
        apellidos: form.apellidos.trim(),
        telefono: form.telefono.trim(),
        genero: form.genero as GeneroPaciente,
        ...(form.fechaNacimiento ? { fechaNacimiento: form.fechaNacimiento } : {}),
        ...(form.email?.trim() ? { email: form.email.trim() } : {}),
      };
      await completarMutation.mutateAsync(payload);
    } catch {
      setErrorMessage('No fue posible guardar tu ficha. Verifica los datos.');
    }
  };

  if (isLoading) {
    return <Loader message="Cargando tu información..." />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <InlineMessage
          type="error"
          message="No fue posible consultar tu ficha. Intenta iniciar sesión de nuevo."
        />
      </div>
    );
  }

  if (perfil) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <PageHeader
          title="Mi ficha"
          subtitle="Tu perfil de paciente ya está registrado en el sistema."
        />
        <div className="max-w-xl rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-slate-700">
            <strong>{perfil.nombreCompleto}</strong> · Documento {perfil.documento}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Teléfono: {perfil.telefono} · Email: {perfil.email}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={APP_ROUTES.PACIENTE_AGENDAR}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
              Agendar cita
            </Link>
            <Link
              to={APP_ROUTES.PACIENTE_MIS_CITAS}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700"
            >
              Mis citas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title="Completar mi ficha"
        subtitle="Datos mínimos para vincular tu cuenta como paciente y poder agendar."
      />

      {errorMessage && (
        <div className="mb-4 max-w-xl">
          <InlineMessage type="error" message={errorMessage} />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-xl space-y-4 rounded-2xl bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Documento
            </label>
            <input
              required
              value={form.documento}
              onChange={(e) => setForm((p) => ({ ...p, documento: e.target.value }))}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Nombres
            </label>
            <input
              required
              value={form.nombres}
              onChange={(e) => setForm((p) => ({ ...p, nombres: e.target.value }))}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Apellidos
            </label>
            <input
              required
              value={form.apellidos}
              onChange={(e) => setForm((p) => ({ ...p, apellidos: e.target.value }))}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Celular
            </label>
            <input
              required
              value={form.telefono}
              onChange={(e) => setForm((p) => ({ ...p, telefono: e.target.value }))}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Género
            </label>
            <select
              required
              value={form.genero}
              onChange={(e) =>
                setForm((p) => ({ ...p, genero: e.target.value as GeneroPaciente }))
              }
              className="w-full rounded-lg border px-3 py-2"
            >
              {GENERO_PACIENTE_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Fecha de nacimiento (opcional)
            </label>
            <input
              type="date"
              value={form.fechaNacimiento ?? ''}
              onChange={(e) =>
                setForm((p) => ({ ...p, fechaNacimiento: e.target.value }))
              }
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email de contacto (opcional)
            </label>
            <input
              type="email"
              value={form.email ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={completarMutation.isPending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
        >
          {completarMutation.isPending ? 'Guardando...' : 'Guardar ficha'}
        </button>
      </form>
    </div>
  );
}
