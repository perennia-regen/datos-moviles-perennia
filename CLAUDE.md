# Recorrida Holística - App Móvil Perennia

## Qué es

App de campo para técnicos de Perennia. Permite realizar recorridas georreferenciadas en establecimientos agropecuarios: recolectar datos de pastoreo, forraje, fotos, y sincronizarlos con el BackOffice.

**Stack**: Expo 54 (managed) + React Native 0.81 + TypeScript + SQLite + Supabase

## Estructura del proyecto

```
perennia-app/
├── app/                    # Expo Router (file-based routing)
│   ├── _layout.tsx         # Root layout
│   ├── (auth)/             # Login
│   └── (app)/              # App principal
│       ├── index.tsx       # Dashboard
│       ├── establecimientos.tsx
│       ├── sync.tsx
│       ├── establecimiento/[id].tsx
│       ├── servicio/[id].tsx
│       ├── recorrida/[id].tsx
│       ├── tarea/[id].tsx
│       └── navegacion/[id].tsx
├── components/             # Componentes por dominio
│   ├── map/                # Mapa y capas GIS
│   ├── recorrida/          # Componentes de recorrida
│   └── tarea/              # Componentes de tarea
├── hooks/                  # Hooks custom
│   ├── useEducador.ts      # Auth/sesión del educador
│   ├── useLocation.ts      # GPS tracking
│   ├── useHeading.ts       # Brújula/heading
│   └── useOfflineSync.ts   # Cola de sync
├── lib/                    # Utilidades
│   ├── supabase.ts         # Cliente Supabase
│   ├── geo.ts              # Helpers geoespaciales
│   └── reports.ts          # Generación de reportes
├── db/                     # SQLite
│   ├── schema.ts           # DDL + migraciones
│   ├── operations.ts       # CRUD helpers
│   └── sync.ts             # Lógica de sincronización
└── constants/              # Tema, config
```

## Datos y sincronización

### SQLite local (offline-first)
- Prefijo `dc_` en todas las tablas (datos_campo)
- Schema completo en `db/schema.ts` y documentado en `docs/schema.md`
- Tablas readonly (se descargan de Supabase): `dc_capa_gis`, `dc_lote`, `dc_ambiente`, `dc_ambiente_lote`, `dc_tarea_tipo`, `dc_tarea_tipo_servicio`, `dc_servicio`
- Tablas editables (se crean en campo): `dc_recorrida`, `dc_tarea`, `dc_subtarea`, `dc_foto`
- `sync_queue`: cola de operaciones pendientes con retry exponencial

### Supabase remoto
- Schema: `datos_campo` en proyecto `fkrppgqtlgoxnonohenu`
- UUID (Supabase) ↔ TEXT (SQLite) — conversión transparente
- JSONB (Supabase) ↔ TEXT JSON (SQLite)

## Convenciones

### Código
- Kebab-case para archivos: `comment-card.tsx`
- Componentes en `components/`, NUNCA en `app/`
- Inline styles (no StyleSheet.create ni Tailwind)
- `process.env.EXPO_OS` en vez de `Platform.OS`
- Soft limit 500 líneas, hard limit 800 por archivo

### Rutas (Expo Router)
- Grupos con paréntesis: `(auth)/`, `(app)/`
- Rutas dinámicas con brackets: `[id].tsx`
- Siempre usar `_layout.tsx` para definir stacks
- `useLocalSearchParams` para params

### Formularios
- **react-hook-form** es el default para todos los formularios (excepto inputs triviales como un solo campo de búsqueda)
- Patrón: `useForm` en el screen, `Controller` en componentes, `useFieldArray` para listas dinámicas
- Loading/saving states se quedan como `useState` (no son form data)
- Wizard/stepper: `step` como `useState`, selecciones con `setValue` de RHF, validación por paso con `trigger`

### Formularios dinámicos
- Los tipos de tarea (`dc_tarea_tipo`) definen el schema del formulario via `campos` JSON
- Tipos soportados: `text`, `textarea`, `numeric`, `date`, `chips`, `chips_multi`, `fotos`
- Los datos se guardan en `dc_tarea.datos` como JSON flexible
- `DynamicForm` recibe `control` de RHF y usa `Controller` por campo con name `datos.{key}`

### Testing
- Al implementar/modificar una función, agregar o actualizar sus tests
- Al fixear un bug, agregar un test de regresión primero (red → green)
- Ubicación: `__tests__/` colocados junto al módulo (ej: `lib/__tests__/geo.test.ts`)
- Naming: `<module>.test.ts` matching el archivo fuente
- Funciones puras: testar directo, sin mocks
- Funciones con DB: mock `@/db/schema` y `expo-sqlite` (ver `jest-setup.ts`)
- Funciones con Supabase: mock `@/lib/supabase` inline en el test
- Correr `npm test` antes de dar por terminado el trabajo

### Documentación
- Mantener `docs/` para documentación del proyecto
- `docs/schema.md`: referencia del schema SQLite
- Al agregar hook/util/componente nuevo, incluir JSDoc con `@param`, `@returns`, `@example`
- Al tomar decisiones arquitectónicas, documentar en `docs/`
- Mantener la sección `## Estructura del proyecto` en CLAUDE.md actualizada

## Permisos nativos requeridos

GPS (always + when in use), Cámara, Galería, Face ID/Biometría, Notificaciones

## Skills disponibles

| Skill | Descripción |
|-------|-------------|
| `building-native-ui` | Expo UI: routing, styling, navigation, animaciones |
| `native-data-fetching` | Networking, React Query, offline, auth |
| `expo-api-routes` | API routes con Expo Router |
| `expo-deployment` | EAS Build, TestFlight, Play Store |
| `expo-cicd-workflows` | CI/CD con EAS Workflows |
| `perennia-recorrida` | Dominio específico: recorridas, tareas, sync, GIS |

## Tipos Supabase

Tipos generados para schemas `public` + `datos_campo` en `perennia-app/types/database.ts`.

**Regenerar después de cambios en DB:**
```bash
./scripts/gen-types.sh
```

El cliente tipado y los type helpers están en `lib/supabase.ts`:
- `supabase` — cliente tipado (schema `public`)
- `datosCampo` — cliente tipado (schema `datos_campo`)
- `DcRecorrida`, `DcTarea`, `DcSubtarea`, `DcFoto`, etc. — Row types de datos_campo

## Verificación

```bash
cd perennia-app && npm test             # Tests (Jest)
cd perennia-app && npx tsc --noEmit     # Typecheck
cd perennia-app && npm run lint         # ESLint
cd perennia-app && npx expo start       # Dev server (Expo Go primero)
```

## Relación con BackOffice

- Supabase compartido (schema `public` para BackOffice, `datos_campo` para esta app)
- El BackOffice gestiona establecimientos, servicios, educadores
- Esta app consume esos datos y produce recorridas/tareas que se sincronizan de vuelta
- Documentación del BackOffice: `/Users/pablo/Documents/BackOffice/`
