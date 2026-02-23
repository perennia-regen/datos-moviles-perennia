import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { getOne, updateTarea, getSubtareas, insertSubtarea, deleteSubtarea } from "../../../db/operations";
import { getTareaTipo, type TareaTipoConfig, type Subtarea } from "../../../constants/tareas";
import { StatusBadge } from "../../../components/recorrida/StatusBadge";
import { DynamicForm } from "../../../components/tarea/DynamicForm";
import { SubtareasInput } from "../../../components/tarea/SubtareasInput";
import { useLocation } from "../../../hooks/useLocation";
import { brand, neutral } from "../../../constants/theme";

interface TareaRow {
  id: string;
  recorrida_id: string;
  tarea_tipo_id: string;
  lote_id: string | null;
  ambiente_id: string | null;
  estado: string;
  datos: string;
  titulo: string | null;
  tags: string | null;
  id_establecimiento: string;
  form_version: number;
  gps_lat: number | null;
  gps_lng: number | null;
}

interface LoteRow {
  nombre_lote: string;
  has: number | null;
}

interface AmbienteRow {
  nombre: string;
  has: number | null;
}

export default function TareaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { location } = useLocation();

  const [tarea, setTarea] = useState<TareaRow | null>(null);
  const [tipoConfig, setTipoConfig] = useState<TareaTipoConfig | null>(null);
  const [datos, setDatos] = useState<Record<string, any>>({});
  const [subtareas, setSubtareas] = useState<Subtarea[]>([]);
  const [loteNombre, setLoteNombre] = useState("");
  const [ambienteNombre, setAmbienteNombre] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const t = await getOne<TareaRow>("dc_tarea", id);
      if (!t) return;
      setTarea(t);
      setDatos(JSON.parse(t.datos || "{}"));

      const tipo = await getTareaTipo(t.tarea_tipo_id, t.form_version);
      setTipoConfig(tipo);

      if (tipo?.subtarea_config) {
        const s = await getSubtareas(id);
        setSubtareas(s);
      }

      if (t.lote_id) {
        const lote = await getOne<LoteRow>("dc_lote", t.lote_id);
        if (lote) setLoteNombre(`${lote.nombre_lote}${lote.has ? ` · ${lote.has} ha` : ""}`);
      }
      if (t.ambiente_id) {
        const amb = await getOne<AmbienteRow>("dc_ambiente", t.ambiente_id);
        if (amb) setAmbienteNombre(`${amb.nombre}${amb.has ? ` · ${amb.has} ha` : ""}`);
      }
    } catch (e: any) {
      console.error("Error loading tarea:", e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFieldChange = (key: string, value: any) => {
    setDatos((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!tarea) return;
    setSaving(true);
    try {
      const extraFields: Record<string, any> = {};
      if (location) {
        extraFields.gps_lat = location.latitude;
        extraFields.gps_lng = location.longitude;
        extraFields.gps_accuracy = location.accuracy;
      }
      await updateTarea(tarea.id, datos, extraFields);
      await loadData();
      Alert.alert("Guardado", "Datos guardados correctamente");
    } catch (e: any) {
      console.error("Error saving tarea:", e);
      Alert.alert("Error", "No se pudieron guardar los datos");
    } finally {
      setSaving(false);
    }
  };

  const handleAddSubtarea = async (subtareaDatos: Record<string, any>) => {
    if (!tarea) return;
    await insertSubtarea(
      tarea.id,
      subtareaDatos,
      location?.latitude,
      location?.longitude,
      location?.accuracy
    );
    await loadData();
  };

  const handleDeleteSubtarea = async (subtareaId: string) => {
    if (!tarea) return;
    await deleteSubtarea(subtareaId, tarea.id);
    await loadData();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={brand.primary} />
      </View>
    );
  }

  if (!tarea || !tipoConfig) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Tarea no encontrada</Text>
      </View>
    );
  }

  const formCampos = tipoConfig.campos.filter((c) => c.type !== "fotos");

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: tipoConfig.nombre }} />

      <ScrollView contentContainerStyle={styles.scrollContent} contentInsetAdjustmentBehavior="automatic">
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>{tipoConfig.nombre}</Text>
            <StatusBadge estado={tarea.estado as any} />
          </View>
          {loteNombre ? (
            <Text style={styles.headerSub}>{loteNombre}</Text>
          ) : null}
          {ambienteNombre ? (
            <Text style={styles.headerSub}>{ambienteNombre}</Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <DynamicForm
            campos={formCampos}
            datos={datos}
            onChange={handleFieldChange}
          />
        </View>

        {tipoConfig.subtarea_config && tipoConfig.subtarea_campos && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{tipoConfig.subtarea_config.label}</Text>
            <SubtareasInput
              subtareas={subtareas}
              campos={tipoConfig.subtarea_campos}
              onAdd={handleAddSubtarea}
              onDelete={handleDeleteSubtarea}
              gpsLat={location?.latitude}
              gpsLng={location?.longitude}
              unidadDefault={tipoConfig.subtarea_config.unidad_default}
            />
          </View>
        )}

        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={brand.white} size="small" />
          ) : (
            <Text style={styles.saveBtnText}>Guardar</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: neutral.background },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: neutral.background,
  },
  emptyText: { color: neutral.textMuted, fontSize: 15 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  header: {
    backgroundColor: neutral.surface,
    padding: 14,
    borderRadius: 10,
    borderCurve: "continuous",
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: brand.text },
  headerSub: { fontSize: 13, color: neutral.textSecondary, marginTop: 4 },
  section: {
    backgroundColor: neutral.surface,
    padding: 14,
    borderRadius: 10,
    borderCurve: "continuous",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: brand.text,
    marginBottom: 10,
  },
  saveBtn: {
    backgroundColor: brand.primary,
    borderRadius: 10,
    borderCurve: "continuous",
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { color: brand.white, fontWeight: "700", fontSize: 16 },
});
