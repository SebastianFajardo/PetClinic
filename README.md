# PetClinic Cloud

PetClinic Cloud es una plataforma web académica para apoyar la gestión clínica, administrativa y logística de clínicas y consultorios veterinarios. El prototipo integra autenticación, administración de propietarios y mascotas, programación de citas, historias clínicas, tratamientos, inventario e informes.

## Tecnologías utilizadas

- **Backend:** NestJS y TypeScript.
- **Frontend:** React, TypeScript y Vite.
- **Base de datos:** PostgreSQL.
- **Persistencia:** TypeORM.
- **Autenticación:** JWT y bcryptjs.
- **Entorno local:** Docker Compose.
- **Pruebas del backend:** Jest.

## Estructura del proyecto

El repositorio está organizado como un monorepositorio con dos aplicaciones principales:

- **apps/api:** contiene la API, la lógica de negocio, la autenticación, el acceso a datos y los módulos funcionales.
- **apps/web:** contiene la interfaz web y las pantallas para la gestión veterinaria.

Los módulos funcionales se organizan por áreas, entre ellas citas, inventario, historias clínicas, informes, propietarios, mascotas y tratamientos.

## Requisitos previos

Antes de instalar el proyecto, asegúrese de contar con:

- Node.js 22.
- npm 10 o una versión posterior.
- Docker Desktop o Docker Engine con soporte para Docker Compose.
- Acceso al repositorio de GitHub.
- Un navegador web actualizado.

## Instalación y configuración del entorno

1. **Obtener el proyecto:** descargue o clone el repositorio desde GitHub y abra la carpeta raíz del proyecto en su entorno de desarrollo.
2. **Configurar las variables de entorno:** tome como referencia el archivo `.env.example` ubicado en la raíz y cree su archivo local `.env`. No publique este archivo ni comparta sus credenciales.
3. **Configurar la base de datos:** revise los valores de conexión de PostgreSQL. Puede conservar los valores locales de ejemplo o reemplazarlos por los de su entorno.
4. **Definir la clave de autenticación:** establezca un valor privado, aleatorio y de al menos 32 caracteres para `JWT_SECRET`. No utilice la clave de ejemplo en un entorno compartido o publicado.
5. **Instalar dependencias:** desde la carpeta raíz, utilice el gestor de paquetes npm para instalar las dependencias declaradas por el proyecto.
6. **Iniciar PostgreSQL:** levante el servicio de base de datos definido en la configuración de Docker Compose y confirme que se encuentre disponible.
7. **Preparar la base de datos:** ejecute las migraciones incluidas en el backend para crear o actualizar la estructura de datos. No elimine manualmente las tablas ni el historial de migraciones.
8. **Iniciar el backend:** inicie la aplicación API en modo de desarrollo y verifique que quede escuchando en el puerto configurado.
9. **Iniciar el frontend:** inicie la aplicación web y confirme que la variable `VITE_API_URL` apunte a la dirección base de la API.
10. **Abrir la aplicación:** acceda desde el navegador a la dirección local que informe el servidor del frontend. Compruebe que la pantalla de acceso cargue y que la API esté disponible.

Por configuración predeterminada, la API utiliza el puerto 3000 y su dirección base local es `http://localhost:3000/api/v1`. Si utiliza otro puerto o servidor, actualice las variables de entorno correspondientes.

## Variables de entorno

El archivo de ejemplo de la raíz contiene las variables necesarias para configurar el entorno local:

| Variable | Descripción |
|---|---|
| `POSTGRES_DB` | Nombre de la base de datos creada por Docker Compose. |
| `POSTGRES_USER` | Usuario de PostgreSQL. |
| `POSTGRES_PASSWORD` | Contraseña del usuario de PostgreSQL. |
| `DATABASE_HOST` | Dirección del servidor de base de datos utilizada por la API. |
| `DATABASE_PORT` | Puerto de conexión de PostgreSQL. |
| `DATABASE_NAME` | Nombre de la base de datos utilizada por la API. |
| `DATABASE_USER` | Usuario utilizado por la API para conectarse a PostgreSQL. |
| `DATABASE_PASSWORD` | Contraseña utilizada por la API para conectarse a PostgreSQL. |
| `API_PORT` | Puerto de escucha del backend. |
| `JWT_SECRET` | Clave privada para firmar los tokens de acceso. |
| `JWT_EXPIRES_IN` | Tiempo de vigencia de los tokens de acceso. |
| `VITE_API_URL` | Dirección base de la API utilizada por el frontend. |

No almacene credenciales reales, claves privadas ni archivos de configuración locales en el repositorio.

## Autenticación y perfiles de acceso

La plataforma utiliza autenticación basada en JWT. El usuario inicia sesión con sus credenciales y la API entrega un token de acceso que se utiliza para consultar los recursos protegidos.

Las operaciones principales de autenticación son:

