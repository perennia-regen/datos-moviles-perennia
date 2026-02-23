import { File, Paths } from "expo-file-system/next";
import { isAvailableAsync, shareAsync } from "expo-sharing";
import { getAll, getSubtareas, getTareasParaRecorrida } from "../db/operations";
import { getTareaTipo } from "../constants/tareas";

interface Lote {
  id: string;
  nombre_lote: string;
  has: number | null;
}

interface Ambiente {
  id: string;
  nombre: string;
  has: number | null;
  lote_id: string;
}

/**
 * Genera un CSV con datos de tareas de una recorrida y lo comparte
 */
export async function exportCSVRecorrida(recorridaId: string, establecimientoNombre: string) {
  const tareas = await getTareasParaRecorrida(recorridaId);
  const lotes = await getAll<Lote>("dc_lote");
  const ambientes = await getAll<Ambiente>("dc_ambiente");

  const loteMap = new Map(lotes.map((l) => [l.id, l]));
  const ambienteMap = new Map(ambientes.map((a) => [a.id, a]));

  const header = [
    "Tipo Tarea",
    "Nombre Lote",
    "Ambiente",
    "Has",
    "Estado",
    "Datos",
    "Subtareas",
  ].join(",");

  const rows: string[] = [];

  for (const tarea of tareas) {
    const tipo = await getTareaTipo(tarea.tarea_tipo_id, tarea.form_version);
    const lote = tarea.lote_id ? loteMap.get(tarea.lote_id) : null;
    const ambiente = tarea.ambiente_id ? ambienteMap.get(tarea.ambiente_id) : null;
    const datos = JSON.parse(tarea.datos || "{}");
    const subtareas = tipo?.subtarea_config ? await getSubtareas(tarea.id) : [];

    const datosStr = Object.entries(datos)
      .filter(([, v]) => v != null && v !== "")
      .map(([k, v]) => `${k}: ${v}`)
      .join("; ");

    const subtareasStr = subtareas
      .map((s) => Object.entries(s.datos).map(([k, v]) => `${k}=${v}`).join(","))
      .join(" | ");

    rows.push([
      `"${tipo?.nombre ?? tarea.tarea_tipo_id}"`,
      `"${lote?.nombre_lote ?? ""}"`,
      `"${ambiente?.nombre ?? ""}"`,
      ambiente?.has ?? lote?.has ?? "",
      tarea.estado,
      `"${datosStr.replace(/"/g, '""')}"`,
      `"${subtareasStr.replace(/"/g, '""')}"`,
    ].join(","));
  }

  const csv = [header, ...rows].join("\n");
  const fecha = new Date().toISOString().split("T")[0];
  const filename = `${establecimientoNombre.replace(/\s/g, "_")}_${fecha}.csv`;
  const file = new File(Paths.cache, filename);
  await file.write(csv);
  const path = file.uri;

  if (await isAvailableAsync()) {
    await shareAsync(path, {
      mimeType: "text/csv",
      dialogTitle: `Exportar datos - ${establecimientoNombre}`,
    });
  }

  return path;
}
