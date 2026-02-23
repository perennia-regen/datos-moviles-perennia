import { datosCampo } from "@/lib/supabase";
import type { Database } from "@/types/database";
import { getPendingSyncItems, markSynced, markSyncFailed, SyncErrorType } from "./operations";

type DcTableName = keyof Database["datos_campo"]["Tables"];

// Mapeo de tabla SQLite → tabla Supabase
const TABLE_MAP: Record<string, DcTableName> = {
  dc_recorrida: "dc_recorrida",
  dc_tarea: "dc_tarea",
  dc_subtarea: "dc_subtarea",
  dc_foto: "dc_foto",
};

export function classifyError(error: unknown): { type: SyncErrorType; message: string } {
  const err = error as Record<string, unknown>;
  const msg = (err?.message as string) ?? String(error);
  const code = (err?.code as string) ?? "";
  const status = (err?.status as number) ?? (err?.statusCode as number) ?? 0;

  // Auth errors
  if (status === 401 || status === 403 || msg.includes("JWT") || msg.includes("token")) {
    return { type: "auth", message: "Sesión expirada, iniciá sesión de nuevo" };
  }

  // Network errors
  if (
    msg.includes("network") ||
    msg.includes("fetch") ||
    msg.includes("timeout") ||
    msg.includes("ECONNREFUSED") ||
    msg.includes("Failed to fetch") ||
    code === "PGRST301"
  ) {
    return { type: "network", message: "Sin conexión, se reintentará automáticamente" };
  }

  // Constraint/data errors
  if (
    msg.includes("constraint") ||
    msg.includes("violates") ||
    msg.includes("duplicate") ||
    msg.includes("foreign key") ||
    code === "23505" ||
    code === "23503"
  ) {
    return { type: "constraint", message: `Error de datos: ${msg}` };
  }

  return { type: "unknown", message: msg };
}

export interface SyncResult {
  synced: number;
  failed: number;
  authError: boolean;
}

export async function syncPendingItems(
  idEstablecimiento?: string,
  onProgress?: (synced: number, total: number) => void
): Promise<SyncResult> {
  const items = await getPendingSyncItems(idEstablecimiento) as { id: string; entity: string; entity_id: string; payload: string }[];
  let synced = 0;
  let failed = 0;
  let authError = false;

  for (const item of items) {
    const supabaseTable = TABLE_MAP[item.entity];
    if (!supabaseTable) {
      await markSyncFailed(item.id, `Tabla desconocida: ${item.entity}`, "unknown");
      failed++;
      continue;
    }

    try {
      const payload = JSON.parse(item.payload);
      // Limpiar campos locales que no existen en Supabase
      delete payload.local_uri;

      const { error } = await datosCampo
        .from(supabaseTable)
        .upsert(payload, { onConflict: "id" });

      if (error) {
        const classified = classifyError(error);
        console.error(`Sync error for ${item.entity}/${item.entity_id}:`, error.message);
        await markSyncFailed(item.id, classified.message, classified.type);
        failed++;

        if (classified.type === "auth") {
          authError = true;
          break; // No seguir intentando si la sesión expiró
        }
      } else {
        await markSynced(item.id);
        synced++;
      }
    } catch (e: unknown) {
      const classified = classifyError(e);
      console.error(`Sync exception for ${item.entity}/${item.entity_id}:`, e);
      await markSyncFailed(item.id, classified.message, classified.type);
      failed++;

      if (classified.type === "auth") {
        authError = true;
        break;
      }

      // Si es error de red, no seguir intentando el resto
      if (classified.type === "network") {
        break;
      }
    }

    onProgress?.(synced + failed, items.length);
  }

  return { synced, failed, authError };
}
