import { getDb } from "./schema";
import { randomUUID as uuid } from "expo-crypto";
import {
  computeEstadoTarea,
  getTareaTipo,
  getTareaTiposPorServicio,
  type Subtarea,
} from "../constants/tareas";

// ── Generic CRUD ──

export async function getAll<T>(table: string, where?: string, params?: any[]): Promise<T[]> {
  const db = await getDb();
  const query = where ? `SELECT * FROM ${table} WHERE ${where}` : `SELECT * FROM ${table}`;
  return db.getAllAsync<T>(query, params ?? []);
}

export async function getOne<T>(table: string, id: string): Promise<T | null> {
  const db = await getDb();
  return db.getFirstAsync<T>(`SELECT * FROM ${table} WHERE id = ?`, [id]);
}

export async function insert(table: string, data: Record<string, any>, sync = true): Promise<string> {
  const db = await getDb();
  const id = data.id ?? uuid();
  const record: Record<string, any> = { ...data, id };

  const keys = Object.keys(record);
  const placeholders = keys.map(() => "?").join(", ");
  const values = keys.map((k) => record[k] === undefined ? null : record[k]);

  await db.runAsync(
    `INSERT OR REPLACE INTO ${table} (${keys.join(", ")}) VALUES (${placeholders})`,
    values
  );

  if (sync) {
    await enqueueSyncOp("upsert", table, id, record);
  }

  return id;
}

export async function update(table: string, id: string, data: Record<string, any>, sync = true) {
  const db = await getDb();
  const keys = Object.keys(data);
  const setClause = keys.map((k) => `${k} = ?`).join(", ");
  const values = [...keys.map((k) => data[k]), id];

  await db.runAsync(`UPDATE ${table} SET ${setClause} WHERE id = ?`, values);

  if (sync) {
    const full = await getOne(table, id);
    await enqueueSyncOp("upsert", table, id, full as Record<string, any>);
  }
}

// ── Sync Queue ──

const MAX_SYNC_ATTEMPTS = 5;
// Backoff delays in seconds: 30s, 2min, 10min, 30min, 1h
const BACKOFF_DELAYS = [30, 120, 600, 1800, 3600];

