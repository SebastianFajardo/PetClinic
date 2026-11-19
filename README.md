# PetClinic Cloud

Plataforma web académica para apoyar la gestión clínica, administrativa y logística de clínicas y consultorios veterinarios. El prototipo integra procesos de autenticación, propietarios, mascotas, citas, historias clínicas, tratamientos, inventario e informes.

## Technology stack

- Backend: NestJS, TypeScript y arquitectura orientada al dominio.
- Frontend: React, TypeScript y Vite.
- Database: PostgreSQL.
- Persistence: TypeORM.
- Authentication: JWT y bcryptjs.
- Local infrastructure: Docker Compose.
- Testing: Jest para pruebas del backend.

## Repository structure

```text
apps/
  api/
    src/
      appointments/
      authentication/
      database/
      inventory/
      medical-records/
      owners/
      pets/
      reports/
      treatments/
  web/
    src/
      features/
        appointments/
        inventory/
        medical-records/
        reports/
        treatments/
```

## Requirements

- Node.js 22.
- npm 10 or later.
- Docker Desktop or Docker Engine with Docker Compose.

## Local setup

1. Clone the repository and move to its root directory.
2. Copy `.env.example` to `.env`.
3. Set a unique `JWT_SECRET` with at least 32 characters. Configure the PostgreSQL values if they differ from the local defaults.
4. Install dependencies:

   ```bash
   npm install
   ```

5. Start PostgreSQL:

   ```bash
   docker compose up -d database
   ```

6. Run database migrations:

   ```bash
   npm run migration:run --workspace @petclinic/api
   ```

7. Start the API in one terminal:

   ```bash
   npm run dev:api
   ```

8. Start the web application in another terminal:

   ```bash
   npm run dev:web
   ```

The API uses port 3000 by default and the web application uses `VITE_API_URL` to locate the API. The default API base URL is `http://localhost:3000/api/v1`.

## Environment variables

The root `.env.example` contains the local configuration template:

| Variable | Purpose |
|---|---|
| `POSTGRES_DB` | PostgreSQL database created by Docker Compose |
| `POSTGRES_USER` | PostgreSQL user |
| `POSTGRES_PASSWORD` | PostgreSQL password |
| `DATABASE_HOST` | Database host used by the API |
| `DATABASE_PORT` | Database port |
| `DATABASE_NAME` | Database name used by the API |
| `DATABASE_USER` | Database user used by the API |
| `DATABASE_PASSWORD` | Database password used by the API |
| `API_PORT` | API listening port |
| `JWT_SECRET` | Secret used to sign access tokens |
| `JWT_EXPIRES_IN` | Access-token expiration |
| `VITE_API_URL` | API base URL used by the frontend |

Never commit real credentials, production secrets, or private environment files.

## Authentication and roles

The API uses JWT authentication. The authentication endpoints are:

- `POST /api/v1/auth/register`: registers an assistant account; public registration does not allow choosing a privileged role.
- `POST /api/v1/auth/login`: validates credentials and returns an access token.
- `GET /api/v1/auth/me`: returns the identity associated with the bearer token.

The application defines the roles `admin`, `veterinarian`, `assistant` and `receptionist`. Controllers can restrict access using the roles decorator and authorization guard. Access must be validated with accounts belonging to each role.

For a local academic environment, the first administrator can be configured through a trusted database session after registering the initial account:

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

## Main functional modules

- **Owners:** registration, listing, consultation, editing and deletion of owner records.
- **Pets:** registration, listing, consultation, editing and deletion of pets, including owner association.
- **Appointments:** scheduling, listing, consultation, editing and status management. Active appointments for the same pet are checked for scheduling conflicts.
- **Medical records:** creation and consultation of clinical records, including filtering by pet. Clinical history is preserved for traceability.
- **Treatments:** creation and consultation of treatments, registration of controls and status changes to active, completed or cancelled.
- **Inventory:** product registration and consultation, stock movements (entry, exit and adjustment), and low-stock monitoring.
- **Reports:** dashboard indicators and summaries based on the information available from the application modules.

## API endpoints

Base URL: `/api/v1`.

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
- `PATCH /appointments/:id`
- `PATCH /appointments/:id/status`

Appointment states are `scheduled`, `confirmed`, `completed`, `cancelled` and `no_show`.

### Treatments

- `POST /treatments`
- `GET /treatments`
- `GET /treatments?petId=:petId`
- `GET /treatments/:id`
- `POST /treatments/:id/controls`
- `PATCH /treatments/:id/status`

Treatment states are `active`, `completed` and `cancelled`.

Inventory and report screens are integrated into the application. Consult their corresponding backend implementation before relying on endpoint details not listed above.

## Quality checks

Run the backend and frontend builds:

```bash
npm run build --workspace @petclinic/api
npm run build --workspace @petclinic/web
```

Run backend tests:

```bash
npm run test --workspace @petclinic/api
```

The functional test matrix must record the execution date, tested version, responsible person, test data, expected and actual results, defects, corrective actions and evidence. A test must only be marked as passed after it has been executed.

## Scope and limitations

PetClinic Cloud is an academic functional prototype. It supports the organization of administrative and clinical information but does not provide automated veterinary diagnoses, autonomous prescriptions, electronic invoicing, real payments or mandatory integrations with external veterinary platforms. Use fictitious or properly anonymized data during demonstrations and tests.

A successful build or functional test does not by itself establish production readiness or a specific Technology Readiness Level (TRL). Any TRL claim must be supported by the integrated prototype, the validation environment, test results and the evidence required by the course and tutor.
