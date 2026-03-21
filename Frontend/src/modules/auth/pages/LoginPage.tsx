import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { authService } from '../services/auth.service';
import { authStore } from '../store/auth.store';
import type { LoginRequestDto } from '../types/auth.types';
import { APP_ROUTES } from '../../../app/router/routes';

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
    <div>
      <h1>Iniciar sesión</h1>
      <p>Accede al sistema de la clínica Piedra Azul.</p>

      {errorMessage && <p>{errorMessage}</p>}

      <LoginForm onSubmit={handleLogin} loading={loading} />
    </div>
  );
}