# Proceso de Vibe Coding — FocusFlow

Este documento registra cómo se construyó FocusFlow usando IA (**Claude Code**, modelo Claude Opus) como copiloto principal: prompts, iteraciones, decisiones técnicas y problemas resueltos.

---

## 1. Concepción del proyecto

Antes de escribir código se redactaron dos documentos de contexto que la IA usó como especificación:

- **`context.md`** — enunciado de la actividad (requisitos técnicos y entregables).
- **`implementacion.md`** — plan: temática *FocusFlow*, paleta pastel, rutas, árbol de archivos y fases con sus commits.

Con esto la IA tenía un objetivo claro y verificable, en lugar de generar código "a ciegas".

---

## 2. Prompts principales

### Prompt 1 — Arranque del proyecto

> *"En este proyecto ya se ha creado un context.md y un implementacion.md. Crea el proyecto usando las mejores prácticas de código, usando SOLID y además de usar buenos patrones de diseño evitando el código espagueti, adelante."*

La IA leyó ambos documentos, generó el proyecto con `create-next-app@16` y, **antes de escribir código**, consultó la documentación incluida en `node_modules/next/dist/docs/`, porque Next.js 16 trae cambios importantes (Cache Components activado por defecto, `retry` en lugar de `reset` en `error.tsx`, `connection()`/`io()`, `RouteContext`).

### Sub-tareas derivadas del prompt 1

La IA dividió la petición en pasos verificables. Si haces nuevas iteraciones, añade aquí tus prompts siguiendo el mismo formato.

| # | Instrucción | Resultado |
| --- | --- | --- |
| 2 | "Define primero el dominio y los puertos; los servicios no deben conocer HTTP ni el almacenamiento." | `src/domain` puro + interfaces `TaskRepository`, `FocusSessionRepository`, `ArticleProvider`, `Clock`, `IdGenerator`. |
| 3 | "Centraliza la creación de dependencias en un único lugar." | `server/container.ts` como composition root. |
| 4 | "Los Route Handlers no deben repetir try/catch." | HOF `withErrorHandling` + envelope `{ data } / { error }`. |
| 5 | "Los Server Components deben leer datos directamente, sin hacer fetch a su propia API." | `server/queries.ts`; los Client Components usan los Route Handlers. |
| 6 | "Verifica en un navegador real: crear, completar, filtrar, Pomodoro, explorar, móvil." | Pruebas E2E con Playwright contra el build de producción (ver §5). |

---

## 3. Iteraciones por fase (historial de commits)

| Fase | Commit | Contenido |
| --- | --- | --- |
| 1 | `chore: initialize Next.js 16 TypeScript project…` | Scaffold, tokens de color en `@theme`, Arial, `.env.example`. |
| 2 | `feat(api): add Next.js route handlers…` | Dominio, repositorios, servicios, adaptador DEV.to, Route Handlers. Probados con `curl` (CRUD, validaciones 400, 404, 204). |
| 3 | `feat(ui): implement responsive layout…` | Primitivas UI, `Navbar` responsive, `Footer`, `loading`, `error`, `global-error`, `not-found`. |
| 4 | `feat(pages): build dashboard, tasks, explore…` | Hooks, componentes por funcionalidad y las 4 páginas. |
| 4b | `fix(api): map domain errors by code…` | Corrección detectada al probar escenarios de error (ver §4.3). |
| 5 | `docs: add README… and VIBE_CODING…` | Documentación. |

---

## 4. Desafíos encontrados y cómo se resolvieron

### 4.1 Regla `react-hooks/set-state-in-effect`

El ESLint de Next 16 incluye las reglas nuevas de React Hooks. La primera versión de `useTasks` llamaba a `fetchTasks()` (que hace `setState`) dentro de `useEffect` y el lint la rechazó.

**Solución:** el efecto encadena la promesa y solo actualiza el estado cuando se resuelve, con un flag de cancelación para evitar actualizaciones tras desmontar. En `useArticles` el estado de carga se **deriva** (una etiqueta sin entrada en caché = cargando) en lugar de guardarse, y la meta diaria usa `useSyncExternalStore` para leer `localStorage` sin errores de hidratación.

### 4.2 `connection()` "tragado" por el manejador de errores

Con Cache Components, `connection()` lanza una señal interna durante el prerender. Como `withErrorHandling` capturaba *todo*, el build mostraba `HANGING_PROMISE_REJECTION` en `/api/stats`.

**Solución:** llamar a `unstable_rethrow(error)` antes de mapear el error, para dejar pasar las señales internas de Next.js. Se aplicó lo mismo en `FeaturedArticles`, que degrada con elegancia si DEV.to falla.

### 4.3 `instanceof` falla entre capas de bundle

