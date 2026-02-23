import { getDb } from "@/db/schema";

// ── Tipos ──

export type TareaEstado = "sin_iniciar" | "en_curso" | "completa";
export type TareaNivel = "lote" | "ambiente" | "libre";
export type TareaOrigen = "campo" | "backoffice";

export interface CampoConfig {
  key: string;
  label: string;
  type: "date" | "chips" | "chips_multi" | "textarea" | "text" | "numeric" | "fotos";
  options?: readonly { value: string; label: string }[];
  required?: boolean;
}

export interface SubtareaConfig {
  label: string;
  unidad_default?: string;
  minimo: number;
}

export interface TareaTipoConfig {
  id: string;
  nombre: string;
  nivel: TareaNivel;
  version: number;
  orden: number;
  campos: CampoConfig[];
  subtarea_campos: CampoConfig[] | null;
  subtarea_config: SubtareaConfig | null;
}

export interface Subtarea {
  id: string;
  datos: Record<string, any>;
  gps_lat?: number | null;
  gps_lng?: number | null;
}

// ── Lectura de tipos desde SQLite ──

interface TareaTipoRow {
  id: string;
  nombre: string;
  nivel: string;
  version: number;
  orden: number;
  campos: string;
  subtarea_campos: string | null;
  subtarea_config: string | null;
  estado: string;
}

function parseTareaTipoRow(row: TareaTipoRow): TareaTipoConfig {
  return {
    id: row.id,
    nombre: row.nombre,
    nivel: row.nivel as TareaNivel,
    version: row.version,
    orden: row.orden,
    campos: JSON.parse(row.campos),
    subtarea_campos: row.subtarea_campos ? JSON.parse(row.subtarea_campos) : null,
    subtarea_config: row.subtarea_config ? JSON.parse(row.subtarea_config) : null,
  };
}

/** Obtiene un tipo de tarea por id (última versión activa). */
export async function getTareaTipo(id: string, version?: number): Promise<TareaTipoConfig | null> {
  const db = await getDb();
  const query = version != null
    ? "SELECT * FROM dc_tarea_tipo WHERE id = ? AND version = ?"
    : "SELECT * FROM dc_tarea_tipo WHERE id = ? AND estado = 'activo' ORDER BY version DESC LIMIT 1";
  const params = version != null ? [id, version] : [id];
  const row = await db.getFirstAsync<TareaTipoRow>(query, params);
  return row ? parseTareaTipoRow(row) : null;
}

/** Obtiene todos los tipos activos, ordenados. */
export async function getTareaTipos(): Promise<TareaTipoConfig[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<TareaTipoRow>(
    `SELECT t1.* FROM dc_tarea_tipo t1
     INNER JOIN (
       SELECT id, MAX(version) as max_version
       FROM dc_tarea_tipo WHERE estado = 'activo'
       GROUP BY id
     ) t2 ON t1.id = t2.id AND t1.version = t2.max_version
     ORDER BY t1.orden`
  );
  return rows.map(parseTareaTipoRow);
}

/** Obtiene los tipos de tarea asignados a un tipo de servicio. */
export async function getTareaTiposPorServicio(
  servicioTipo: string
): Promise<{ tipo: TareaTipoConfig; autoGenerar: boolean }[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<TareaTipoRow & { auto_generar: number }>(
    `SELECT t.*, s.auto_generar
     FROM dc_tarea_tipo t
     JOIN dc_tarea_tipo_servicio s
       ON t.id = s.tarea_tipo_id AND t.version = s.tarea_tipo_version
     WHERE s.servicio_tipo = ? AND t.estado = 'activo'
     ORDER BY t.orden`,
    [servicioTipo]
  );
  return rows.map((r) => ({
    tipo: parseTareaTipoRow(r),
    autoGenerar: r.auto_generar === 1,
  }));
}

// ── Lógica de estado ──

export function computeEstadoTarea(
  tipo: TareaTipoConfig,
  datos: Record<string, any>,
  subtareas: Subtarea[] = []
): TareaEstado {
  if (tipo.subtarea_config) {
    const hasFormData = tipo.campos.some(
      (c) => datos[c.key] != null && datos[c.key] !== ""
    );
    const hasSamples = subtareas.length >= tipo.subtarea_config.minimo;
    if (!hasFormData && subtareas.length === 0) return "sin_iniciar";
    if (hasFormData && hasSamples) return "completa";
    return "en_curso";
  }

  if (tipo.id === "libre") {
    if (!datos.titulo && !datos.descripcion) return "sin_iniciar";
    if (datos.titulo && datos.descripcion) return "completa";
    return "en_curso";
  }

  // Tarea estándar: completa si campos requeridos llenos
  const required = tipo.campos.filter(
    (c) => c.required !== false && c.type !== "textarea"
  );
  const filled = required.filter(
    (c) => datos[c.key] != null && datos[c.key] !== ""
  );
  if (filled.length === 0) return "sin_iniciar";
  if (filled.length >= required.length) return "completa";
  return "en_curso";
}

// ── Nombre de recorrida ──

const MESES_CORTOS = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

export function generarNombreRecorrida(
  establecimiento: string,
  servicio: string,
  fecha?: Date
): string {
  const d = fecha ?? new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mmm = MESES_CORTOS[d.getMonth()];
  const yy = String(d.getFullYear()).slice(-2);

  const estabCorto = establecimiento
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 12);

  const srvCorto = servicio
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 8);

  return `${dd}${mmm}${yy}-${estabCorto}-${srvCorto}`;
}
