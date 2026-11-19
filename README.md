# PetClinic Cloud

Plataforma web académica para apoyar la gestión clínica, administrativa y logística de clínicas y consultorios veterinarios.

## Technology stack

- Backend: NestJS, TypeScript y Domain-Driven Design
- Frontend: React, TypeScript y Vite
- Database: PostgreSQL
- Persistence: TypeORM
- Authentication: JWT y bcryptjs
- Local infrastructure: Docker Compose

## Repository structure

```text
apps/
  api/
    src/
      autenticacion/
      citas/
      compartido/
      estado/
      historias-clinicas/
      mascotas/
      propietarios/
      database/
  web/
    src/
      features/
        appointments/
        medical-records/
```

## Requirements

- Node.js 22
- npm 10 or later
- Docker Desktop or Docker Engine with Docker Compose

## Local setup

1. Copy `.env.example` to `.env`.
2. Replace `JWT_SECRET` with a unique random secret of at least 32 characters.
3. Install dependencies from the repository root:

   ```bash
   npm install
   ```

4. Start PostgreSQL:

   ```bash
   docker compose up -d database
   ```

5. Run database migrations:

   ```bash
   npm run migration:run --workspace @petclinic/api
   ```

6. Start the API:

   ```bash
   npm run dev:api
   ```

7. In another terminal, start the web application:

   ```bash
   npm run dev:web
   ```

The web application uses `http://localhost:3000/api/v1` by default. Configure `VITE_API_URL` when the API runs at another address. The login screen stores the access token in browser local storage, restores the session through `GET /auth/me` and sends the bearer token on protected API requests. Use the logout action to clear the local session.

## Authentication and roles

The API protects routes with JWT. Public endpoints are limited to health status, registration and login.

- `POST /auth/register`: creates an assistant account. The public registration endpoint cannot choose its role.
- `POST /auth/login`: validates credentials and returns an access token.
- `GET /auth/me`: returns the identity associated with the bearer token.

Supported roles are `admin`, `veterinarian`, `assistant` and `receptionist`. The `@Roles(...)` decorator and global role guard are available to apply authorization rules to controllers and routes.

For the initial academic environment, register the first account and promote it manually to administrator using a trusted database session:

```sql
UPDATE users
SET role = 'admin', updated_at = now()
WHERE email = 'admin@example.com';
```

Replace the email with the account created during setup. Do not expose database credentials or the JWT secret in the frontend or repository.

Send the token on protected requests:

```http
Authorization: Bearer <accessToken>
```

## API endpoints

Base URL: `/api/v1`

### Health

- `GET /health`

### Owners

- `POST /owners`
- `GET /owners`
- `GET /owners/:id`
- `PATCH /owners/:id`
- `DELETE /owners/:id`

### Pets

- `POST /pets`
- `GET /pets`
- `GET /pets?ownerId=:ownerId`
- `GET /pets/:id`
- `PATCH /pets/:id`
- `DELETE /pets/:id`

### Medical records

- `POST /medical-records`
- `GET /medical-records`
- `GET /medical-records?petId=:petId`
- `GET /medical-records/:id`

### Appointments

- `POST /appointments`
- `GET /appointments`
- `GET /appointments?from=:date&to=:date`
- `GET /appointments/:id`
- `PATCH /appointments/:id/status`

Appointment states are `scheduled`, `confirmed`, `completed`, `cancelled` and `no_show`. The API validates state transitions and prevents overlapping active appointments for the same pet.

## Current scope

The current increment includes owner and pet management, clinical records, appointment scheduling, JWT authentication, role-based authorization infrastructure, PostgreSQL mappings, database migrations, domain unit tests and initial web screens for the management areas.

Treatments as a separate module, inventory, reporting and reminders remain pending. The project is an academic prototype in progress. It has not been validated as a production or TRL5 system.
