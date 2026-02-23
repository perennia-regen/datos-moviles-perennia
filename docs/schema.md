# Schema de Base de Datos - Perennia App

## Diagrama de Relaciones

```
dc_tarea_tipo (definiciones de formulario, readonly)
  │
  └──→ dc_tarea_tipo_servicio (qué tipos aplican a qué servicios)

dc_servicio (agenda del BackOffice)
  │
  └──→ dc_recorrida (visita a campo)
         │
         └──→ dc_tarea (instancia de tarea)
                │
                ├──→ dc_subtarea (N registros hijos georreferenciados)
                └──→ dc_foto (fotos de la tarea)

dc_lote (polígonos de lotes)
  │
  ├──→ dc_tarea (tareas nivel lote)
  └──→ dc_ambiente_lote (intersecciones lote x ambiente)

dc_ambiente (polígonos de ambientes)
  │
  └──→ dc_tarea (tareas nivel ambiente)

dc_capa_gis (capas GeoJSON del BackOffice)

sync_queue (cola de sincronización offline)
settings (config local key-value)
```

---

## Tablas de Datos Geográficos

Estas tablas se descargan desde Supabase (schema `datos_campo`) al dispositivo local (SQLite).

### dc_capa_gis

Capas GIS completas (perímetro, lotes, ambientes como FeatureCollection). Descargadas del BackOffice.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | TEXT PK | UUID |
| id_establecimiento | TEXT NOT NULL | FK a establecimientos |
| nombre | TEXT NOT NULL | Nombre de la capa |
| tipo | TEXT NOT NULL | `perimetro` / `lotes` / `ambientes` |
| geojson | TEXT NOT NULL | GeoJSON FeatureCollection completo |
| metadata | TEXT | JSON con metadatos |
| campo_esquema | TEXT | JSON con schema de campos |
| created_at | TEXT | Timestamp |
| updated_at | TEXT | Timestamp |

### dc_lote

Polígonos de lotes del establecimiento. Se descargan de `datos_campo.dc_lote`.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | TEXT PK | UUID |
| id_establecimiento | TEXT NOT NULL | FK a establecimientos (Supabase public) |
| capa_gis_id | TEXT | FK a dc_capa_gis (capa de origen) |
| nombre_lote | TEXT NOT NULL | Nombre descriptivo |
| geometry | TEXT NOT NULL | GeoJSON Polygon serializado |
| has | REAL | Superficie en hectáreas |
| color | TEXT | Color hex para renderizar en mapa |
| estado | TEXT DEFAULT 'activo' | `activo` / `inactivo` (historial de versiones) |
| reemplazado_por | TEXT | ID del lote que lo reemplazó (versionado) |
| atributos | TEXT DEFAULT '{}' | JSON con atributos extra del BackOffice |
| created_at | TEXT | Timestamp |

### dc_ambiente

Polígonos de ambientes (subdivisiones ecológicas). Se descargan de `datos_campo.dc_ambiente`.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | TEXT PK | UUID |
| lote_id | TEXT FK | Referencia a dc_lote |
| id_establecimiento | TEXT NOT NULL | FK a establecimientos |
| nombre | TEXT NOT NULL | Nombre del ambiente |
| geometry | TEXT NOT NULL | GeoJSON Polygon serializado |
| has | REAL NOT NULL | Superficie en hectáreas |
| color | TEXT | Color hex |
| estado | TEXT DEFAULT 'activo' | `activo` / `inactivo` |
| atributos | TEXT DEFAULT '{}' | JSON extra |
| created_at | TEXT | Timestamp |

### dc_ambiente_lote

Intersecciones geométricas entre ambientes y lotes. Permite saber qué porcentaje de cada lote ocupa cada ambiente.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | TEXT PK | UUID |
| id_establecimiento | TEXT NOT NULL | FK a establecimientos |
| lote_id | TEXT NOT NULL | FK a dc_lote |
| ambiente_id | TEXT NOT NULL | FK a dc_ambiente |
| nombre_ambiente | TEXT NOT NULL | Snapshot del nombre |
| nombre_lote | TEXT NOT NULL | Snapshot del nombre |
| geometry | TEXT NOT NULL | GeoJSON de la intersección |
| has | REAL NOT NULL | Superficie de la intersección |
| porcentaje_lote | REAL NOT NULL | % que ocupa del lote |
| color | TEXT | Color hex |
| created_at | TEXT | Timestamp |

---

## Tipos de Tarea (Dinámicos)

Los tipos de tarea se definen en Supabase como **source of truth** y se sincronizan al SQLite local como tablas readonly. Se crean y editan desde el BackOffice.

### dc_tarea_tipo

