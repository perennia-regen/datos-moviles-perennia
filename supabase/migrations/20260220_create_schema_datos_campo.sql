-- Schema: datos_campo
-- Datos crudos recolectados en campo por técnicos de Perennia
-- Nomenclatura: prefijo dc_ (datos_campo), consistente con pa_ (plan_abierto) y pc_ (plan_cerrado)

CREATE SCHEMA IF NOT EXISTS datos_campo;

-- Capas GIS vectoriales por establecimiento (subidas desde BackOffice)
CREATE TABLE datos_campo.dc_capa_gis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  id_establecimiento TEXT NOT NULL REFERENCES public.establecimientos(id_establecimiento),
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL,                    -- 'lotes', 'ambientes', 'perimetro', 'puntos_interes'
  geojson JSONB NOT NULL,               -- FeatureCollection completa
  metadata JSONB,                        -- fuente QGIS, CRS, fecha exportación, etc.
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Lotes georreferenciados (extraídos de capas GIS)
CREATE TABLE datos_campo.dc_lote (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  id_establecimiento TEXT NOT NULL REFERENCES public.establecimientos(id_establecimiento),
  capa_gis_id UUID REFERENCES datos_campo.dc_capa_gis(id),
  nombre_lote TEXT NOT NULL,             -- "8.4", "17.1", "B3 Oeste" (misma convención que pa_lote/pc_lote)
  geometry JSONB NOT NULL,               -- GeoJSON Feature (polígono)
  has NUMERIC,                           -- hectáreas (mismo nombre que pa_lote.has / pc_lote.has)
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Ambientes dentro de un lote (subdivisiones ecológicas)
CREATE TABLE datos_campo.dc_ambiente (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lote_id UUID NOT NULL REFERENCES datos_campo.dc_lote(id),
  id_establecimiento TEXT NOT NULL REFERENCES public.establecimientos(id_establecimiento),
  nombre TEXT NOT NULL,                  -- "Abra", "Monte Cerrado", "Monte Abierto Bajo", "Bajo"
  geometry JSONB NOT NULL,               -- GeoJSON Feature (polígono)
  has NUMERIC NOT NULL,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Recorrida = un día/jornada de trabajo de campo
CREATE TABLE datos_campo.dc_recorrida (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  id_establecimiento TEXT NOT NULL REFERENCES public.establecimientos(id_establecimiento),
  id_servicio TEXT REFERENCES public.agenda(id_servicio),
  educador_id BIGINT REFERENCES public.educadores(id_educador),
  fecha DATE NOT NULL,
  observaciones_generales TEXT,
  estado TEXT DEFAULT 'en_curso',        -- 'en_curso', 'completa'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Mediciones de campo (columnas alineadas con pa_lote/pc_lote)
CREATE TABLE datos_campo.dc_medicion (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recorrida_id UUID NOT NULL REFERENCES datos_campo.dc_recorrida(id),
  id_establecimiento TEXT NOT NULL REFERENCES public.establecimientos(id_establecimiento),
  lote_id UUID NOT NULL REFERENCES datos_campo.dc_lote(id),
  ambiente_id UUID REFERENCES datos_campo.dc_ambiente(id),
  educador_id BIGINT REFERENCES public.educadores(id_educador),
  fecha_medicion DATE NOT NULL,
  fecha_ultimo_pastoreo DATE,
  dias_desde_ultimo_pastoreo INTEGER,
  stock_inicial_kgms_ha NUMERIC,         -- = pc_lote.stock_inicial_kgms_ha
  recurso_forrajero_principal TEXT,       -- = pa_lote.recurso_forrajero_principal
  intensidad TEXT,                        -- = pa_lote.intensidad
  calidad TEXT,                           -- = pc_lote.calidad
  observaciones TEXT,
  gps_lat DOUBLE PRECISION,
  gps_lng DOUBLE PRECISION,
  gps_accuracy DOUBLE PRECISION,
  synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Fotos de campo
CREATE TABLE datos_campo.dc_foto (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  medicion_id UUID NOT NULL REFERENCES datos_campo.dc_medicion(id),
  storage_path TEXT,
  descripcion TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Permisos
GRANT USAGE ON SCHEMA datos_campo TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA datos_campo TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA datos_campo GRANT ALL ON TABLES TO anon, authenticated, service_role;

-- RLS
ALTER TABLE datos_campo.dc_capa_gis ENABLE ROW LEVEL SECURITY;
ALTER TABLE datos_campo.dc_lote ENABLE ROW LEVEL SECURITY;
ALTER TABLE datos_campo.dc_ambiente ENABLE ROW LEVEL SECURITY;
ALTER TABLE datos_campo.dc_recorrida ENABLE ROW LEVEL SECURITY;
ALTER TABLE datos_campo.dc_medicion ENABLE ROW LEVEL SECURITY;
ALTER TABLE datos_campo.dc_foto ENABLE ROW LEVEL SECURITY;

-- Políticas (MVP - permisivas para authenticated)
CREATE POLICY "Authenticated can read all" ON datos_campo.dc_capa_gis FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert" ON datos_campo.dc_capa_gis FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update" ON datos_campo.dc_capa_gis FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated can read all" ON datos_campo.dc_lote FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert" ON datos_campo.dc_lote FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can read all" ON datos_campo.dc_ambiente FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert" ON datos_campo.dc_ambiente FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can read all" ON datos_campo.dc_recorrida FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert" ON datos_campo.dc_recorrida FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update" ON datos_campo.dc_recorrida FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated can read all" ON datos_campo.dc_medicion FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert" ON datos_campo.dc_medicion FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update" ON datos_campo.dc_medicion FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated can read all" ON datos_campo.dc_foto FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert" ON datos_campo.dc_foto FOR INSERT TO authenticated WITH CHECK (true);
