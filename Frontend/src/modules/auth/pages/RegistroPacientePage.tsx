import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { authStore } from '../store/auth.store';
import { APP_ROUTES } from '../../../app/router/routes';
import InlineMessage from '../../../components/common/InlineMessage';

export default function RegistroPacientePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    try {
      const response = await authService.register({
        nombreUsuario: nombreUsuario.trim(),
        contrasena,
        nombreCompleto: nombreCompleto.trim(),
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 px-6 py-12">
      <div className="mx-auto w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-200">
            PA
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Registro de paciente</h1>
          <p className="mt-2 text-sm text-slate-500">
            Crea tu usuario para completar tu ficha y agendar citas en línea.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-5">
            <InlineMessage type="error" message={errorMessage} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Usuario
            </label>
            <input
              required
              autoComplete="username"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Contraseña
            </label>
            <input
              required
              type="password"
              autoComplete="new-password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Nombre completo
            </label>
            <input
              required
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Correo electrónico
            </label>
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Registrando...' : 'Crear cuenta'}
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
