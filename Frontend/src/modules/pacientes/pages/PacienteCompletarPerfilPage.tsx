import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import InlineMessage from '../../../components/common/InlineMessage';
import Loader from '../../../components/common/Loader';
import { APP_ROUTES } from '../../../app/router/routes';
import { GENERO_LABEL } from '../../../constants/enums';
import { useCompletarMiPerfil, useMiPerfilPaciente } from '../hooks/usePacientes';
import type { CompletarPerfilPacienteDto, GeneroPaciente } from '../types/paciente.types';

function normalizarNombre(valor: string): string {
  return valor
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const GENERO_OPTIONS: GeneroPaciente[] = ['HOMBRE', 'MUJER', 'OTRO'];

export default function PacienteCompletarPerfilPage() {
  const { data: perfil, isLoading, isError } = useMiPerfilPaciente();
  const completarMutation = useCompletarMiPerfil();
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<CompletarPerfilPacienteDto>({
    documento: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    genero: 'OTRO',
    fechaNacimiento: '',
    email: '',
  });

  const validar = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.documento.trim()) errors.documento = 'Ingresa tu número de cédula.';
    if (!form.nombres.trim()) errors.nombres = 'Ingresa tus nombres.';
    if (!form.apellidos.trim()) errors.apellidos = 'Ingresa tus apellidos.';
    if (!form.telefono.trim()) errors.telefono = 'Ingresa tu número de celular.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!validar()) return;
    try {
      const payload: CompletarPerfilPacienteDto = {
        documento: form.documento.trim(),
        nombres: normalizarNombre(form.nombres),
        apellidos: normalizarNombre(form.apellidos),
        telefono: form.telefono.trim(),
        genero: form.genero as GeneroPaciente,
        ...(form.fechaNacimiento ? { fechaNacimiento: form.fechaNacimiento } : {}),
        ...(form.email?.trim() ? { email: form.email.trim() } : {}),
      };
      await completarMutation.mutateAsync(payload);
    } catch {
      setErrorMessage('No fue posible guardar tu ficha. Verifica los datos e intenta de nuevo.');
    }
  };

  if (isLoading) {
    return <Loader message="Cargando tu información..." />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <InlineMessage
          type="error"
          message="No fue posible consultar tu ficha. Intenta iniciar sesión de nuevo."
        />
      </div>
    );
  }

  if (perfil) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <PageHeader
          title="Mi ficha"
          subtitle="Tu perfil de paciente ya está registrado."
        />
        <div className="max-w-xl rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-slate-700">
            <strong>{perfil.nombreCompleto}</strong>
          </p>
          <p className="mt-1 text-sm text-slate-500">Cédula: {perfil.documento}</p>
          <p className="mt-1 text-sm text-slate-500">
            Celular: {perfil.telefono}
            {perfil.email ? ` · Correo: ${perfil.email}` : ''}
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
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <PageHeader
        title="Completar mi ficha"
        subtitle="Necesitamos tus datos para poder agendar tus citas."
      />

      {errorMessage && (
        <div className="mb-4 max-w-xl">
          <InlineMessage type="error" message={errorMessage} />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="max-w-xl space-y-4 rounded-2xl bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Número de cédula <span className="text-red-500">*</span>
            </label>
            <input
              required
              inputMode="numeric"
              placeholder="Ej: 1020304050"
              value={form.documento}
              onChange={(e) => {
                setForm((p) => ({ ...p, documento: e.target.value }));
                setFieldErrors((prev) => ({ ...prev, documento: '' }));
              }}
              className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100 ${
                fieldErrors.documento ? 'border-red-400 bg-red-50' : 'border-slate-300 focus:border-blue-500'
              }`}
            />
            {fieldErrors.documento && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.documento}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Nombres <span className="text-red-500">*</span>
            </label>
            <input
              required
              placeholder="Ej: Ana Maria"
              value={form.nombres}
              onChange={(e) => {
                setForm((p) => ({ ...p, nombres: e.target.value }));
                setFieldErrors((prev) => ({ ...prev, nombres: '' }));
              }}
              onBlur={(e) => setForm((p) => ({ ...p, nombres: normalizarNombre(e.target.value) }))}
              className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100 ${
                fieldErrors.nombres ? 'border-red-400 bg-red-50' : 'border-slate-300 focus:border-blue-500'
              }`}
            />
            {fieldErrors.nombres && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.nombres}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Apellidos <span className="text-red-500">*</span>
            </label>
            <input
              required
              placeholder="Ej: Lopez Garcia"
              value={form.apellidos}
              onChange={(e) => {
                setForm((p) => ({ ...p, apellidos: e.target.value }));
                setFieldErrors((prev) => ({ ...prev, apellidos: '' }));
              }}
              onBlur={(e) => setForm((p) => ({ ...p, apellidos: normalizarNombre(e.target.value) }))}
              className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100 ${
                fieldErrors.apellidos ? 'border-red-400 bg-red-50' : 'border-slate-300 focus:border-blue-500'
              }`}
            />
            {fieldErrors.apellidos && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.apellidos}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Número de celular <span className="text-red-500">*</span>
            </label>
            <input
              required
              inputMode="tel"
              placeholder="Ej: 3001234567"
              value={form.telefono}
              onChange={(e) => {
                setForm((p) => ({ ...p, telefono: e.target.value }));
                setFieldErrors((prev) => ({ ...prev, telefono: '' }));
              }}
              className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100 ${
                fieldErrors.telefono ? 'border-red-400 bg-red-50' : 'border-slate-300 focus:border-blue-500'
              }`}
            />
            {fieldErrors.telefono && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.telefono}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Género <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.genero}
              onChange={(e) =>
                setForm((p) => ({ ...p, genero: e.target.value as GeneroPaciente }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {GENERO_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {GENERO_LABEL[g] ?? g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Fecha de nacimiento <span className="text-slate-400 text-xs">(opcional)</span>
            </label>
            <input
              type="date"
              value={form.fechaNacimiento ?? ''}
              onChange={(e) =>
                setForm((p) => ({ ...p, fechaNacimiento: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Correo electrónico <span className="text-slate-400 text-xs">(opcional)</span>
            </label>
            <input
              type="email"
              placeholder="tucorreo@ejemplo.com"
              value={form.email ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <p className="text-xs text-slate-400">
          Los campos con <span className="text-red-500">*</span> son obligatorios.
        </p>

        <button
          type="submit"
          disabled={completarMutation.isPending}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
        >
          {completarMutation.isPending ? 'Guardando...' : 'Guardar mi ficha'}
        </button>
      </form>
    </div>
  );
}