Definición versionada de un tipo de tarea. Contiene la estructura del formulario (campos), la config de subtareas, y el nivel de dato.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | TEXT NOT NULL | Identificador: `pastoreo`, `relevamiento_forraje`, `libre` |
| nombre | TEXT NOT NULL | Nombre legible: "Datos de Pastoreo" |
| nivel | TEXT NOT NULL | `lote` / `ambiente` / `libre` |
| version | INTEGER NOT NULL DEFAULT 1 | Versión del formulario |
| orden | INTEGER DEFAULT 0 | Orden de visualización |
| campos | TEXT NOT NULL | JSON de `CampoConfig[]` (schema del formulario) |
| subtarea_campos | TEXT | JSON de `CampoConfig[]` para subtareas (NULL = sin subtareas) |
| subtarea_config | TEXT | JSON `{label, unidad_default, minimo}` o NULL |
| estado | TEXT DEFAULT 'activo' | `activo` / `deprecado` |
| created_at | TEXT | Timestamp |
| updated_at | TEXT | Timestamp |
| | **PK: (id, version)** | Un tipo puede tener múltiples versiones |

**Ejemplo de `campos` JSON (pastoreo v1):**

```jsonc
[
  {"key": "fecha_ultimo_pastoreo", "label": "Fecha último pastoreo", "type": "date", "required": true},
  {"key": "intensidad", "label": "Intensidad", "type": "chips", "options": [
    {"value": "Sin Pastoreo", "label": "Sin Pastoreo"},
    {"value": "Leve", "label": "Leve"},
    {"value": "Moderado", "label": "Moderado"},
    {"value": "Intenso", "label": "Intenso"}
  ], "required": true},
  {"key": "observaciones", "label": "Observaciones", "type": "textarea", "required": false}
]
```

**Ejemplo de `subtarea_campos` JSON (relevamiento_forraje):**

```jsonc
[
  {"key": "stock_kgms_ha", "label": "Stock", "type": "numeric", "required": true}
]
```

**Ejemplo de `subtarea_config` JSON:**

```jsonc
{"label": "Muestras de Stock", "unidad_default": "kgMS/ha", "minimo": 1}
```

**Tipos de campo soportados (`CampoConfig.type`):**

| type | Componente | Descripción |
|------|-----------|-------------|
| `text` | TextInput | Texto libre una línea |
| `textarea` | TextInput multiline | Texto libre multi-línea |
| `numeric` | TextInput keyboardType=numeric | Número |
| `date` | TextInput con formato YYYY-MM-DD | Fecha |
| `chips` | ChipsSelector (single) | Selección única de opciones |
| `chips_multi` | TagsInput | Selección múltiple de opciones |
| `fotos` | FotosField | Fotos adjuntas |

### dc_tarea_tipo_servicio

Asignación de tipos de tarea a tipos de servicio. Define qué tareas se auto-generan al crear una recorrida para un servicio dado.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| tarea_tipo_id | TEXT NOT NULL | FK conceptual a dc_tarea_tipo.id |
| tarea_tipo_version | INTEGER NOT NULL DEFAULT 1 | Versión del tipo |
| servicio_tipo | TEXT NOT NULL | "Datos de Campo", "Plan Abierto", etc. |
| auto_generar | INTEGER DEFAULT 1 | Si se auto-genera al crear recorrida |
| | **PK: (tarea_tipo_id, tarea_tipo_version, servicio_tipo)** | |

**Seed actual:**

| tarea_tipo_id | servicio_tipo | auto_generar |
|---------------|--------------|--------------|
| pastoreo | Datos de Campo | true |
| relevamiento_forraje | Datos de Campo | true |
| libre | Datos de Campo | false |

---

## Tablas de Recorrida y Tareas

### dc_servicio

Servicios agendados desde el BackOffice. Se sincronizan desde `public.agenda`.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id_servicio | TEXT PK | UUID del servicio en agenda |
| id_establecimiento | TEXT | FK a establecimientos |
| nombre_establecimiento | TEXT | Nombre cacheado |
| servicio | TEXT | Tipo: "Datos de Campo", etc. |
| fecha | TEXT | Fecha inicio |
| fecha_fin | TEXT | Fecha fin |
| estado_trabajo | INTEGER | 3=Agendado, 4=Por rendir |
| educadores | TEXT | JSON array de educadores asignados |
| downloaded_at | TEXT | Timestamp de última descarga de lotes |

### dc_recorrida

