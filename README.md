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
      compartido/
      estado/
      propietarios/
      mascotas/
      database/
  web/
    src/
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

4. Run the database migration from the repository root:

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

## Implemented API endpoints

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

## Current scope

The current increment includes the initial application foundation, owner and pet management, PostgreSQL mappings, the first database migration, a basic web interface, domain unit tests and a GitHub Actions validation workflow.

Clinical records, appointments, treatments, inventory, reporting, authentication and authorization are not implemented yet. This repository is an academic prototype in progress and has not been validated as a production or TRL5 system.
