import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [status, setStatus] = useState('Conectando...');

  useEffect(() => {
    axios.get('http://localhost:8080/api/health')
      .then(res => setStatus(res.data.message))
      .catch(() => setStatus('Error de conexión'));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow">
        <h1 className="text-xl font-bold mb-2">Estado del backend</h1>
        <p className="text-green-600">{status}</p>
      </div>
    </div>
  );
}

export default App;