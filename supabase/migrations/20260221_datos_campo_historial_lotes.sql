-- Historial de lotes y ambientes — inmutabilidad condicional
-- ADR: docs/adr/001-historial-lotes-inmutabilidad-condicional.md

-- 1. Estado en dc_lote (activo/archivado)
ALTER TABLE datos_campo.dc_lote
  ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'activo'
    CHECK (estado IN ('activo', 'archivado')),
  ADD COLUMN IF NOT EXISTS reemplazado_por UUID
    REFERENCES datos_campo.dc_lote(id);

UPDATE datos_campo.dc_lote SET estado = 'activo' WHERE estado IS NULL;

CREATE INDEX IF NOT EXISTS idx_lote_estado
  ON datos_campo.dc_lote(id_establecimiento, estado);

-- 2. Estado en dc_ambiente
ALTER TABLE datos_campo.dc_ambiente
  ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'activo'
    CHECK (estado IN ('activo', 'archivado'));

UPDATE datos_campo.dc_ambiente SET estado = 'activo' WHERE estado IS NULL;

CREATE INDEX IF NOT EXISTS idx_ambiente_estado
  ON datos_campo.dc_ambiente(id_establecimiento, estado);

-- 3. capa_gis_id en dc_recorrida (referencia al mapa usado)
ALTER TABLE datos_campo.dc_recorrida
  ADD COLUMN IF NOT EXISTS capa_gis_id UUID
    REFERENCES datos_campo.dc_capa_gis(id);

-- 4. Snapshots desnormalizados en dc_medicion
ALTER TABLE datos_campo.dc_medicion
  ADD COLUMN IF NOT EXISTS lote_nombre_snapshot TEXT,
  ADD COLUMN IF NOT EXISTS lote_has_snapshot NUMERIC,
  ADD COLUMN IF NOT EXISTS ambiente_nombre_snapshot TEXT;

-- 5. Trigger: proteger delete de lotes con mediciones
CREATE OR REPLACE FUNCTION datos_campo.prevent_lote_delete()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM datos_campo.dc_medicion WHERE lote_id = OLD.id LIMIT 1) THEN
    RAISE EXCEPTION 'No se puede eliminar dc_lote "%" porque tiene mediciones. Use estado=archivado.',
      OLD.nombre_lote;
  END IF;
  RETURN OLD;
END;
$$;

CREATE OR REPLACE TRIGGER trg_prevent_lote_delete
BEFORE DELETE ON datos_campo.dc_lote
FOR EACH ROW EXECUTE FUNCTION datos_campo.prevent_lote_delete();
