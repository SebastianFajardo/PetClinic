# PetClinic Cloud

Plataforma web académica para apoyar la gestión clínica, administrativa y logística de clínicas y consultorios veterinarios.

## Technology stack

- Backend: NestJS, TypeScript y Domain-Driven Design
- Frontend: React, TypeScript y Vite
- Database: PostgreSQL
- Persistence: TypeORM
- Local infrastructure: Docker Compose

## Repository structure

```text
apps/
  api/
    src/
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
2. Install dependencies from the repository root:

   ```bash
   npm install
   ```

3. Start PostgreSQL:

   ```bash
   docker compose up -d database
   ```

4. Run database migrations:

   ```bash
   npm run migration:run --workspace @petclinic/api
   ```

5. Start the API:

   ```bash
   npm run dev:api
   ```

6. In another terminal, start the web application:

   ```bash
   npm run dev:web
   ```

The web application uses `http://localhost:3000/api/v1` by default. Configure `VITE_API_URL` when the API runs at another address.

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

The current increment includes owner and pet management, clinical records, appointment scheduling, PostgreSQL mappings, database migrations, domain unit tests and initial web screens for the four management areas.

Authentication and authorization, treatments as a separate module, inventory, reporting and reminders are not implemented yet. The project is an academic prototype in progress. It has not been validated as a production or TRL5 system.
