# Schema SQLite — Recorrida Holística

Base de datos local: `perennia.db` (expo-sqlite)
Fuente: `db/schema.ts`

## Tablas readonly (descargadas de Supabase)

### dc_capa_gis
Capas GIS del establecimiento.

| Columna | Tipo | Notas |
|---------|------|-------|
| id | TEXT PK | UUID |
| id_establecimiento | TEXT NOT NULL | FK lógica a public.establecimientos |
| nombre | TEXT NOT NULL | |
| tipo | TEXT NOT NULL | Tipo de capa (lotes, ambientes, etc.) |
| geojson | TEXT NOT NULL | FeatureCollection GeoJSON |
| metadata | TEXT | JSON opcional |
| campo_esquema | TEXT | Schema de campos personalizados |
| created_at, updated_at | TEXT | ISO timestamps |

### dc_lote
Lotes georreferenciados.

| Columna | Tipo | Notas |
|---------|------|-------|
| id | TEXT PK | UUID |
| id_establecimiento | TEXT NOT NULL | |
| capa_gis_id | TEXT | FK a dc_capa_gis |
| nombre_lote | TEXT NOT NULL | |
| geometry | TEXT NOT NULL | Polygon/MultiPolygon GeoJSON |
| has | REAL | Hectáreas |
| color | TEXT | Color hex para renderizado |
| estado | TEXT | 'activo' por defecto |
| reemplazado_por | TEXT | ID del lote que lo reemplaza |
| atributos | TEXT | JSON extensible '{}' |
| created_at | TEXT | |

### dc_ambiente
Ambientes dentro de lotes.

| Columna | Tipo | Notas |
|---------|------|-------|
| id | TEXT PK | UUID |
| lote_id | TEXT FK → dc_lote | |
| id_establecimiento | TEXT NOT NULL | |
| nombre | TEXT NOT NULL | |
| geometry | TEXT NOT NULL | |
| has | REAL NOT NULL | |
| color | TEXT | |
| estado | TEXT | 'activo' |
| atributos | TEXT | '{}' |
| created_at | TEXT | |

### dc_ambiente_lote
Vista materializada: intersección ambiente × lote.

| Columna | Tipo | Notas |
|---------|------|-------|
| id | TEXT PK | |
| id_establecimiento | TEXT NOT NULL | |
| lote_id, ambiente_id | TEXT NOT NULL | |
| nombre_ambiente, nombre_lote | TEXT NOT NULL | Desnormalizados |
| geometry | TEXT NOT NULL | Intersección geométrica |
| has | REAL NOT NULL | |
| porcentaje_lote | REAL NOT NULL | % del lote que ocupa |
| color | TEXT | |
| created_at | TEXT | |

### dc_tarea_tipo
Configuración de tipos de tarea (define el formulario dinámico).

| Columna | Tipo | Notas |
|---------|------|-------|
| id | TEXT | PK compuesta (id, version) |
| nombre | TEXT NOT NULL | |
| nivel | TEXT NOT NULL | 'lote', 'ambiente', o 'libre' |
| version | INTEGER NOT NULL | Versionado del schema del form |
| orden | INTEGER | Orden de display |
| campos | TEXT NOT NULL | JSON: CampoConfig[] |
| subtarea_campos | TEXT | JSON: CampoConfig[] o null |
| subtarea_config | TEXT | JSON: { label, minimo, unidad_default } |
| estado | TEXT | 'activo' |
| created_at, updated_at | TEXT | |

### dc_tarea_tipo_servicio
Mapeo: qué tipos de tarea aplican a qué tipos de servicio.

| Columna | Tipo | Notas |
|---------|------|-------|
| tarea_tipo_id | TEXT | PK compuesta |
| tarea_tipo_version | INTEGER | |
| servicio_tipo | TEXT | |
| auto_generar | INTEGER | 1 = crear automáticamente al iniciar recorrida |

### dc_servicio
Servicios/agendas descargados del BackOffice.

| Columna | Tipo | Notas |
|---------|------|-------|
| id_servicio | TEXT PK | |
| id_establecimiento | TEXT | |
| nombre_establecimiento | TEXT | Desnormalizado |
| servicio | TEXT | Tipo de servicio |
| fecha, fecha_fin | TEXT | |
| estado_trabajo | INTEGER | |
| educadores | TEXT | JSON array |
| downloaded_at | TEXT | Timestamp de descarga |

## Tablas editables (creadas en campo)

### dc_recorrida
Recorrida de campo (sesión de trabajo).

