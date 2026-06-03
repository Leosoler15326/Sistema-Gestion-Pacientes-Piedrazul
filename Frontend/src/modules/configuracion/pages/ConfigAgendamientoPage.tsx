import { useEffect, useState, type FormEvent } from 'react';
import PageHeader from '../../../components/common/PageHeader';
import InlineMessage from '../../../components/common/InlineMessage';
import Loader from '../../../components/common/Loader';
import {
  configuracionService,
  type ConfigAgendamientoDto,
} from '../services/configuracion.service';

export default function ConfigAgendamientoPage() {
  const [config, setConfig] = useState<ConfigAgendamientoDto | null>(null);
  const [semanas, setSemanas] = useState(8);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const data = await configuracionService.obtenerAgendamiento();
        if (!cancelled) {
          setConfig(data);
          setSemanas(data.ventanaSemanasAgendar);
        }
      } catch {
        if (!cancelled) setError('No fue posible cargar la configuración.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (semanas < 1 || semanas > 52) {
      setError('La ventana debe estar entre 1 y 52 semanas.');
      return;
    }
    try {
      setSaving(true);
      const data = await configuracionService.actualizarVentanaSemanas(semanas);
      setConfig(data);
      setMessage('Configuración actualizada correctamente.');
    } catch {
      setError('No fue posible guardar los cambios.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader message="Cargando configuración..." />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <PageHeader
        title="Configuración de agendamiento"
        subtitle="Ventana máxima en semanas para que pacientes y agenda elijan fechas de cita."
      />

      {error && (
        <div className="mb-4 max-w-lg">
          <InlineMessage type="error" message={error} />
        </div>
      )}
      {message && (
        <div className="mb-4 max-w-lg">
          <InlineMessage type="success" message={message} />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-lg space-y-4 rounded-2xl bg-white p-4 shadow-sm sm:p-6"
      >
        <p className="text-sm text-slate-600">
          Valor actual en servidor:{' '}
          <strong>{config?.ventanaSemanasAgendar ?? '—'} semanas</strong>
        </p>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Ventana (semanas hacia adelante)
          </label>
          <input
            type="number"
            min={1}
            max={52}
            value={semanas}
            onChange={(e) => setSemanas(Number(e.target.value))}
            className="w-full max-w-xs rounded-lg border px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
    </div>
  );
}
