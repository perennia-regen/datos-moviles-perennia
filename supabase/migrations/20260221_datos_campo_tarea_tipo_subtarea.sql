-- Migración: Sistema de tareas dinámico
-- - Crear dc_tarea_tipo (definiciones de formulario versionadas)
-- - Crear dc_tarea_tipo_servicio (asignación tipo ↔ servicio)
-- - Crear dc_tarea (instancias de tarea)
-- - Crear dc_subtarea (registros hijos georreferenciados)
-- - Eliminar dc_medicion (legacy)
-- - Actualizar dc_foto (quitar medicion_id, solo tarea_id)
-- - Agregar columnas a dc_recorrida (nombre)

-- ── dc_tarea_tipo: definición de tipos de tarea (source of truth) ──

CREATE TABLE datos_campo.dc_tarea_tipo (
  id TEXT NOT NULL,
  nombre TEXT NOT NULL,
  nivel TEXT NOT NULL,                        -- 'lote' | 'ambiente' | 'libre'
  version INTEGER NOT NULL DEFAULT 1,
  orden INTEGER DEFAULT 0,
  campos JSONB NOT NULL,                      -- Array de CampoConfig[]
  subtarea_campos JSONB,                      -- Array de CampoConfig[] para subtareas (NULL = no tiene)
  subtarea_config JSONB,                      -- {label, unidad_default, minimo} o NULL
  estado TEXT DEFAULT 'activo',               -- 'activo' | 'deprecado'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (id, version)
);

-- ── dc_tarea_tipo_servicio: qué tipos aplican a qué servicios ──

CREATE TABLE datos_campo.dc_tarea_tipo_servicio (
  tarea_tipo_id TEXT NOT NULL,
  tarea_tipo_version INTEGER NOT NULL DEFAULT 1,
  servicio_tipo TEXT NOT NULL,                -- "Datos de Campo", "Plan Abierto", etc.
  auto_generar BOOLEAN DEFAULT true,
  PRIMARY KEY (tarea_tipo_id, tarea_tipo_version, servicio_tipo)
);

-- ── dc_tarea: instancia de tarea dentro de una recorrida ──

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
  id_establecimiento TEXT NOT NULL REFERENCES public.establecimientos(id_establecimiento),
  form_version INTEGER DEFAULT 1,
  orden INTEGER DEFAULT 0,
  gps_lat DOUBLE PRECISION,
  gps_lng DOUBLE PRECISION,
  gps_accuracy DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── dc_subtarea: registros hijos georreferenciados de una tarea ──