| Columna | Tipo | Notas |
|---------|------|-------|
| id | TEXT PK | UUID generado localmente |
| id_establecimiento | TEXT NOT NULL | |
| id_servicio | TEXT | FK lógica a dc_servicio |
| educador_id | INTEGER | FK a public.educadores |
| capa_gis_id | TEXT | Capa GIS activa |
| nombre | TEXT | Auto-generado por `generarNombreRecorrida()` |
| fecha | TEXT NOT NULL | ISO date |
| observaciones_generales | TEXT | |
| estado | TEXT | 'en_curso' por defecto |
| created_at, updated_at | TEXT | Auto datetime('now') |

### dc_tarea
Tarea individual dentro de una recorrida.

| Columna | Tipo | Notas |
|---------|------|-------|
| id | TEXT PK | UUID |
| recorrida_id | TEXT FK → dc_recorrida | |
| tarea_tipo_id | TEXT NOT NULL | Referencia a dc_tarea_tipo |
| lote_id | TEXT FK → dc_lote | Null para tareas 'libre' |
| ambiente_id | TEXT | |
| estado | TEXT | sin_iniciar / en_curso / completa |
| datos | TEXT | JSON flexible ('{}') |
| titulo | TEXT | Solo para tareas 'libre' |
| tags | TEXT | JSON array |
| origen | TEXT | 'campo' o 'backoffice' |
| id_establecimiento | TEXT NOT NULL | |
| form_version | INTEGER | Versión del formulario usado |
| orden | INTEGER | |
| gps_lat, gps_lng | REAL | Ubicación al guardar |
| gps_accuracy | REAL | Precisión GPS en metros |
| gps_objetivo_lat, gps_objetivo_lng | REAL | Coordenadas destino (navegación) |
| created_at, updated_at | TEXT | Auto |

### dc_subtarea
Mediciones/muestras repetibles dentro de una tarea.

| Columna | Tipo | Notas |
|---------|------|-------|
| id | TEXT PK | UUID |
| tarea_id | TEXT FK → dc_tarea | |
| datos | TEXT | JSON '{}' |
| gps_lat, gps_lng | REAL | Ubicación de la muestra |
| gps_accuracy | REAL | |
| created_at | TEXT | |

### dc_foto
Fotos de campo asociadas a tareas.

| Columna | Tipo | Notas |
|---------|------|-------|
| id | TEXT PK | UUID |
| tarea_id | TEXT | FK lógica a dc_tarea |
| local_uri | TEXT | Path local en dispositivo |
| storage_path | TEXT | Path en Supabase Storage |
| descripcion | TEXT | |
| created_at | TEXT | |

## Tablas de infraestructura

### sync_queue
Cola de sincronización offline → Supabase.

| Columna | Tipo | Notas |
|---------|------|-------|
| id | TEXT PK | UUID |
| entity | TEXT NOT NULL | Nombre de tabla (dc_recorrida, etc.) |
| entity_id | TEXT NOT NULL | ID del registro |
| operation | TEXT NOT NULL | 'upsert' |
| payload | TEXT | JSON del registro completo |
| status | TEXT | 'pending', 'dead' |
| attempts | INTEGER | Contador de reintentos |
| next_retry_at | TEXT | Backoff: 30s, 2m, 10m, 30m, 1h |
| last_error | TEXT | Último error |
| id_establecimiento | TEXT | Para sync por establecimiento |
| created_at | TEXT | |

### settings
Key-value store para configuración local.

| Columna | Tipo | Notas |
|---------|------|-------|
| key | TEXT PK | |
| value | TEXT | |

## Índices

| Índice | Tabla | Columna(s) |
|--------|-------|------------|
| idx_capa_gis_estab | dc_capa_gis | id_establecimiento |
| idx_capa_gis_tipo | dc_capa_gis | tipo |
| idx_lote_estab | dc_lote | id_establecimiento |
| idx_ambiente_lote_id | dc_ambiente | lote_id |
| idx_amb_lote_estab | dc_ambiente_lote | id_establecimiento |
| idx_amb_lote_lote | dc_ambiente_lote | lote_id |
| idx_amb_lote_amb | dc_ambiente_lote | ambiente_id |
| idx_tarea_recorrida | dc_tarea | recorrida_id |
| idx_tarea_lote | dc_tarea | lote_id |
| idx_tarea_tipo | dc_tarea | tarea_tipo_id |
| idx_subtarea_tarea | dc_subtarea | tarea_id |
| idx_foto_tarea | dc_foto | tarea_id |
| idx_sync_status | sync_queue | status |
