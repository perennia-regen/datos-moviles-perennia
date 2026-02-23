import * as SQLite from "expo-sqlite";

const DB_NAME = "perennia.db";

let _db: SQLite.SQLiteDatabase | null = null;
let _dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (_db) return _db;
  if (_dbPromise) return _dbPromise;
  _dbPromise = (async () => {
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    await initSchema(db);
    _db = db;
    return db;
  })();
  return _dbPromise;
}

async function initSchema(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    -- Datos geográficos (readonly, descargados de Supabase)

    CREATE TABLE IF NOT EXISTS dc_capa_gis (
      id TEXT PRIMARY KEY,
      id_establecimiento TEXT NOT NULL,
      nombre TEXT NOT NULL,
      tipo TEXT NOT NULL,
      geojson TEXT NOT NULL,
      metadata TEXT,
      campo_esquema TEXT,
      created_at TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS dc_lote (
      id TEXT PRIMARY KEY,
      id_establecimiento TEXT NOT NULL,
      capa_gis_id TEXT,
      nombre_lote TEXT NOT NULL,
      geometry TEXT NOT NULL,
      has REAL,
      color TEXT,
      estado TEXT DEFAULT 'activo',
      reemplazado_por TEXT,
      atributos TEXT DEFAULT '{}',
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS dc_ambiente (
      id TEXT PRIMARY KEY,
      lote_id TEXT REFERENCES dc_lote(id),
      id_establecimiento TEXT NOT NULL,
      nombre TEXT NOT NULL,
      geometry TEXT NOT NULL,
      has REAL NOT NULL,
      color TEXT,
      estado TEXT DEFAULT 'activo',
      atributos TEXT DEFAULT '{}',
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS dc_ambiente_lote (
      id TEXT PRIMARY KEY,
      id_establecimiento TEXT NOT NULL,
      lote_id TEXT NOT NULL,
      ambiente_id TEXT NOT NULL,
      nombre_ambiente TEXT NOT NULL,
      nombre_lote TEXT NOT NULL,
      geometry TEXT NOT NULL,
      has REAL NOT NULL,
      porcentaje_lote REAL NOT NULL,
      color TEXT,
      created_at TEXT
    );

    -- Tipos de tarea (readonly, descargados de Supabase)

    CREATE TABLE IF NOT EXISTS dc_tarea_tipo (
      id TEXT NOT NULL,
      nombre TEXT NOT NULL,
      nivel TEXT NOT NULL,
      version INTEGER NOT NULL DEFAULT 1,
      orden INTEGER DEFAULT 0,
      campos TEXT NOT NULL,
      subtarea_campos TEXT,
      subtarea_config TEXT,
      estado TEXT DEFAULT 'activo',
      created_at TEXT,
      updated_at TEXT,
      PRIMARY KEY (id, version)
    );

    CREATE TABLE IF NOT EXISTS dc_tarea_tipo_servicio (
      tarea_tipo_id TEXT NOT NULL,
      tarea_tipo_version INTEGER NOT NULL DEFAULT 1,
      servicio_tipo TEXT NOT NULL,
      auto_generar INTEGER DEFAULT 1,
      PRIMARY KEY (tarea_tipo_id, tarea_tipo_version, servicio_tipo)
    );

    -- Servicios y recorridas

    CREATE TABLE IF NOT EXISTS dc_servicio (
      id_servicio TEXT PRIMARY KEY,
      id_establecimiento TEXT,
      nombre_establecimiento TEXT,
      servicio TEXT,
      fecha TEXT,
      fecha_fin TEXT,
      estado_trabajo INTEGER,
      educadores TEXT,
      downloaded_at TEXT
    );

    CREATE TABLE IF NOT EXISTS dc_recorrida (
      id TEXT PRIMARY KEY,
      id_establecimiento TEXT NOT NULL,
      id_servicio TEXT,
      educador_id INTEGER,
      capa_gis_id TEXT,
      nombre TEXT,
      fecha TEXT NOT NULL,
      observaciones_generales TEXT,
      estado TEXT DEFAULT 'en_curso',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Tareas y subtareas

    CREATE TABLE IF NOT EXISTS dc_tarea (
      id TEXT PRIMARY KEY,
      recorrida_id TEXT NOT NULL REFERENCES dc_recorrida(id),
      tarea_tipo_id TEXT NOT NULL,
      lote_id TEXT REFERENCES dc_lote(id),
      ambiente_id TEXT,
      estado TEXT DEFAULT 'sin_iniciar',
      datos TEXT DEFAULT '{}',
      titulo TEXT,
      tags TEXT,
      origen TEXT DEFAULT 'campo',
      id_establecimiento TEXT NOT NULL,
      form_version INTEGER DEFAULT 1,
      orden INTEGER DEFAULT 0,
      gps_lat REAL,
      gps_lng REAL,
      gps_accuracy REAL,
      gps_objetivo_lat REAL,
      gps_objetivo_lng REAL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS dc_subtarea (
      id TEXT PRIMARY KEY,
      tarea_id TEXT NOT NULL REFERENCES dc_tarea(id),
      datos TEXT DEFAULT '{}',
      gps_lat REAL,
      gps_lng REAL,
      gps_accuracy REAL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Fotos

    CREATE TABLE IF NOT EXISTS dc_foto (
      id TEXT PRIMARY KEY,
      tarea_id TEXT,
      local_uri TEXT,
      storage_path TEXT,
      descripcion TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Infraestructura

    CREATE TABLE IF NOT EXISTS sync_queue (
      id TEXT PRIMARY KEY,
      entity TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      operation TEXT NOT NULL,
      payload TEXT,
      status TEXT DEFAULT 'pending',
      attempts INTEGER DEFAULT 0,
      next_retry_at TEXT,
      last_error TEXT,
      id_establecimiento TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    -- Indices

    CREATE INDEX IF NOT EXISTS idx_capa_gis_estab ON dc_capa_gis(id_establecimiento);
    CREATE INDEX IF NOT EXISTS idx_capa_gis_tipo ON dc_capa_gis(tipo);
    CREATE INDEX IF NOT EXISTS idx_lote_estab ON dc_lote(id_establecimiento);
    CREATE INDEX IF NOT EXISTS idx_ambiente_lote_id ON dc_ambiente(lote_id);
    CREATE INDEX IF NOT EXISTS idx_amb_lote_estab ON dc_ambiente_lote(id_establecimiento);
    CREATE INDEX IF NOT EXISTS idx_amb_lote_lote ON dc_ambiente_lote(lote_id);
    CREATE INDEX IF NOT EXISTS idx_amb_lote_amb ON dc_ambiente_lote(ambiente_id);
    CREATE INDEX IF NOT EXISTS idx_tarea_recorrida ON dc_tarea(recorrida_id);
    CREATE INDEX IF NOT EXISTS idx_tarea_lote ON dc_tarea(lote_id);
    CREATE INDEX IF NOT EXISTS idx_tarea_tipo ON dc_tarea(tarea_tipo_id);
    CREATE INDEX IF NOT EXISTS idx_subtarea_tarea ON dc_subtarea(tarea_id);
    CREATE INDEX IF NOT EXISTS idx_foto_tarea ON dc_foto(tarea_id);
    CREATE INDEX IF NOT EXISTS idx_sync_status ON sync_queue(status);
  `);

  await migrateSchema(db);
}

async function migrateSchema(db: SQLite.SQLiteDatabase) {
  const tables = await db.getAllAsync<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type='table'"
  );
  const tableNames = tables.map((t) => t.name);

  // Migrar dc_muestra → dc_subtarea (DB pre-existentes)
  if (tableNames.includes("dc_muestra")) {
    // Copiar datos existentes a dc_subtarea si tiene registros
    const count = await db.getFirstAsync<{ c: number }>(
      "SELECT COUNT(*) as c FROM dc_muestra"
    );
    if (count && count.c > 0) {
      await db.execAsync(`
        INSERT OR IGNORE INTO dc_subtarea (id, tarea_id, datos, gps_lat, gps_lng, gps_accuracy, created_at)
        SELECT id, tarea_id, json_object('stock_kgms_ha', valor), gps_lat, gps_lng, gps_accuracy, created_at
        FROM dc_muestra
      `);
    }
    await db.execAsync("DROP TABLE dc_muestra");
  }

  // Eliminar dc_medicion (legacy)
  if (tableNames.includes("dc_medicion")) {
    await db.execAsync("DROP TABLE dc_medicion");
  }

  // Agregar columnas gps_objetivo a dc_tarea (DBs pre-existentes)
  if (tableNames.includes("dc_tarea")) {
    const cols = await db.getAllAsync<{ name: string }>("PRAGMA table_info(dc_tarea)");
    if (!cols.some((c) => c.name === "gps_objetivo_lat")) {
      await db.execAsync("ALTER TABLE dc_tarea ADD COLUMN gps_objetivo_lat REAL");
      await db.execAsync("ALTER TABLE dc_tarea ADD COLUMN gps_objetivo_lng REAL");
    }
  }
}

export async function resetDb() {
  if (_db) {
    await _db.closeAsync();
    _db = null;
  }
  _dbPromise = null;
  await SQLite.deleteDatabaseAsync(DB_NAME);
}