- Registro de una cuenta inicial con perfil de asistente.
- Inicio de sesión y validación de credenciales.
- Consulta de la identidad asociada a la sesión activa.
- Cierre de sesión desde la interfaz.

La aplicación contempla los siguientes perfiles:

- `admin`: administración general.
- `veterinarian`: actividades propias del profesional veterinario.
- `assistant`: apoyo en los procesos habilitados.
- `receptionist`: actividades de recepción y gestión de atención.

El registro público no permite asignar perfiles privilegiados. La asignación inicial del perfil administrador debe realizarse mediante un procedimiento controlado por una persona autorizada y directamente sobre la base de datos. Las credenciales y el token nunca deben exponerse en la interfaz pública ni en el repositorio.

## Módulos funcionales

### Propietarios

Permite registrar, consultar, actualizar y eliminar la información de los propietarios de las mascotas.

### Mascotas

Permite registrar y administrar mascotas, asociarlas con sus propietarios y consultar la información registrada.

### Citas

Permite programar, consultar y actualizar citas veterinarias, así como gestionar sus estados. El backend valida los cambios permitidos y revisa los cruces de horarios activos para una misma mascota.

### Historias clínicas

Permite registrar y consultar información clínica asociada a las mascotas, además de filtrar los registros por mascota. La historia clínica se conserva para facilitar la trazabilidad de la atención.

### Tratamientos y controles

Permite registrar tratamientos asociados a una mascota, consultar su información, registrar controles de seguimiento y actualizar su estado a activo, completado o cancelado.

### Inventario

Permite administrar productos e insumos, registrar movimientos de entrada, salida y ajuste, consultar existencias y detectar productos cuyo stock se encuentra por debajo del mínimo establecido.

### Informes e indicadores

Presenta indicadores y resúmenes construidos a partir de la información disponible en los módulos de la plataforma, para apoyar el seguimiento administrativo y operativo.

## Referencia de servicios de la API

La dirección base de los servicios es `/api/v1`.

| Área | Operaciones disponibles |
|---|---|
| Estado del servicio | Consulta del estado de salud de la API. |
| Propietarios | Registro, listado, consulta individual, actualización y eliminación. |
| Mascotas | Registro, listado, consulta individual, filtrado por propietario, actualización y eliminación. |
| Historias clínicas | Registro, listado, consulta individual y filtrado por mascota. |
| Citas | Registro, listado, consulta individual, filtrado por fechas, actualización y cambio de estado. |
| Tratamientos | Registro, listado, consulta individual, filtrado por mascota, creación de controles y actualización de estado. |
| Inventario | Gestión de productos y movimientos de existencias desde el módulo de inventario. |
| Informes | Consulta de indicadores y resúmenes desde el módulo de informes. |

Los estados de las citas contemplan: `scheduled`, `confirmed`, `completed`, `cancelled` y `no_show`. Los estados de los tratamientos contemplan: `active`, `completed` y `cancelled`.

## Verificación del proyecto

Antes de considerar lista una versión, realice las siguientes verificaciones:

1. Confirme que las dependencias se instalaron correctamente.
2. Compruebe que PostgreSQL esté disponible y que las migraciones se hayan aplicado sin errores.
3. Verifique que el backend inicie y responda a la consulta de estado.
4. Verifique que el frontend cargue y pueda comunicarse con la API.
5. Compruebe el inicio y cierre de sesión.
6. Ejecute las pruebas automatizadas disponibles para el backend.
7. Genere las compilaciones de producción del backend y del frontend y revise que finalicen correctamente.
8. Ejecute los casos de prueba funcionales de cada módulo y conserve las evidencias.

La matriz de pruebas debe registrar fecha de ejecución, versión evaluada, responsable, datos utilizados, resultado esperado, resultado obtenido, estado, defectos encontrados, correcciones y evidencia. No marque una prueba como aprobada si no fue ejecutada y verificada.

## Alcance y limitaciones

PetClinic Cloud es un prototipo funcional de carácter académico para organizar información administrativa y clínica veterinaria. No realiza diagnósticos veterinarios automáticos, no prescribe tratamientos de forma autónoma y no sustituye el criterio de un profesional veterinario.

El alcance actual no contempla facturación electrónica, pagos reales ni integraciones obligatorias con plataformas veterinarias externas. Para las demostraciones y pruebas se deben utilizar datos ficticios o debidamente anonimizados.

La compilación correcta y la aprobación de pruebas funcionales no demuestran por sí solas que el sistema esté listo para producción ni permiten asignar automáticamente un nivel de madurez tecnológica (TRL). Cualquier nivel TRL debe justificarse con evidencias del prototipo integrado, el entorno de validación, los resultados de las pruebas y los criterios definidos por el curso y el tutor.

## Información del repositorio

- **Repositorio:** SebastianFajardo/PetClinic.
- **Rama de trabajo:** `develop/petclinic-cloud`.
- **Aplicación desplegada:** https://petclinic-seven.vercel.app/