Visita a campo de un técnico. Equivale a MonitoringEvent de ruuts.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | TEXT PK | UUID |
| id_establecimiento | TEXT NOT NULL | FK a establecimientos |
| id_servicio | TEXT | FK a dc_servicio (opcional) |
| educador_id | INTEGER | FK a educadores (Supabase public) |
| capa_gis_id | TEXT | Capa de lotes vigente al crear |
| nombre | TEXT | Nombre legible: "21feb26-campogrande-datosde" |
| fecha | TEXT NOT NULL | Fecha de la recorrida |
| observaciones_generales | TEXT | Notas generales |
| estado | TEXT DEFAULT 'en_curso' | `en_curso` / `completa` |
| created_at | TEXT | Timestamp |
| updated_at | TEXT | Timestamp |

### dc_tarea

Instancia de tarea dentro de una recorrida. Usa `datos` JSON flexible cuyo schema viene de `dc_tarea_tipo.campos`.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | TEXT PK | UUID |
| recorrida_id | TEXT NOT NULL FK | Referencia a dc_recorrida |
| tarea_tipo_id | TEXT NOT NULL | FK conceptual a dc_tarea_tipo.id |
| lote_id | TEXT FK | Referencia a dc_lote (NULL si libre sin lote) |
| ambiente_id | TEXT | FK a dc_ambiente (NULL para tareas nivel lote) |
| estado | TEXT DEFAULT 'sin_iniciar' | `sin_iniciar` / `en_curso` / `completa` |
| datos | TEXT DEFAULT '{}' | JSON con valores del formulario |
| titulo | TEXT | Titulo (para tarea libre) |
| tags | TEXT | JSON array de tags (tarea libre) |
| origen | TEXT DEFAULT 'campo' | `campo` (creada en app) / `backoffice` (pre-planificada) |
| id_establecimiento | TEXT NOT NULL | FK a establecimientos |
| form_version | INTEGER DEFAULT 1 | Versión del tipo de tarea usada |
| orden | INTEGER DEFAULT 0 | Orden de visualización |
| gps_lat | REAL | Latitud GPS |
| gps_lng | REAL | Longitud GPS |
| gps_accuracy | REAL | Precisión GPS en metros |
| created_at | TEXT | Timestamp |
| updated_at | TEXT | Timestamp |

**Contenido de `datos` JSON según tipo:**

```jsonc
// pastoreo (nivel lote)
{
  "fecha_ultimo_pastoreo": "2026-01-15",
  "intensidad": "Intenso",
  "observaciones": "Pastura muy consumida"
}

// relevamiento_forraje (nivel ambiente)
{
  "recurso_forrajero_principal": "Campo Natural",
  "calidad": "Buena",
  "observaciones": "Buen estado vegetativo"
}
// + subtareas en dc_subtarea

// libre
{
  "titulo": "Maleza sector oeste",
  "descripcion": "Parche grande de cardos",
  "tags": ["maleza", "otro"]
}
// + fotos en dc_foto
```

### dc_subtarea

Registros hijos georreferenciados de una tarea. Cada subtarea tiene su propio `datos` JSON cuyo schema viene de `dc_tarea_tipo.subtarea_campos`. Reemplaza a la antigua `dc_muestra`.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | TEXT PK | UUID |
| tarea_id | TEXT NOT NULL FK | Referencia a dc_tarea |
| datos | TEXT DEFAULT '{}' | JSON con valores (ej: `{"stock_kgms_ha": 1420}`) |
| gps_lat | REAL | Latitud del punto de muestreo |
| gps_lng | REAL | Longitud |
| gps_accuracy | REAL | Precisión GPS |
| created_at | TEXT | Timestamp |

### dc_foto

Fotos asociadas a tareas.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | TEXT PK | UUID |
| tarea_id | TEXT FK | Referencia a dc_tarea |
| local_uri | TEXT | Path local del archivo |
| storage_path | TEXT | Path en Supabase Storage |
| descripcion | TEXT | Descripción de la foto |
| created_at | TEXT | Timestamp |

---

## Tablas de Infraestructura

### sync_queue

Cola de operaciones pendientes de sincronización. Implementa retry con backoff exponencial y dead letter.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | TEXT PK | UUID |
| entity | TEXT NOT NULL | Nombre de tabla: `dc_tarea`, `dc_subtarea`, etc. |
| entity_id | TEXT NOT NULL | ID del registro |
| operation | TEXT NOT NULL | `upsert` / `delete` |
| payload | TEXT | JSON del registro completo |
| status | TEXT DEFAULT 'pending' | `pending` / `failed` / `dead` |
| attempts | INTEGER DEFAULT 0 | Intentos realizados (max 5) |
| next_retry_at | TEXT | Próximo reintento (backoff: 30s, 2m, 10m, 30m, 1h) |
| last_error | TEXT | Último error |
| id_establecimiento | TEXT | Para agrupar sync por establecimiento |
| created_at | TEXT | Timestamp |

