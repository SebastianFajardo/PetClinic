# Diagnóstico de brechas — Fase 4 PetClinic Cloud

**Fecha de corte:** 19 de noviembre de 2026  
**Fuentes revisadas:**
- Guía de aprendizaje para el desarrollo del componente práctico — Fase 4, Proyecto de grado 202016907, 6 páginas.
- PetClinic_Cloud_Documento_Unificado_Fase4.pdf, 41 páginas.
- Repositorio GitHub `SebastianFajardo/PetClinic`, ramas `main` y `develop/petclinic-cloud`.

## 1. Requisitos comprobables de la guía

La guía establece como evidencias grupales:

1. Documento maestro ajustado con las recomendaciones del tutor y ampliado con las etapas de la metodología ágil.
2. Diseño integral y desarrollo de un prototipo funcional con TRL 5 como mínimo.
3. Código fuente publicado en GitHub, con acceso de lectura para el tutor.
4. Un único video de máximo 10 minutos sobre el manejo y funcionamiento del prototipo. Los participantes deben mantener la cámara encendida y aparecer durante toda la socialización.

La guía también solicita revisar los requisitos de la actividad, participar en el foro y entregar un solo documento maestro por proyecto. No define en sus seis páginas una lista cerrada de diagramas UML ni una matriz de casos de prueba con identificadores concretos.

## 2. Estado verificado del repositorio

- Repositorio: `https://github.com/SebastianFajardo/PetClinic`.
- Visibilidad observada: privado.
- Rama predeterminada: `main`.
- Rama de trabajo disponible: `develop/petclinic-cloud`.
- Al iniciar esta revisión, `develop/petclinic-cloud` estaba 3 commits adelante y 1 detrás de `main`. Después de añadir este diagnóstico, quedó 4 commits adelante y 1 detrás. Las ramas siguen divergidas; no se realizó merge ni se modificó `main`.
- Commit de partida observado antes de este diagnóstico: `d5d06499258e5391b2f8664269ab4ad49e9f0d50`. Commit que registra este diagnóstico: `ebdb0bad9b0205a5eaf15310e5663a4cad53a7b9`.
- El árbol contiene backend NestJS, frontend React/Vite, configuración de PostgreSQL con TypeORM, migraciones y módulos de autenticación, propietarios, mascotas, historias clínicas, citas, tratamientos e inventario.
- La interfaz de informes está presente en el frontend. En el árbol revisado no aparece un módulo backend independiente llamado `reports`; debe verificarse que los indicadores se alimenten correctamente de los servicios existentes.
- Hay pruebas Jest de dominio en varios módulos del backend.
- Existe un flujo de GitHub Actions en `.github/workflows/ci.yml`. Las últimas ejecuciones consultadas terminaron con `startup_failure`; la consulta de trabajos devolvió una lista vacía. No se pudo establecer la causa ni confirmar una compilación o ejecución de pruebas en CI.
- No se encontró `package-lock.json` en el árbol consultado. El flujo de CI usa `npm install`, por lo que la instalación no está fijada mediante un lockfile versionado.
- Se encontró `apps/web/tsconfig.tsbuildinfo` versionado, que debe revisarse como posible artefacto generado.

### Tecnologías observadas en la implementación

| Componente | Implementación observada |
|---|---|
| Backend | NestJS y TypeScript |
| Frontend | React, TypeScript y Vite |
| Base de datos | PostgreSQL |
| Persistencia | TypeORM |
| Autenticación | JWT y bcryptjs |
| Infraestructura local | Docker Compose |
| Pruebas backend | Jest |

Estas tecnologías se describen como estado del repositorio. La decisión debe reflejarse en el documento maestro para reemplazar las propuestas tecnológicas que ya no coinciden con el código.

## 3. Brechas entre el documento maestro y el estado actual