async function enqueueSyncOp(operation: string, entity: string, entityId: string, payload: Record<string, any>) {
  const db = await getDb();
  const idEstablecimiento = payload.id_establecimiento ?? null;
  await db.runAsync(
    `INSERT INTO sync_queue (id, entity, entity_id, operation, payload, status, id_establecimiento) VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
    [uuid(), entity, entityId, operation, JSON.stringify(payload), idEstablecimiento]
  );
}

export async function getPendingSyncCount(idEstablecimiento?: string): Promise<number> {
  const db = await getDb();
  if (idEstablecimiento) {
    const result = await db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM sync_queue WHERE status IN ('pending', 'failed') AND id_establecimiento = ?",
      [idEstablecimiento]
    );
    return result?.count ?? 0;
  }
  const result = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM sync_queue WHERE status IN ('pending', 'failed')"
  );
  return result?.count ?? 0;
}

export async function getPendingSyncItems(idEstablecimiento?: string) {
  const db = await getDb();
  const now = new Date().toISOString();
  if (idEstablecimiento) {
    return db.getAllAsync(
      `SELECT * FROM sync_queue
       WHERE status IN ('pending', 'failed')
         AND id_establecimiento = ?
         AND (next_retry_at IS NULL OR next_retry_at <= ?)
       ORDER BY created_at ASC`,
      [idEstablecimiento, now]
    );
  }
  return db.getAllAsync(
    `SELECT * FROM sync_queue
     WHERE status IN ('pending', 'failed')
       AND (next_retry_at IS NULL OR next_retry_at <= ?)
     ORDER BY created_at ASC`,
    [now]
  );
}

export async function getPendingByEstablecimiento(): Promise<{ id_establecimiento: string; count: number }[]> {
  const db = await getDb();
  return db.getAllAsync(
    `SELECT id_establecimiento, COUNT(*) as count
     FROM sync_queue
     WHERE status IN ('pending', 'failed') AND id_establecimiento IS NOT NULL
     GROUP BY id_establecimiento`
  );
}

export async function getDeadItems() {
  const db = await getDb();
  return db.getAllAsync(
    "SELECT * FROM sync_queue WHERE status = 'dead' ORDER BY created_at ASC"
  );
}

export async function markSynced(syncId: string) {
  const db = await getDb();
  await db.runAsync("DELETE FROM sync_queue WHERE id = ?", [syncId]);
}

export type SyncErrorType = "network" | "auth" | "constraint" | "unknown";

export async function markSyncFailed(syncId: string, errorMsg?: string, errorType?: SyncErrorType) {
  const db = await getDb();

  // Leer intentos actuales
  const item = await db.getFirstAsync<{ attempts: number }>(
    "SELECT attempts FROM sync_queue WHERE id = ?",
    [syncId]
  );
  const attempts = (item?.attempts ?? 0) + 1;

  if (attempts >= MAX_SYNC_ATTEMPTS) {
    // Dead letter: no reintentar más
    await db.runAsync(
      "UPDATE sync_queue SET status = 'dead', attempts = ?, last_error = ? WHERE id = ?",
      [attempts, errorMsg ?? null, syncId]
    );
  } else {
    // Calcular próximo reintento con backoff
    const delaySec = BACKOFF_DELAYS[Math.min(attempts - 1, BACKOFF_DELAYS.length - 1)];
    const nextRetry = new Date(Date.now() + delaySec * 1000).toISOString();
    await db.runAsync(
      "UPDATE sync_queue SET status = 'failed', attempts = ?, next_retry_at = ?, last_error = ? WHERE id = ?",
      [attempts, nextRetry, errorMsg ?? null, syncId]
    );
  }
}

export async function retryDeadItems() {
  const db = await getDb();
  await db.runAsync(
    "UPDATE sync_queue SET status = 'pending', attempts = 0, next_retry_at = NULL, last_error = NULL WHERE status = 'dead'"
  );
}

export async function discardDeadItems() {
  const db = await getDb();
  await db.runAsync("DELETE FROM sync_queue WHERE status = 'dead'");
}

// ── Download from Supabase ──

export async function downloadEstablecimientoData(
  idEstablecimiento: string,
  datosCampoClient: { from: (table: string) => any }
): Promise<{ lotes: number; ambientes: number; capasGis: number; ambienteLotes: number }> {
  // Descargar todas las tablas en paralelo
  const [lotesRes, ambientesRes, capasGisRes, ambLotesRes, tareasRes, tiposRes, tiposServRes] = await Promise.all([
    datosCampoClient.from("dc_lote").select("*").eq("id_establecimiento", idEstablecimiento).eq("estado", "activo"),
    datosCampoClient.from("dc_ambiente").select("*").eq("id_establecimiento", idEstablecimiento).eq("estado", "activo"),
    datosCampoClient.from("dc_capa_gis").select("*").eq("id_establecimiento", idEstablecimiento),
    datosCampoClient.from("dc_ambiente_lote").select("*").eq("id_establecimiento", idEstablecimiento),
    datosCampoClient.from("dc_tarea").select("*").eq("id_establecimiento", idEstablecimiento).eq("origen", "backoffice"),
    datosCampoClient.from("dc_tarea_tipo").select("*").eq("estado", "activo"),
    datosCampoClient.from("dc_tarea_tipo_servicio").select("*"),
  ]);

  if (lotesRes.error) throw lotesRes.error;
  if (ambientesRes.error) throw ambientesRes.error;
  if (capasGisRes.error) throw capasGisRes.error;
  if (ambLotesRes.error) throw ambLotesRes.error;

  // dc_tarea puede no existir aún en Supabase — ignorar error
  const remoteTareas = (tareasRes.error ? [] : (tareasRes.data ?? [])).map((t: any) => ({
    ...t,
    datos: typeof t.datos === "object" ? JSON.stringify(t.datos) : (t.datos ?? "{}"),
    tags: typeof t.tags === "object" ? JSON.stringify(t.tags) : t.tags,
  }));

  // dc_tarea_tipo — serializar campos JSONB
  const remoteTipos = (tiposRes.error ? [] : (tiposRes.data ?? [])).map((t: any) => ({
    ...t,
    campos: typeof t.campos === "object" ? JSON.stringify(t.campos) : t.campos,
    subtarea_campos: t.subtarea_campos ? (typeof t.subtarea_campos === "object" ? JSON.stringify(t.subtarea_campos) : t.subtarea_campos) : null,
    subtarea_config: t.subtarea_config ? (typeof t.subtarea_config === "object" ? JSON.stringify(t.subtarea_config) : t.subtarea_config) : null,
  }));

  const remoteTiposServ = tiposServRes.error ? [] : (tiposServRes.data ?? []);

  const remoteLotes = (lotesRes.data ?? []).map((l: any) => ({
    ...l,
    geometry: typeof l.geometry === "object" ? JSON.stringify(l.geometry) : l.geometry,
    atributos: typeof l.atributos === "object" ? JSON.stringify(l.atributos) : (l.atributos ?? "{}"),
  }));

  const remoteAmbientes = (ambientesRes.data ?? []).map((a: any) => ({
    ...a,
    geometry: typeof a.geometry === "object" ? JSON.stringify(a.geometry) : a.geometry,
    atributos: typeof a.atributos === "object" ? JSON.stringify(a.atributos) : a.atributos,
  }));

  const remoteCapasGis = (capasGisRes.data ?? []).map((c: any) => ({
    ...c,
    geojson: typeof c.geojson === "object" ? JSON.stringify(c.geojson) : c.geojson,
    metadata: typeof c.metadata === "object" ? JSON.stringify(c.metadata) : c.metadata,
    campo_esquema: typeof c.campo_esquema === "object" ? JSON.stringify(c.campo_esquema) : c.campo_esquema,
  }));

  const remoteAmbLotes = (ambLotesRes.data ?? []).map((al: any) => ({
    ...al,
    geometry: typeof al.geometry === "object" ? JSON.stringify(al.geometry) : al.geometry,
  }));

  await bulkInsert("dc_lote", remoteLotes);
  await bulkInsert("dc_ambiente", remoteAmbientes);
  await bulkInsert("dc_capa_gis", remoteCapasGis);
  await bulkInsert("dc_ambiente_lote", remoteAmbLotes);
  if (remoteTipos.length > 0) {
    await bulkInsert("dc_tarea_tipo", remoteTipos);
  }
  if (remoteTiposServ.length > 0) {
    await bulkInsert("dc_tarea_tipo_servicio", remoteTiposServ);
  }
  if (remoteTareas.length > 0) {
    await bulkInsert("dc_tarea", remoteTareas);
  }

  return {
    lotes: remoteLotes.length,
    ambientes: remoteAmbientes.length,
    capasGis: remoteCapasGis.length,
    ambienteLotes: remoteAmbLotes.length,
  };
}

// ── Settings ──

export async function getSetting(key: string): Promise<string | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM settings WHERE key = ?",
    [key]
  );
  return row?.value ?? null;
}

export async function setSetting(key: string, value: string) {
  const db = await getDb();
  await db.runAsync(
    "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
    [key, value]
  );
}

// ── Tareas ──

interface LoteRow { id: string; nombre_lote: string; has: number | null; id_establecimiento: string }
interface AmbienteLoteRow { id: string; lote_id: string; ambiente_id: string; nombre_ambiente: string; nombre_lote: string; has: number }

export async function crearTareasParaRecorrida(
  recorridaId: string,
  idEstablecimiento: string,
  servicioTipo: string
): Promise<number> {
  const tiposConf = await getTareaTiposPorServicio(servicioTipo);
  const autoGenerables = tiposConf.filter((tc) => tc.autoGenerar);

  if (autoGenerables.length === 0) return 0;

  const lotes = await getAll<LoteRow>(
    "dc_lote",
    "id_establecimiento = ? AND estado = 'activo'",
    [idEstablecimiento]
  );

  const ambienteLotes = await getAll<AmbienteLoteRow>(
    "dc_ambiente_lote",
    "id_establecimiento = ?",
    [idEstablecimiento]
  );

  let orden = 0;
  const tareas: Record<string, any>[] = [];

  for (const { tipo } of autoGenerables) {
    if (tipo.nivel === "lote") {
      for (const lote of lotes) {
        tareas.push({
          id: uuid(),
          recorrida_id: recorridaId,
          tarea_tipo_id: tipo.id,
          lote_id: lote.id,
          ambiente_id: null,
          estado: "sin_iniciar",
          datos: "{}",
          origen: "campo",
          id_establecimiento: idEstablecimiento,
          form_version: tipo.version,
          orden: orden++,
        });
      }
    } else if (tipo.nivel === "ambiente") {
      const ambsPorLote = new Map<string, AmbienteLoteRow[]>();
      for (const al of ambienteLotes) {
        const arr = ambsPorLote.get(al.lote_id) ?? [];
        arr.push(al);
        ambsPorLote.set(al.lote_id, arr);
      }

      for (const lote of lotes) {
        const ambs = ambsPorLote.get(lote.id);
        if (ambs && ambs.length > 0) {
          for (const amb of ambs) {
            tareas.push({
              id: uuid(),
              recorrida_id: recorridaId,
              tarea_tipo_id: tipo.id,
              lote_id: lote.id,
              ambiente_id: amb.ambiente_id,
              estado: "sin_iniciar",
              datos: "{}",
              origen: "campo",
              id_establecimiento: idEstablecimiento,
              form_version: tipo.version,
              orden: orden++,
            });
          }
        } else {
          tareas.push({
            id: uuid(),
            recorrida_id: recorridaId,
            tarea_tipo_id: tipo.id,
            lote_id: lote.id,
            ambiente_id: null,
            estado: "sin_iniciar",
            datos: "{}",
            origen: "campo",
            id_establecimiento: idEstablecimiento,
            form_version: tipo.version,
            orden: orden++,
          });
        }
      }
    }
  }

  await bulkInsert("dc_tarea", tareas);
  return tareas.length;
}

export async function updateTarea(
  tareaId: string,
  datos: Record<string, any>,
  extraFields?: Record<string, any>
) {
  const updateData: Record<string, any> = {
    datos: JSON.stringify(datos),
    updated_at: new Date().toISOString(),
    ...extraFields,
  };

  const tarea = await getOne<{ tarea_tipo_id: string; form_version: number }>("dc_tarea", tareaId);
  if (tarea) {
    const tipoConfig = await getTareaTipo(tarea.tarea_tipo_id, tarea.form_version);
    if (tipoConfig) {
      const subtareas = tipoConfig.subtarea_config
        ? await getSubtareas(tareaId)
        : [];
      updateData.estado = computeEstadoTarea(tipoConfig, datos, subtareas);
    }
  }

  await update("dc_tarea", tareaId, updateData);
}

export async function getSubtareas(tareaId: string): Promise<Subtarea[]> {
  const rows = await getAll<{ id: string; datos: string; gps_lat: number | null; gps_lng: number | null }>(
    "dc_subtarea", "tarea_id = ? ORDER BY created_at ASC", [tareaId]
  );
  return rows.map((r) => ({
    id: r.id,
    datos: JSON.parse(r.datos || "{}"),
    gps_lat: r.gps_lat,
    gps_lng: r.gps_lng,
  }));
}

export async function insertSubtarea(
  tareaId: string,
  datos: Record<string, any>,
  gpsLat?: number | null,
  gpsLng?: number | null,
  gpsAccuracy?: number | null
): Promise<string> {
  const subtareaId = await insert("dc_subtarea", {
    tarea_id: tareaId,
    datos: JSON.stringify(datos),
    gps_lat: gpsLat ?? null,
    gps_lng: gpsLng ?? null,
    gps_accuracy: gpsAccuracy ?? null,
  });

  await recomputeEstadoTarea(tareaId);
  return subtareaId;
}

export async function deleteSubtarea(subtareaId: string, tareaId: string) {
  const db = await getDb();
  await db.runAsync("DELETE FROM dc_subtarea WHERE id = ?", [subtareaId]);
  await recomputeEstadoTarea(tareaId);
}

async function recomputeEstadoTarea(tareaId: string) {
  const tarea = await getOne<{ tarea_tipo_id: string; form_version: number; datos: string }>("dc_tarea", tareaId);
  if (!tarea) return;

  const tipoConfig = await getTareaTipo(tarea.tarea_tipo_id, tarea.form_version);
  if (!tipoConfig) return;

  const datos = JSON.parse(tarea.datos || "{}");
  const subtareas = tipoConfig.subtarea_config ? await getSubtareas(tareaId) : [];
  const estado = computeEstadoTarea(tipoConfig, datos, subtareas);

  const db = await getDb();
  await db.runAsync(
    "UPDATE dc_tarea SET estado = ?, updated_at = ? WHERE id = ?",
    [estado, new Date().toISOString(), tareaId]
  );
}

export async function getTareasParaRecorrida(recorridaId: string) {
  return getAll<{
    id: string;
    recorrida_id: string;
    tarea_tipo_id: string;
    lote_id: string | null;
    ambiente_id: string | null;
    estado: string;
    datos: string;
    titulo: string | null;
    tags: string | null;
    origen: string;
    id_establecimiento: string;
    form_version: number;
    orden: number;
    gps_lat: number | null;
    gps_lng: number | null;
  }>("dc_tarea", "recorrida_id = ? ORDER BY orden ASC", [recorridaId]);
}

// ── Bulk insert (for download from Supabase, no sync) ──

export async function bulkInsert(table: string, records: Record<string, any>[]) {
  if (records.length === 0) return;
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    for (const record of records) {
      const keys = Object.keys(record);
      const placeholders = keys.map(() => "?").join(", ");
      const values = keys.map((k) => {
        const v = record[k];
        if (v === null || v === undefined) return null;
        if (typeof v === "object") return JSON.stringify(v);
        return v;
      });

      await db.runAsync(
        `INSERT OR REPLACE INTO ${table} (${keys.join(", ")}) VALUES (${placeholders})`,
        values
      );
    }
  });
}
