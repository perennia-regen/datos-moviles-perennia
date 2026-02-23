# ADR 001: Historial de lotes y ambientes — inmutabilidad condicional

## Estado

Aceptada — 2026-02-21

## Contexto

Las geometrías de lotes y ambientes cambian con el tiempo: reimportaciones de shapefiles, subdivisiones, correcciones manuales. En la implementación original, las ediciones eran destructivas:

- `actualizarGeometriaLote` hacía UPDATE directo sobre la geometría
- `eliminarLotesEstablecimiento` hacía hard delete de todos los lotes
- `eliminarCapaGis` borraba en cascada lotes y ambientes

Las mediciones (`dc_medicion`) tienen FK directa a `dc_lote(id)`. Si un lote cambia de forma o se borra, el contexto histórico de las mediciones se corrompe: ya no podemos saber "cómo era el mapa cuando se tomó esta medición".

### Referencia: Ruuts

El proyecto Ruuts (API + mobile) resuelve esto con:
- **Shadow tables** (`paddocksHistory`): triggers que copian el estado anterior a una tabla espejo ante cada UPDATE/DELETE
- **`FarmSubdivision`**: snapshot anual que congela los `paddockIds` de una campaña
- **`CarbonInstance.paddocks`**: JSON desnormalizado con snapshot completo de paddocks al momento de la instancia
- **Soft delete**: los paddocks nunca se borran, solo se marcan como eliminados

Perennia tiene un modelo más simple (sin campañas anuales ni instancias de carbono), por lo que una implementación más liviana es suficiente.

## Decision

**Inmutabilidad condicional**: los lotes son inmutables solo si tienen mediciones asociadas.

### Mecanismos implementados

1. **`dc_lote.estado`** (`activo` | `archivado`): los lotes con mediciones se archivan en vez de borrarse. Los queries de lotes activos filtran por `estado = 'activo'`.

2. **`dc_lote.reemplazado_por`** (FK a `dc_lote.id`): cuando se edita la geometría de un lote con mediciones, se crea un lote nuevo y el viejo apunta al nuevo via esta columna. Esto permite trazar la cadena de versiones.

3. **Trigger `trg_prevent_lote_delete`**: previene hard delete de lotes con mediciones a nivel de base de datos. Fuerza el uso de `estado = 'archivado'`.

4. **`dc_recorrida.capa_gis_id`** (FK a `dc_capa_gis.id`): cada recorrida registra qué versión del mapa de lotes se usó. Permite reconstruir "el mapa vigente al momento del servicio".

5. **Snapshots desnormalizados en `dc_medicion`**:
   - `lote_nombre_snapshot`: nombre del lote al momento de la medición
   - `lote_has_snapshot`: hectáreas al momento de la medición
   - `ambiente_nombre_snapshot`: nombre del ambiente al momento de la medición

   Estos campos permiten mostrar datos históricos incluso si el lote original fue archivado o renombrado.

6. **`dc_ambiente.estado`**: mismo patrón que lotes, para ambientes.

### Reglas de negocio

| Acción | Sin mediciones | Con mediciones |
|--------|---------------|----------------|
| Editar geometría | UPDATE directo | Archivar viejo + crear nuevo |
| Eliminar lote | DELETE directo | Archivar (`estado = 'archivado'`) |
| Reimportar shapefile | INSERT nuevos lotes | INSERT nuevos + archivar anteriores |
| Eliminar todos los lotes | DELETE | Archivar todos los activos |

## Alternativas consideradas

### A. Shadow tables (patrón Ruuts)
Triggers automáticos que copian cada estado anterior a tablas `*_history`. Descartada por complejidad de mantener triggers tanto en PostgreSQL como en SQLite (offline-first). Además, Perennia no necesita historial granular de cada edición, solo preservar el estado al momento de las mediciones.

### B. Snapshots JSON completos (patrón CarbonInstance)
Guardar un JSON con todos los lotes al crear una recorrida. Descartada por duplicación excesiva de datos (geometrías GeoJSON son pesadas) y por no escalar bien con muchos lotes.

### C. Versionado temporal (valid_from / valid_to)
Agregar timestamps de vigencia a cada lote. Descartada por complejidad de queries (todos los SELECT necesitarían filtro temporal) y por no aportar valor adicional sobre la inmutabilidad condicional.

## Consecuencias

### Positivas
- Las mediciones históricas mantienen su contexto geográfico intacto
- El técnico de campo no percibe complejidad adicional (la app solo muestra lotes activos)
- Compatible con el modelo offline-first (SQLite replica el patrón sin triggers)
- Crecimiento gradual de datos (solo se acumulan lotes archivados cuando hay reimportaciones)

### Negativas
- Los queries de lotes activos necesitan filtro `estado = 'activo'` (ya aplicado en `fetchLotes`, `fetchAmbientes`, `downloadEstablecimientoData`)
- `eliminarLotesEstablecimiento` cambia de semántica: archiva en vez de borrar, y ya no limpia capas GIS (se mantienen como historial)
- Los lotes archivados ocupan espacio en la base (aceptable dado el volumen esperado)

## Archivos afectados

- `supabase/migrations/20260221_datos_campo_historial_lotes.sql`
- `perennia-app/db/schema.ts` (DDL + migraciones incrementales)
- `perennia-app/db/operations.ts` (filtro `estado = 'activo'` en download)
- `perennia-app/app/(app)/servicio/[id].tsx` (`capa_gis_id` en recorrida)
- `perennia-app/app/(app)/medicion/nueva.tsx` (snapshots)
- `BackOffice/web/src/lib/queries/capas-gis.ts` (6 funciones refactorizadas)
- `BackOffice/web/src/types/datos-campo.ts` (campos `estado`, `reemplazado_por`)
