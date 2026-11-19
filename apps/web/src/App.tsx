import { useEffect, useState } from 'react';

type HealthStatus = 'loading' | 'connected' | 'disconnected';

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';

export default function App() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus>('loading');

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${apiUrl}/health`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('API unavailable');
        return response.json();
      })
      .then(() => setHealthStatus('connected'))
      .catch(() => {
        if (!controller.signal.aborted) setHealthStatus('disconnected');
      });
    return () => controller.abort();
  }, []);

  const statusLabels: Record<HealthStatus, string> = {
    loading: 'Verificando conexión',
    connected: 'API conectada',
    disconnected: 'API no disponible',
  };

  return (
    <main className="page-shell">
      <section className="hero-card">
        <span className="eyebrow">GESTIÓN VETERINARIA EN LA NUBE</span>
        <h1>PetClinic Cloud</h1>
        <p>Una plataforma centralizada para la gestión clínica y administrativa veterinaria.</p>
        <div className={`connection-status ${healthStatus}`}>
          <span className="status-indicator" />
          {statusLabels[healthStatus]}
        </div>
      </section>
    </main>
  );
}
