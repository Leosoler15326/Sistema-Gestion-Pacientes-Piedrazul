import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import InlineMessage from '../../../components/common/InlineMessage';
import BackButton from '../../../components/common/BackButton';
import { authService } from '../services/auth.service';

export default function CambiarContrasenaPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    contrasenaActual: '',
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
      await authService.cambiarContrasena({
        contrasenaActual: form.contrasenaActual,
        nuevaContrasena: form.nuevaContrasena,
      });
      setExito(true);
      setTimeout(() => navigate(-1), 2500);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'No fue posible cambiar la contraseña. Verifica que la contraseña actual sea correcta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <PageHeader
        title="Cambiar contraseña"
        subtitle="Elige una nueva contraseña para tu cuenta."
        actions={<BackButton />}
      />

      <div className="max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        {exito ? (
          <InlineMessage
            type="success"
            message="¡Contraseña cambiada con éxito! Serás redirigido en un momento."
          />
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {error && <InlineMessage type="error" message={error} />}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Contraseña actual <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={form.contrasenaActual}
                onChange={(e) => setForm((p) => ({ ...p, contrasenaActual: e.target.value }))}
                placeholder="Tu contraseña actual"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
