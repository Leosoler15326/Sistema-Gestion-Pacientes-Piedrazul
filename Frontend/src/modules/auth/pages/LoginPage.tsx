import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { authService } from '../services/auth.service';
import { authStore } from '../store/auth.store';
import type { LoginRequestDto } from '../types/auth.types';
import { APP_ROUTES } from '../../../app/router/routes';
import InlineMessage from '../../../components/common/InlineMessage';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const from =
    (location.state as { from?: string } | null)?.from || APP_ROUTES.HOME;

  const handleLogin = async (values: LoginRequestDto) => {
    try {
      setLoading(true);
      setErrorMessage('');

      const response = await authService.login(values);
      authStore.saveSession(response);

      navigate(from, { replace: true });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setErrorMessage('No fue posible iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="hidden lg:flex lg:flex-col lg:justify-between bg-slate-900 px-12 py-14 text-white">
          <div>
            <div className="mb-8 inline-flex items-center rounded-full border border-white/20 px-4 py-1 text-sm text-blue-100">
              Clínica Piedra Azul
            </div>

            <h1 className="max-w-lg text-4xl font-bold leading-tight">
              Gestión clínica más clara, organizada y segura.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
              Accede al sistema para administrar pacientes, citas, historias clínicas,
              personal y usuarios desde una sola plataforma.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-sm text-slate-300">Módulos</p>
              <p className="mt-2 text-2xl font-semibold">Pacientes, Citas, Historia</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-sm text-slate-300">Acceso</p>
              <p className="mt-2 text-2xl font-semibold">Roles y autenticación</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-200">
                  PA
                </div>

                <h2 className="text-3xl font-bold text-slate-800">
                  Bienvenido
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Inicia sesión para ingresar al sistema clínico
                </p>
              </div>

              {errorMessage && (
                <div className="mb-5">
                  <InlineMessage type="error" message={errorMessage} />
                </div>
              )}

              <LoginForm onSubmit={handleLogin} loading={loading} />

              <p className="mt-4 text-center text-sm text-slate-500">
                <Link
                  to={APP_ROUTES.RECUPERAR_CONTRASENA}
                  className="font-medium text-blue-600 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </p>

              <p className="mt-3 text-center text-sm text-slate-600">
                ¿Eres paciente y aún no tienes cuenta?{' '}
                <Link
                  to={APP_ROUTES.REGISTRO_PACIENTE}
                  className="font-medium text-blue-600 hover:underline"
                >
                  Regístrate aquí
                </Link>
              </p>

              <div className="mt-8 border-t border-slate-200 pt-5 text-center text-xs text-slate-400">
                Clínica Piedra Azul · Plataforma interna
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}