### settings

Configuración local key-value.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| key | TEXT PK | Clave |
| value | TEXT | Valor |

---

## Índices

```sql
CREATE INDEX idx_capa_gis_estab ON dc_capa_gis(id_establecimiento);
CREATE INDEX idx_capa_gis_tipo ON dc_capa_gis(tipo);
CREATE INDEX idx_lote_estab ON dc_lote(id_establecimiento);
CREATE INDEX idx_ambiente_lote_id ON dc_ambiente(lote_id);
CREATE INDEX idx_amb_lote_estab ON dc_ambiente_lote(id_establecimiento);
CREATE INDEX idx_amb_lote_lote ON dc_ambiente_lote(lote_id);
CREATE INDEX idx_amb_lote_amb ON dc_ambiente_lote(ambiente_id);
CREATE INDEX idx_tarea_recorrida ON dc_tarea(recorrida_id);
CREATE INDEX idx_tarea_lote ON dc_tarea(lote_id);
CREATE INDEX idx_tarea_tipo ON dc_tarea(tarea_tipo_id);
CREATE INDEX idx_subtarea_tarea ON dc_subtarea(tarea_id);
CREATE INDEX idx_foto_tarea ON dc_foto(tarea_id);
CREATE INDEX idx_sync_status ON sync_queue(status);
```

---

## Auto-generación de tareas

Al crear una recorrida para un servicio dado (ej: "Datos de Campo"), se consulta `dc_tarea_tipo_servicio` para obtener los tipos con `auto_generar = true`. Según el `nivel` de cada tipo:

- **`lote`**: se crea 1 tarea por cada lote del establecimiento
- **`ambiente`**: se crea 1 tarea por cada ambiente (o por lote si no hay ambientes)
- **`libre`**: no se auto-genera, el técnico las crea manualmente

### Lógica de estado

El estado de cada tarea se computa automáticamente (`computeEstadoTarea()`):

- **sin_iniciar**: ningún campo requerido completado y sin subtareas
- **en_curso**: algunos campos completados o subtareas insuficientes
- **completa**: todos los campos requeridos llenos + mínimo de subtareas alcanzado

---

## Tablas Supabase (remotas)

Schema: `datos_campo` en proyecto Supabase `fkrppgqtlgoxnonohenu`.

Las tablas remotas usan `UUID` y `JSONB` mientras que SQLite usa `TEXT` para ambos. La sincronización maneja esta conversión transparentemente.

Migración relevante: `supabase/migrations/20260221_datos_campo_tarea_tipo_subtarea.sql`

```sql
-- datos_campo.dc_tarea_tipo (source of truth)
CREATE TABLE datos_campo.dc_tarea_tipo (
  id TEXT NOT NULL,
  nombre TEXT NOT NULL,
  nivel TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  orden INTEGER DEFAULT 0,
  campos JSONB NOT NULL,
  subtarea_campos JSONB,
  subtarea_config JSONB,
  estado TEXT DEFAULT 'activo',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (id, version)
);

-- datos_campo.dc_tarea_tipo_servicio
CREATE TABLE datos_campo.dc_tarea_tipo_servicio (
  tarea_tipo_id TEXT NOT NULL,
  tarea_tipo_version INTEGER NOT NULL DEFAULT 1,
  servicio_tipo TEXT NOT NULL,
  auto_generar BOOLEAN DEFAULT true,
  PRIMARY KEY (tarea_tipo_id, tarea_tipo_version, servicio_tipo)
);

-- datos_campo.dc_tarea
CREATE TABLE datos_campo.dc_tarea (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recorrida_id UUID NOT NULL REFERENCES datos_campo.dc_recorrida(id),
  tarea_tipo_id TEXT NOT NULL,
  lote_id UUID REFERENCES datos_campo.dc_lote(id),
  ambiente_id UUID,
  estado TEXT DEFAULT 'sin_iniciar',
  datos JSONB DEFAULT '{}',
  titulo TEXT,
  tags JSONB,
  origen TEXT DEFAULT 'campo',
  id_establecimiento TEXT NOT NULL,
  form_version INTEGER DEFAULT 1,
  orden INTEGER DEFAULT 0,
  gps_lat DOUBLE PRECISION,
  gps_lng DOUBLE PRECISION,
  gps_accuracy DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- datos_campo.dc_subtarea
CREATE TABLE datos_campo.dc_subtarea (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tarea_id UUID NOT NULL REFERENCES datos_campo.dc_tarea(id),
  datos JSONB DEFAULT '{}',
  gps_lat DOUBLE PRECISION,
  gps_lng DOUBLE PRECISION,
  gps_accuracy DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT now()
);
```