| Prioridad | Tema | Evidencia encontrada | Trabajo pendiente |
|---|---|---|---|
| Crítica | Selección tecnológica | El documento todavía propone Node.js, Express y MongoDB Atlas, y deja la selección como pendiente. El repositorio utiliza NestJS, React, PostgreSQL y TypeORM. | Actualizar arquitectura, marco tecnológico, modelo de datos, estructura e instrucciones con las tecnologías realmente implementadas. |
| Crítica | Estado del prototipo | En la sección TRL el documento afirma que el prototipo no ha sido construido. El repositorio ya contiene una implementación modular. | Reemplazar esa afirmación por un estado verificable módulo por módulo, sin declarar validación que aún no esté evidenciada. |
| Crítica | Pruebas | La matriz contiene CP01–CP08, todos pendientes. No aparece CP09 en el documento consultado. | Ejecutar los casos, registrar fecha, versión, responsable, datos de prueba, resultado real, defectos y evidencia. Definir CP09 solo cuando exista un escenario concreto y verificable. |
| Crítica | TRL 5 | El documento deja el nivel pendiente y no aporta evidencia de validación en un entorno pertinente. | Integrar el prototipo, describir el entorno de validación y recopilar resultados reproducibles. No declarar TRL 5 hasta contar con esa evidencia y contrastarla con la orientación del tutor. |
| Alta | Cronograma | La sección 12 sigue siendo un cronograma propuesto de siete etapas y reconoce que debe ajustarse al periodo real. | Sustituir las actividades futuras por actividades efectivamente realizadas, fechas reales, responsables, incrementos y evidencias. |
| Alta | Metodología ágil | El documento describe Scrum, artefactos y definición de terminado, pero el contenido está redactado principalmente como plan. | Registrar los Sprints realmente ejecutados: objetivo, backlog, tareas, revisión, retrospectiva, incremento, acuerdos y commits asociados. |
| Alta | Requisitos y trazabilidad | RF01–RF11, RNF01–RNF08 y HU01–HU06 aparecen como especificación preliminar. | Relacionar cada requisito con módulo implementado, criterio de aceptación, caso de prueba y evidencia. Marcar como no implementado lo que no esté comprobado. |
| Alta | GitHub | El documento conserva el texto “PENDIENTE DE CREAR Y PEGAR”, aunque el repositorio ya existe y es privado. | Incorporar el enlace real y comprobar que el tutor tenga acceso de lectura. La autorización del tutor no se pudo verificar desde el repositorio. |
| Alta | Video | El documento conserva el enlace pendiente. | Grabar la demostración con duración máxima de 10 minutos y cámaras encendidas durante toda la socialización; después incorporar el enlace real. |
| Media | Integración de informes | Hay pantalla de informes en el frontend, pero no se observó un módulo backend independiente de reportes. | Comprobar que cada indicador se calcule con datos persistidos y documentar su fuente. |
| Media | Reproducibilidad | No se encontró lockfile y CI no está validando los cambios. | Recuperar la ejecución de CI y fijar las dependencias mediante el lockfile del gestor utilizado, después de comprobar la instalación. |

## 4. Instrumento y diagnóstico de necesidades

El documento conserva un cuestionario de 18 preguntas y plantea una muestra no probabilística por conveniencia de al menos 30 participantes. En el contenido revisado no se encontraron tablas de resultados, frecuencias, porcentajes ni análisis de respuestas que permitan afirmar que la aplicación del instrumento ya se completó.

No se deben inventar participantes, resultados de encuesta, observaciones ni conclusiones empíricas. Si el diagnóstico ya se realizó, se necesita incorporar la base anonimizada y sus resultados verificables.

## 5. Estado académico que puede afirmarse a la fecha

- La guía oficial y el documento maestro están disponibles y fueron revisados.
- Existe un repositorio con una implementación que incluye varios módulos funcionales y pruebas de dominio.
- El documento maestro todavía contiene afirmaciones y pendientes que no corresponden al estado actual del repositorio.
- No se confirmó una ejecución exitosa de CI en las últimas ejecuciones consultadas.
- No se dispone en las fuentes revisadas de resultados reales de la matriz CP01–CP08, de un CP09 documentado, de validación en un entorno pertinente para TRL 5, de autorización de lectura del tutor ni del enlace del video.

**Conclusión:** hay una base de software implementada, pero la evidencia académica está desactualizada y no permite declarar cumplido el TRL 5 ni la entrega integral de Fase 4.

## 6. Orden recomendado de trabajo

1. Actualizar el documento maestro para que arquitectura y tecnologías coincidan con el repositorio.
2. Recuperar CI y ejecutar compilaciones y pruebas automatizadas.
3. Construir la trazabilidad RF/RNF/HU → módulo → caso de prueba → evidencia.
4. Ejecutar CP01–CP08 y completar la matriz con resultados reales; definir y ejecutar CP09 si el equipo confirma un noveno escenario requerido.
5. Actualizar el cronograma con actividades ya realizadas, fechas, responsables y commits verificables.
6. Preparar la validación integrada en un entorno pertinente y evaluar el nivel TRL con evidencias.
7. Verificar el acceso de lectura del tutor y agregar el enlace real del repositorio al documento.
8. Grabar el video solicitado y agregar el enlace real.

## 7. Límites de esta revisión

Esta revisión fue documental y de lectura del repositorio. No se ejecutaron compilaciones, pruebas locales, migraciones, pruebas de aceptación ni validaciones con usuarios durante esta ejecución. Las ejecuciones de GitHub Actions consultadas terminaron en error de inicio y no expusieron trabajos para inspeccionar. Por tanto, los estados de pruebas y TRL permanecen sin validar.
