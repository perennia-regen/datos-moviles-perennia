import "react-native-url-polyfill/auto";
import * as SecureStore from "expo-secure-store";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const SUPABASE_URL = "https://fkrppgqtlgoxnonohenu.supabase.co";
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

const secureStorage = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: secureStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper tipado para queries al schema datos_campo
export const datosCampo = supabase.schema("datos_campo");

// Type helpers — schema datos_campo
type DcTables = Database["datos_campo"]["Tables"];
export type DcLote = DcTables["dc_lote"]["Row"];
export type DcAmbiente = DcTables["dc_ambiente"]["Row"];
export type DcAmbienteLote = DcTables["dc_ambiente_lote"]["Row"];
export type DcCapaGis = DcTables["dc_capa_gis"]["Row"];
export type DcRecorrida = DcTables["dc_recorrida"]["Row"];
export type DcTarea = DcTables["dc_tarea"]["Row"];
export type DcSubtarea = DcTables["dc_subtarea"]["Row"];
export type DcFoto = DcTables["dc_foto"]["Row"];
export type DcTareaTipo = DcTables["dc_tarea_tipo"]["Row"];
export type DcTareaTipoServicio = DcTables["dc_tarea_tipo_servicio"]["Row"];