CREATE TABLE datos_campo.dc_subtarea (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tarea_id UUID NOT NULL REFERENCES datos_campo.dc_tarea(id),
  datos JSONB DEFAULT '{}',
  gps_lat DOUBLE PRECISION,
  gps_lng DOUBLE PRECISION,
  gps_accuracy DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── dc_recorrida: agregar nombre legible ──

ALTER TABLE datos_campo.dc_recorrida ADD COLUMN IF NOT EXISTS nombre TEXT;

-- ── dc_foto: migrar de medicion_id a tarea_id ──

ALTER TABLE datos_campo.dc_foto ADD COLUMN IF NOT EXISTS tarea_id UUID REFERENCES datos_campo.dc_tarea(id);
ALTER TABLE datos_campo.dc_foto DROP CONSTRAINT IF EXISTS dc_foto_medicion_id_fkey;
ALTER TABLE datos_campo.dc_foto DROP COLUMN IF EXISTS medicion_id;

-- ── Eliminar dc_medicion (legacy) ──

DROP POLICY IF EXISTS "Authenticated can read all" ON datos_campo.dc_medicion;
DROP POLICY IF EXISTS "Authenticated can insert" ON datos_campo.dc_medicion;
DROP POLICY IF EXISTS "Authenticated can update" ON datos_campo.dc_medicion;
DROP TABLE IF EXISTS datos_campo.dc_medicion;

-- ── Indices ──

CREATE INDEX idx_tarea_recorrida ON datos_campo.dc_tarea(recorrida_id);
CREATE INDEX idx_tarea_lote ON datos_campo.dc_tarea(lote_id);
CREATE INDEX idx_tarea_tipo ON datos_campo.dc_tarea(tarea_tipo_id);
CREATE INDEX idx_subtarea_tarea ON datos_campo.dc_subtarea(tarea_id);
CREATE INDEX idx_foto_tarea ON datos_campo.dc_foto(tarea_id);

-- ── RLS ──

ALTER TABLE datos_campo.dc_tarea_tipo ENABLE ROW LEVEL SECURITY;
ALTER TABLE datos_campo.dc_tarea_tipo_servicio ENABLE ROW LEVEL SECURITY;
ALTER TABLE datos_campo.dc_tarea ENABLE ROW LEVEL SECURITY;
ALTER TABLE datos_campo.dc_subtarea ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read all" ON datos_campo.dc_tarea_tipo FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can read all" ON datos_campo.dc_tarea_tipo_servicio FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can read all" ON datos_campo.dc_tarea FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert" ON datos_campo.dc_tarea FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update" ON datos_campo.dc_tarea FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated can read all" ON datos_campo.dc_subtarea FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert" ON datos_campo.dc_subtarea FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can delete" ON datos_campo.dc_subtarea FOR DELETE TO authenticated USING (true);

-- ── Permisos ──

GRANT ALL ON datos_campo.dc_tarea_tipo TO anon, authenticated, service_role;
GRANT ALL ON datos_campo.dc_tarea_tipo_servicio TO anon, authenticated, service_role;
GRANT ALL ON datos_campo.dc_tarea TO anon, authenticated, service_role;
GRANT ALL ON datos_campo.dc_subtarea TO anon, authenticated, service_role;

-- ── Seed data: 3 tipos iniciales ──

INSERT INTO datos_campo.dc_tarea_tipo (id, nombre, nivel, version, orden, campos, subtarea_campos, subtarea_config) VALUES
('pastoreo', 'Datos de Pastoreo', 'lote', 1, 0,
  '[{"key":"fecha_ultimo_pastoreo","label":"Fecha último pastoreo","type":"date","required":true},{"key":"intensidad","label":"Intensidad","type":"chips","options":[{"value":"Sin Pastoreo","label":"Sin Pastoreo"},{"value":"Leve","label":"Leve"},{"value":"Moderado","label":"Moderado"},{"value":"Intenso","label":"Intenso"}],"required":true},{"key":"observaciones","label":"Observaciones","type":"textarea","required":false}]'::jsonb,
  NULL, NULL),

('relevamiento_forraje', 'Relevamiento Forraje', 'ambiente', 1, 1,
  '[{"key":"recurso_forrajero_principal","label":"Recurso forrajero","type":"chips","options":[{"value":"Campo Natural","label":"Campo Natural"},{"value":"Pastura","label":"Pastura"},{"value":"Verdeo Invierno","label":"Verdeo Invierno"},{"value":"Verdeo Verano","label":"Verdeo Verano"},{"value":"Rastrojo","label":"Rastrojo"},{"value":"Otro","label":"Otro"}],"required":true},{"key":"calidad","label":"Calidad","type":"chips","options":[{"value":"Buena","label":"Buena"},{"value":"Regular","label":"Regular"},{"value":"Mala","label":"Mala"}],"required":true},{"key":"observaciones","label":"Observaciones","type":"textarea","required":false}]'::jsonb,
  '[{"key":"stock_kgms_ha","label":"Stock","type":"numeric","required":true}]'::jsonb,
  '{"label":"Muestras de Stock","unidad_default":"kgMS/ha","minimo":1}'::jsonb),

('libre', 'Tarea Libre', 'libre', 1, 2,
  '[{"key":"titulo","label":"Título","type":"text","required":true},{"key":"descripcion","label":"Descripción","type":"textarea","required":true},{"key":"tags","label":"Tags","type":"chips_multi","options":[{"value":"maleza","label":"Maleza"},{"value":"infraestructura","label":"Infraestructura"},{"value":"agua","label":"Agua"},{"value":"estado_alambrado","label":"Alambrado"},{"value":"erosion","label":"Erosión"},{"value":"otro","label":"Otro"}],"required":false},{"key":"fotos","label":"Fotos","type":"fotos","required":false}]'::jsonb,
  NULL, NULL);

INSERT INTO datos_campo.dc_tarea_tipo_servicio (tarea_tipo_id, tarea_tipo_version, servicio_tipo, auto_generar) VALUES
('pastoreo', 1, 'Datos de Campo', true),
('relevamiento_forraje', 1, 'Datos de Campo', true),
('libre', 1, 'Datos de Campo', false);
