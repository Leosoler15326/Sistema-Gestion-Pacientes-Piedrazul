import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { authStore } from '../store/auth.store';
import { APP_ROUTES } from '../../../app/router/routes';
import InlineMessage from '../../../components/common/InlineMessage';

function normalizarNombre(valor: string): string {
  return valor
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function RegistroPacientePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cedula, setCedula] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validar = (): boolean => {
    const errors: Record<string, string> = {};
    if (!cedula.trim()) errors.cedula = 'Ingresa tu número de cédula.';
    if (contrasena.length < 6) errors.contrasena = 'La contraseña debe tener al menos 6 caracteres.';
    if (!nombreCompleto.trim()) errors.nombreCompleto = 'Ingresa tu nombre completo.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!validar()) return;
    setLoading(true);
    try {
      const response = await authService.register({
        nombreUsuario: cedula.trim(),
        contrasena,
        nombreCompleto: normalizarNombre(nombreCompleto),
        email: email.trim(),
        rol: 'PACIENTE',
      });
      authStore.saveSession(response);
      navigate(APP_ROUTES.PACIENTE_COMPLETAR_PERFIL, { replace: true });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message;
      setErrorMessage(
        typeof msg === 'string'
          ? msg
          : 'No fue posible completar el registro. Revisa los datos e intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-200">
            PA
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Crear cuenta</h1>
          <p className="mt-2 text-sm text-slate-500">
            Regístrate para agendar tu cita en línea.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-5">
            <InlineMessage type="error" message={errorMessage} />
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Número de cédula <span className="text-red-500">*</span>
            </label>
            <input
              required
              inputMode="numeric"
              placeholder="Ej: 1020304050"
              autoComplete="username"
              value={cedula}
              onChange={(e) => {
                setCedula(e.target.value);
                setFieldErrors((prev) => ({ ...prev, cedula: '' }));
              }}
              className={`w-full rounded-xl border px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-blue-100 ${
                fieldErrors.cedula ? 'border-red-400 bg-red-50 focus:border-red-400' : 'border-slate-300 focus:border-blue-500'
              }`}
            />
            {fieldErrors.cedula && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.cedula}</p>
            )}
            <p className="mt-1 text-xs text-slate-400">Tu cédula será tu usuario para ingresar al sistema.</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="password"
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              value={contrasena}
              onChange={(e) => {
                setContrasena(e.target.value);
                setFieldErrors((prev) => ({ ...prev, contrasena: '' }));
              }}
              className={`w-full rounded-xl border px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-blue-100 ${
                fieldErrors.contrasena ? 'border-red-400 bg-red-50 focus:border-red-400' : 'border-slate-300 focus:border-blue-500'
              }`}
            />
            {fieldErrors.contrasena && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.contrasena}</p>
            )}
            <p className="mt-1 text-xs text-slate-400">Al menos 6 letras o números, sin espacios.</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Nombre completo <span className="text-red-500">*</span>
            </label>
            <input
              required
              placeholder="Ej: Ana Maria Lopez"
              value={nombreCompleto}
              onChange={(e) => {
                setNombreCompleto(e.target.value);
                setFieldErrors((prev) => ({ ...prev, nombreCompleto: '' }));
              }}
              onBlur={(e) => setNombreCompleto(normalizarNombre(e.target.value))}
              className={`w-full rounded-xl border px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-blue-100 ${
                fieldErrors.nombreCompleto ? 'border-red-400 bg-red-50 focus:border-red-400' : 'border-slate-300 focus:border-blue-500'
              }`}
            />
            {fieldErrors.nombreCompleto && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.nombreCompleto}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="tucorreo@ejemplo.com (opcional)"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <p className="text-xs text-slate-400">
            Los campos con <span className="text-red-500">*</span> son obligatorios.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          ¿Ya tienes cuenta?{' '}
          <Link to={APP_ROUTES.LOGIN} className="font-medium text-blue-600 hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
