import { FormEvent, useCallback, useEffect, useState } from 'react';
import { AppointmentsPage } from './features/appointments/AppointmentsPage';
import { MedicalRecordsPage } from './features/medical-records/MedicalRecordsPage';
import { TreatmentsPage } from './features/treatments/TreatmentsPage';
import type { Owner, Pet } from './types';
import { AuthPage } from './features/auth/AuthPage';
import { api, sessionStorage, type AuthSession, type AuthUser } from './services/api';

type Section = 'overview' | 'owners' | 'pets' | 'appointments' | 'medical-records' | 'treatments';
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
  const [showOwnerForm, setShowOwnerForm] = useState(false);
  const [showPetForm, setShowPetForm] = useState(false);

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

  async function createOwner(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await api.owners.create({
        name: String(form.get('firstName')),
        lastName: String(form.get('lastName')),
        documentNumber: String(form.get('document')),
        email: String(form.get('email')),
        phone: String(form.get('phone')),
        address: String(form.get('address')),
      });
      setShowOwnerForm(false);
      await loadData();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible registrar el propietario');
    }
  }

  async function createPet(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const weight = String(form.get('weight'));
    try {
      await api.pets.create({
        ownerId: String(form.get('ownerId')),
        name: String(form.get('name')),
        species: String(form.get('species')) as Pet['species'],
        breed: String(form.get('breed')),
        birthDate: String(form.get('birthDate')) || undefined,
        sex: String(form.get('sex')) as Pet['sex'],
        color: String(form.get('color')),
        weightKg: weight ? Number(weight) : undefined,
        notes: String(form.get('notes')),
      });
      setShowPetForm(false);
      await loadData();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible registrar la mascota');
    }
  }

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
            <h1>{section === 'overview' ? 'Resumen general' : section === 'owners' ? 'Propietarios' : section === 'pets' ? 'Mascotas' : section === 'appointments' ? 'Citas' : section === 'medical-records' ? 'Historias clínicas' : 'Tratamientos y controles'}</h1>
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

        {requestState === 'ready' && section === 'owners' && (
          <section className="content-card">
            <div className="section-heading"><div><h2>Directorio de propietarios</h2><p>{owners.length} propietarios registrados</p></div><button className="primary-button" onClick={() => setShowOwnerForm(!showOwnerForm)}>+ Nuevo propietario</button></div>
            {showOwnerForm && <form className="data-form" onSubmit={createOwner}>
              <label>Nombres<input name="firstName" required minLength={2} maxLength={100} /></label>
              <label>Apellidos<input name="lastName" required minLength={2} maxLength={100} /></label>
              <label>Documento<input name="document" required minLength={3} maxLength={30} /></label>
              <label>Correo electrónico<input name="email" type="email" required /></label>
              <label>Teléfono<input name="phone" required minLength={7} /></label>
              <label>Dirección<input name="address" /></label>
              <div className="form-actions"><button className="primary-button" type="submit">Guardar propietario</button><button className="secondary-button" type="button" onClick={() => setShowOwnerForm(false)}>Cancelar</button></div>
            </form>}
            <div className="table-wrap"><table><thead><tr><th>Propietario</th><th>Documento</th><th>Correo</th><th>Teléfono</th></tr></thead><tbody>
              {owners.map(owner => <tr key={owner.id}><td><strong>{owner.name} {owner.lastName}</strong></td><td>{owner.documentNumber}</td><td>{owner.email}</td><td>{owner.phone}</td></tr>)}
            </tbody></table>{owners.length === 0 && <p className="table-empty">Todavía no hay propietarios registrados.</p>}</div>
          </section>
        )}

        {requestState === 'ready' && section === 'appointments' && <AppointmentsPage pets={pets} />}

        {requestState === 'ready' && section === 'medical-records' && ['admin', 'veterinarian'].includes(user.role) && <MedicalRecordsPage pets={pets} />}

        {requestState === 'ready' && section === 'treatments' && ['admin', 'veterinarian', 'assistant'].includes(user.role) && <TreatmentsPage pets={pets} />}

        {requestState === 'ready' && section === 'pets' && (
          <section className="content-card">
            <div className="section-heading"><div><h2>Pacientes</h2><p>{pets.length} mascotas registradas</p></div><button className="primary-button" onClick={() => setShowPetForm(!showPetForm)} disabled={owners.length === 0}>+ Nueva mascota</button></div>
            {owners.length === 0 && <p className="info-banner">Registra primero un propietario para poder asociar una mascota.</p>}
            {showPetForm && <form className="data-form" onSubmit={createPet}>
              <label>Propietario<select name="ownerId" required>{owners.map(owner => <option key={owner.id} value={owner.id}>{owner.name} {owner.lastName}</option>)}</select></label>
              <label>Nombre<input name="name" required maxLength={120} /></label>
              <label>Especie<select name="species"><option value="dog">Perro</option><option value="cat">Gato</option><option value="bird">Ave</option><option value="other">Otro</option></select></label>
              <label>Raza<input name="breed" /></label>
              <label>Fecha de nacimiento<input name="birthDate" type="date" /></label>
              <label>Sexo<select name="sex"><option value="unknown">Sin especificar</option><option value="male">Macho</option><option value="female">Hembra</option></select></label>
              <label>Color<input name="color" /></label>
              <label>Peso (kg)<input name="weight" type="number" min="0.01" max="500" step="0.01" /></label>
              <label className="full-field">Notas<textarea name="notes" rows={3} /></label>
              <div className="form-actions"><button className="primary-button" type="submit">Guardar mascota</button><button className="secondary-button" type="button" onClick={() => setShowPetForm(false)}>Cancelar</button></div>
            </form>}
            <PetTable pets={pets} owners={owners} />
          </section>
        )}
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
