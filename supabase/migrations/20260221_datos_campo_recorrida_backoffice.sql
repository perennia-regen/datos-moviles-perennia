-- Agregar columna origen a dc_recorrida
ALTER TABLE datos_campo.dc_recorrida ADD COLUMN IF NOT EXISTS origen TEXT DEFAULT 'campo';

-- Índice para búsqueda por establecimiento
CREATE INDEX IF NOT EXISTS idx_dc_recorrida_estab ON datos_campo.dc_recorrida(id_establecimiento);
CREATE INDEX IF NOT EXISTS idx_dc_recorrida_fecha ON datos_campo.dc_recorrida(fecha DESC);

-- Policies DELETE para recorrida y tarea (necesarias para BackOffice)
CREATE POLICY "Authenticated can delete" ON datos_campo.dc_recorrida FOR DELETE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete" ON datos_campo.dc_tarea FOR DELETE TO authenticated USING (true);

-- Policies CRUD para dc_tarea_tipo (admin desde BackOffice)
CREATE POLICY "Authenticated can insert" ON datos_campo.dc_tarea_tipo FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update" ON datos_campo.dc_tarea_tipo FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete" ON datos_campo.dc_tarea_tipo FOR DELETE TO authenticated USING (true);

-- Policies CRUD para dc_tarea_tipo_servicio (admin desde BackOffice)
CREATE POLICY "Authenticated can insert" ON datos_campo.dc_tarea_tipo_servicio FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update" ON datos_campo.dc_tarea_tipo_servicio FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete" ON datos_campo.dc_tarea_tipo_servicio FOR DELETE TO authenticated USING (true);
