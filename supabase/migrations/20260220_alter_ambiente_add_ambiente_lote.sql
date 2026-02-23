-- Make lote_id nullable so ambientes can be imported as standalone layer
ALTER TABLE datos_campo.dc_ambiente
  ALTER COLUMN lote_id DROP NOT NULL;

-- New table: intersection of ambiente polygons with lote polygons
CREATE TABLE datos_campo.dc_ambiente_lote (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  id_establecimiento TEXT NOT NULL,
  lote_id UUID NOT NULL REFERENCES datos_campo.dc_lote(id) ON DELETE CASCADE,
  ambiente_id UUID NOT NULL REFERENCES datos_campo.dc_ambiente(id) ON DELETE CASCADE,
  nombre_ambiente TEXT NOT NULL,
  nombre_lote TEXT NOT NULL,
  geometry JSONB NOT NULL,           -- clipped GeoJSON Feature
  has NUMERIC NOT NULL,              -- area of the clipped piece in hectares
  porcentaje_lote NUMERIC NOT NULL,  -- percentage of the parent lote area
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(lote_id, ambiente_id)
);

-- RLS
ALTER TABLE datos_campo.dc_ambiente_lote ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read"
  ON datos_campo.dc_ambiente_lote FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can insert"
  ON datos_campo.dc_ambiente_lote FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can delete"
  ON datos_campo.dc_ambiente_lote FOR DELETE TO authenticated USING (true);

-- Grants
GRANT ALL ON datos_campo.dc_ambiente_lote TO anon, authenticated, service_role;
