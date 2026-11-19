import { FormEvent, useState } from 'react';
import { api, sessionStorage, type AuthSession } from '../../services/api';

interface AuthPageProps {
  onAuthenticated: (session: AuthSession) => void;
}

export function AuthPage({ onAuthenticated }: AuthPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const session = await api.auth.login(email, password);
      sessionStorage.save(session);
      onAuthenticated(session);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-screen">
      <section className="auth-card">
        <div className="auth-brand"><span className="brand-mark">P</span><span>PetClinic <strong>Cloud</strong></span></div>
        <span className="eyebrow">GESTIÓN VETERINARIA</span>
        <h1>Bienvenido</h1>
        <p>Inicia sesión para acceder a la plataforma.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Correo electrónico<input type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="username" required maxLength={180} /></label>
          <label>Contraseña<input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required maxLength={72} /></label>
          {error && <div className="error-banner" role="alert">{error}</div>}
          <button className="primary-button" type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Iniciar sesión'}</button>
        </form>
      </section>
    </main>
  );
}
