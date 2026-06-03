import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import InlineMessage from '../../../components/common/InlineMessage';
import { authService } from '../services/auth.service';
import { APP_ROUTES } from '../../../app/router/routes';

export default function ForgotPasswordPage() {
  const [form, setForm] = useState({
    nombreUsuario: '',
    email: '',
    nuevaContrasena: '',
    confirmar: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.nuevaContrasena.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (form.nuevaContrasena !== form.confirmar) {
      setError('La nueva contraseña y su confirmación no coinciden.');
      return;
    }

    try {
      setLoading(true);
      await authService.recuperarContrasena({
        nombreUsuario: form.nombreUsuario.trim(),
        email: form.email.trim(),
        nuevaContrasena: form.nuevaContrasena,
      });
      setExito(true);
    } catch {
      setError('No se encontró una cuenta con esa cédula y correo. Verifica los datos e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-200">
              PA
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Recuperar contraseña</h2>
            <p className="mt-2 text-sm text-slate-500">
              Ingresa tu cédula y el correo registrado para crear una nueva contraseña.
            </p>
          </div>

          {exito ? (
            <div className="space-y-4">
              <InlineMessage
                type="success"
                message="¡Contraseña actualizada con éxito! Ya puedes iniciar sesión con tu nueva contraseña."
              />
              <Link
                to={APP_ROUTES.LOGIN}
                className="block w-full rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
              >
                Ir al inicio de sesión
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {error && <InlineMessage type="error" message={error} />}

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Cédula <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.nombreUsuario}
                  onChange={(e) => setForm((p) => ({ ...p, nombreUsuario: e.target.value }))}
                  placeholder="Tu número de cédula"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Correo electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="tucorreo@ejemplo.com"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Nueva contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={form.nuevaContrasena}
                  onChange={(e) => setForm((p) => ({ ...p, nuevaContrasena: e.target.value }))}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Confirmar nueva contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={form.confirmar}
                  onChange={(e) => setForm((p) => ({ ...p, confirmar: e.target.value }))}
                  placeholder="Repite la nueva contraseña"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Verificando...' : 'Restablecer contraseña'}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            <Link to={APP_ROUTES.LOGIN} className="font-medium text-blue-600 hover:underline">
              Volver al inicio de sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
