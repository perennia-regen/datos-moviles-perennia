import { getDb } from "./schema";
import { v4 as uuid } from "uuid";

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
  const [lotesRes, ambientesRes, capasGisRes, ambLotesRes] = await Promise.all([
    datosCampoClient.from("dc_lote").select("*").eq("id_establecimiento", idEstablecimiento).eq("estado", "activo"),
    datosCampoClient.from("dc_ambiente").select("*").eq("id_establecimiento", idEstablecimiento).eq("estado", "activo"),
    datosCampoClient.from("dc_capa_gis").select("*").eq("id_establecimiento", idEstablecimiento),
    datosCampoClient.from("dc_ambiente_lote").select("*").eq("id_establecimiento", idEstablecimiento),
  ]);

  if (lotesRes.error) throw lotesRes.error;
  if (ambientesRes.error) throw ambientesRes.error;
  if (capasGisRes.error) throw capasGisRes.error;
  if (ambLotesRes.error) throw ambLotesRes.error;

  const remoteLotes = (lotesRes.data ?? []).map((l: any) => ({
    ...l,
    geometry: typeof l.geometry === "object" ? JSON.stringify(l.geometry) : l.geometry,
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