Al simular una caída de DEV.to (`DEVTO_API_URL` inválida), `/api/articles` devolvía `500` en lugar de `502`. Los logs mostraron que el error **sí** era `EXTERNAL_SERVICE_ERROR`: Next.js empaqueta el mismo módulo en varias capas (RSC/SSR y Route Handlers), y el contenedor compartido vía `globalThis` lanzaba una clase de *otra* copia del módulo.

**Solución:** `isDomainError()` comprueba el error de forma estructural (por `code`) y los status HTTP salen de un mapa `STATUS_BY_CODE`. Esto también evitaba que un `404` se convirtiera en `500` según qué ruta inicializara el contenedor primero.

### 4.4 Datos en memoria vs. prerender

Con Cache Components, una lectura síncrona del almacén en memoria se habría congelado en el HTML estático durante el build. **Solución:** todas las lecturas de Server Components pasan por `server/queries.ts`, que llama a `connection()`, y las secciones dinámicas se envuelven en `<Suspense>` con skeletons (Partial Prerendering: shell estático + datos en streaming).

### 4.5 Fechas y la hidratación

Formatear fechas con la zona horaria local puede dar textos distintos en servidor y cliente. **Solución:** los formateadores de `lib/format.ts` usan `timeZone: "UTC"`, igual que las claves de día del dominio.

### 4.6 Rendimiento de la API externa

Cada cambio de etiqueta en `/explore` podía golpear DEV.to. **Solución:** caché de datos con `"use cache"` + `cacheLife` en el adaptador (compartida por páginas y Route Handlers) y caché por etiqueta en el cliente (`useArticles`), con `AbortController` para cancelar peticiones obsoletas.

---

## 5. Validación del código generado

Cada fase se validó antes de hacer commit:

- `npm run typecheck` y `npm run lint` sin errores.
- `npm run build` sin advertencias (rutas `◐` con Partial Prerender y `ƒ` para la API).
- Pruebas de API con `curl`: creación, actualización, validación (`400` con `issues` por campo), `404`, `204` en DELETE, `502` con DEV.to caído.
- Pruebas E2E con Playwright sobre el build de producción:
  - Crear, completar y filtrar tareas.
  - Ciclo Pomodoro completo (reloj simulado de 25 min) → sesión registrada y cambio automático a descanso.
  - Cambio de etiqueta en `/explore` (12 artículos de `#react`).
  - Meta diaria persistida, alta rápida en el dashboard con `router.refresh()`.
  - Menú móvil a 375 px sin scroll horizontal.
  - `error.tsx` visible con botón **Reintentar** cuando DEV.to no responde.
  - **0 errores de consola** (sin problemas de hidratación).
- Revisión visual con capturas: se detectó que las 4 tarjetas de KPIs quedaban apretadas en el dashboard y se añadió un layout `compact` de 2 columnas.

---

## 6. Decisiones técnicas

| Decisión | Motivo |
| --- | --- |
| Capa `domain/` sin dependencias de framework | Reglas (filtrar/ordenar tareas) reutilizables en servidor y cliente y fáciles de probar. |
| Repositorios **asíncronos** aunque sean en memoria | Permite cambiar a Supabase/Postgres sin romper el contrato (LSP). |
| `Clock` e `IdGenerator` inyectados | Los servicios son deterministas y testeables. |
| Validación manual en lugar de Zod | Menos dependencias; `IssueCollector` devuelve todos los errores por campo a la vez. |
| `/api/tasks/[id]` en vez de todo en `/api/tasks` | Diseño REST más claro que el plan original (desviación consciente de `implementacion.md`). |
| `/api/sessions` añadido | El Pomodoro necesita persistir sesiones para alimentar las métricas. |
| Gráficas en CSS puro renderizadas en servidor | Cero JavaScript extra en cliente y accesibles (`figcaption` para lectores de pantalla). |
| `server-only` en config, contenedor y adaptadores | Garantiza en build que la clave de DEV.to nunca llega al bundle del cliente. |
| `globalThis` para el contenedor | Una única instancia compartida entre páginas y Route Handlers, y que sobrevive al HMR. |

---

## 7. Lecciones aprendidas

1. **Dar contexto antes de pedir código**: `context.md` + `implementacion.md` hicieron que el resultado se ajustara a los requisitos a la primera.
2. **La IA debe consultar la documentación de la versión instalada**: Next.js 16 difiere de lo que muchos modelos conocen (`retry`, Cache Components, `RouteContext`).
3. **Validar siempre en ejecución real**: el bug de `instanceof` (§4.3) pasaba typecheck, lint y build; solo apareció al forzar un escenario de error.
4. **Commits pequeños por fase** facilitan revisar y revertir lo generado por la IA.
