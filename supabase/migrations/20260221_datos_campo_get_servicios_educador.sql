-- RPC para obtener servicios agendados/por rendir de un educador
-- Usada por la app móvil para mostrar la lista de servicios del técnico

CREATE OR REPLACE FUNCTION get_servicios_educador(p_educador_id BIGINT)
RETURNS TABLE (
  id_servicio TEXT,
  id_establecimiento TEXT,
  nombre_establecimiento TEXT,
  servicio TEXT,
  fecha DATE,
  fecha_fin DATE,
  estado_trabajo BIGINT,
  educadores INTEGER[]
) LANGUAGE sql STABLE AS $$
  SELECT
    a.id_servicio,
    a.id_establecimiento,
    e.nombre_establecimiento,
    COALESCE(t.tipodeservicio, a.servicio),
    a.fecha::date,
    a.fecha_fin_servicio::date,
    a.estado_trabajo,
    a.educadores
  FROM agenda a
  JOIN establecimientos e ON e.id_establecimiento = a.id_establecimiento
  LEFT JOIN tipodeservicio_reftable t ON t.id = a.id_tipo_servicio
  WHERE p_educador_id = ANY(a.educadores)
    AND a.estado_trabajo IN (3, 4)
    AND COALESCE(a.isdeleted, false) = false
  ORDER BY a.fecha ASC NULLS LAST;
$$;
