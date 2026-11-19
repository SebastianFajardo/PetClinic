import { useCallback, useEffect, useState } from 'react';
import { AppointmentsPage } from './features/appointments/AppointmentsPage';
import { MedicalRecordsPage } from './features/medical-records/MedicalRecordsPage';
import { TreatmentsPage } from './features/treatments/TreatmentsPage';
import { InventoryPage } from './features/inventory/InventoryPage';
import { ReportsPage } from './features/reports/ReportsPage';
import { OwnersPage } from './features/owners/OwnersPage';
import { PetsPage } from './features/pets/PetsPage';
import type { Owner, Pet } from './types';
import { AuthPage } from './features/auth/AuthPage';
import { api, sessionStorage, type AuthSession, type AuthUser } from './services/api';

type Section = 'overview' | 'owners' | 'pets' | 'appointments' | 'medical-records' | 'treatments' | 'inventory' | 'reports';
type RequestState = 'loading' | 'ready' | 'error';

const speciesLabels: Record<Pet['species'], string> = {
  dog: 'Perro',
  cat: 'Gato',
  bird: 'Ave',
  other: 'Otro',
};

function Dashboard({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  const [section, setSection] = useState<Section>('overview');
  const [owners, setOwners] = useState<Owner[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [requestState, setRequestState] = useState<RequestState>('loading');
  const [apiConnected, setApiConnected] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setRequestState('loading');
    setError('');
    try {
      const [ownerList, petList, health] = await Promise.all([
        api.owners.list(),
        api.pets.list(),
        api.health(),
      ]);
      setOwners(ownerList);
      setPets(petList);
      setApiConnected(health.status === 'ok');
      setRequestState('ready');
    } catch (cause) {
      setApiConnected(false);
      setRequestState('error');
      setError(cause instanceof Error ? cause.message : 'No fue posible cargar la información');
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);


  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" onClick={() => setSection('overview')}>
          <span className="brand-mark">P</span>
          <span>PetClinic <strong>Cloud</strong></span>
        </a>
        <span className="nav-caption">GESTIÓN</span>
        <nav className="navigation">
          <button className={section === 'overview' ? 'nav-item active' : 'nav-item'} onClick={() => setSection('overview')}>
            <span>⌂</span> Resumen
          </button>
          <button className={section === 'owners' ? 'nav-item active' : 'nav-item'} onClick={() => setSection('owners')}>
            <span>♙</span> Propietarios
          </button>
          <button className={section === 'pets' ? 'nav-item active' : 'nav-item'} onClick={() => setSection('pets')}>
            <span>♡</span> Mascotas
          </button>
          <button className={section === 'appointments' ? 'nav-item active' : 'nav-item'} onClick={() => setSection('appointments')}>
            <span>▦</span> Citas
          </button>
          {['admin', 'veterinarian'].includes(user.role) && <button className={section === 'medical-records' ? 'nav-item active' : 'nav-item'} onClick={() => setSection('medical-records')}>
            <span>＋</span> Historias clínicas
          </button>}
          {['admin', 'veterinarian', 'assistant'].includes(user.role) && <button className={section === 'treatments' ? 'nav-item active' : 'nav-item'} onClick={() => setSection('treatments')}>
            <span>♡</span> Tratamientos
          </button>}
          {['admin', 'veterinarian', 'assistant'].includes(user.role) && <button className={section === 'inventory' ? 'nav-item active' : 'nav-item'} onClick={() => setSection('inventory')}>
            <span>▤</span> Inventario
          </button>}
          {['admin', 'veterinarian'].includes(user.role) && <button className={section === 'reports' ? 'nav-item active' : 'nav-item'} onClick={() => setSection('reports')}>
            <span>▥</span> Reportes
          </button>}
        </nav>
        <div className="sidebar-footer">
          <span className={apiConnected ? 'connection-dot online' : 'connection-dot'} />
          <span>{apiConnected ? 'API conectada' : 'API desconectada'}</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="eyebrow">PLATAFORMA DE GESTIÓN VETERINARIA</span>
            <h1>{section === 'overview' ? 'Resumen general' : section === 'owners' ? 'Propietarios' : section === 'pets' ? 'Mascotas' : section === 'appointments' ? 'Citas' : section === 'medical-records' ? 'Historias clínicas' : section === 'treatments' ? 'Tratamientos y controles' : section === 'inventory' ? 'Inventario y movimientos' : 'Reportes e indicadores'}</h1>
          </div>
          <div className="account-actions"><div className="account-identity"><strong>{user.name}</strong><span>{user.role}</span></div><button className="secondary-button" onClick={onLogout}>Cerrar sesión</button><button className="refresh-button" onClick={() => void loadData()} aria-label="Actualizar información">↻</button></div>
        </header>

        {error && <div className="error-banner" role="alert">{error}</div>}
        {requestState === 'loading' && <div className="loading-state">Cargando información...</div>}
        {requestState === 'error' && (
          <section className="empty-state">
            <h2>No fue posible conectar con PetClinic API</h2>
            <p>Verifica que el backend esté ejecutándose y que PostgreSQL esté disponible.</p>
            <button className="primary-button" onClick={() => void loadData()}>Reintentar</button>
          </section>
        )}

        {requestState === 'ready' && section === 'overview' && (
          <>
            <section className="welcome-panel">
              <div>
                <span className="welcome-label">PANEL DE CONTROL</span>
                <h2>Todo tu centro veterinario, en un solo lugar.</h2>
                <p>Administra propietarios y pacientes desde una plataforma centralizada.</p>
              </div>
              <div className="welcome-symbol">✚</div>
            </section>
            <section className="stats-grid">
              <article className="stat-card"><span>Propietarios registrados</span><strong>{owners.length}</strong><small>Registros activos</small></article>
              <article className="stat-card"><span>Mascotas registradas</span><strong>{pets.length}</strong><small>Pacientes registrados</small></article>
              <article className="stat-card"><span>Estado del sistema</span><strong className="system-value">Operativo</strong><small>Conexión con API establecida</small></article>
            </section>
            <section className="content-card">
              <div className="section-heading"><div><h2>Registros recientes</h2><p>Últimos pacientes agregados</p></div><button className="text-button" onClick={() => setSection('pets')}>Ver mascotas</button></div>
              <PetTable pets={pets.slice(0, 5)} owners={owners} />
            </section>
          </>
        )}

        {requestState === 'ready' && section === 'owners' && <OwnersPage owners={owners} onChanged={loadData} />}

        {requestState === 'ready' && section === 'appointments' && <AppointmentsPage pets={pets} />}

        {requestState === 'ready' && section === 'medical-records' && ['admin', 'veterinarian'].includes(user.role) && <MedicalRecordsPage pets={pets} />}

        {requestState === 'ready' && section === 'treatments' && ['admin', 'veterinarian', 'assistant'].includes(user.role) && <TreatmentsPage pets={pets} />}

        {requestState === 'ready' && section === 'inventory' && ['admin', 'veterinarian', 'assistant'].includes(user.role) && <InventoryPage />}

        {requestState === 'ready' && section === 'reports' && ['admin', 'veterinarian'].includes(user.role) && <ReportsPage />}

        {requestState === 'ready' && section === 'pets' && <PetsPage pets={pets} owners={owners} onChanged={loadData} />}

      </main>
    </div>
  );
}

function PetTable({ pets, owners }: { pets: Pet[]; owners: Owner[] }) {
  const ownerNames = new Map(owners.map(owner => [owner.id, `${owner.name} ${owner.lastName}`]));
  return (
    <div className="table-wrap"><table><thead><tr><th>Mascota</th><th>Especie</th><th>Raza</th><th>Propietario</th><th>Peso</th></tr></thead><tbody>
      {pets.map(pet => <tr key={pet.id}><td><strong>{pet.name}</strong></td><td>{speciesLabels[pet.species]}</td><td>{pet.breed ?? '—'}</td><td>{ownerNames.get(pet.ownerId) ?? '—'}</td><td>{pet.weightKg ? `${pet.weightKg} kg` : '—'}</td></tr>)}
    </tbody></table>{pets.length === 0 && <p className="table-empty">Todavía no hay mascotas registradas.</p>}</div>
  );
}


export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;
    async function restoreSession() {
      if (!sessionStorage.getToken()) {
        setCheckingSession(false);
        return;
      }
      try {
        const currentUser = await api.auth.me();
        if (active) setUser(currentUser);
      } catch {
        sessionStorage.clear();
        if (active) setUser(null);
      } finally {
        if (active) setCheckingSession(false);
      }
    }
    void restoreSession();
    return () => { active = false; };
  }, []);

  function handleAuthenticated(session: AuthSession) {
    setUser(session.user);
  }

  function handleLogout() {
    sessionStorage.clear();
    setUser(null);
  }

  if (checkingSession) {
    return <main className="auth-screen"><div className="loading-state">Verificando sesión...</div></main>;
  }

  if (!user) return <AuthPage onAuthenticated={handleAuthenticated} />;
  return <Dashboard user={user} onLogout={handleLogout} />;
}
