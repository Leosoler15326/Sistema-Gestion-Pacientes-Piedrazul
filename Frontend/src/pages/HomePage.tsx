import { useEffect, useState } from 'react';
import api from '../services/api';
import Loader from '../components/common/Loader';
import PageHeader from '../components/common/PageHeader';

export default function HomePage() {
  const [status, setStatus] = useState('Conectando...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/health')
      .then((res) => {
        const backendMessage =
          res.data?.message ?? `Estado: ${res.data?.status ?? 'OK'}`;
        setStatus(backendMessage);
      })
      .catch(() => {
        setStatus('Error de conexión');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader message="Consultando estado del backend..." />;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title="Panel principal"
        subtitle="Resumen inicial del sistema Clínica Piedra Azul"
      />

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-2 text-lg font-semibold">Estado del backend</h2>
        <p className="text-green-600">{status}</p>
      </div>
    </div>
  );
}