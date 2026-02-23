import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";
import type { TareaTipoConfig } from "@/constants/tareas";
import { brand, neutral } from "@/constants/theme";

interface LoteOption {
  id: string;
  nombre_lote: string;
  has: number | null;
}

interface AmbienteOption {
  id: string;
  nombre: string;
  has: number | null;
  lote_id: string;
}

interface AddTaskSheetProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (tipoId: string, loteId: string | null, ambienteId: string | null) => void;
  tareaTipos: TareaTipoConfig[];
  lotes: LoteOption[];
  ambientes: AmbienteOption[];
}

type Step = "tipo" | "lote" | "ambiente";

export function AddTaskSheet({ visible, onClose, onAdd, tareaTipos, lotes, ambientes }: AddTaskSheetProps) {
  const [step, setStep] = useState<Step>("tipo");
  const [selectedTipo, setSelectedTipo] = useState<TareaTipoConfig | null>(null);
  const [selectedLoteId, setSelectedLoteId] = useState<string | null>(null);

  const reset = () => {
    setStep("tipo");
    setSelectedTipo(null);
    setSelectedLoteId(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSelectTipo = (tipo: TareaTipoConfig) => {
    setSelectedTipo(tipo);
    if (tipo.nivel === "libre") {
      // Tarea libre: no requiere lote ni ambiente
      onAdd(tipo.id, null, null);
      handleClose();
    } else {
      setStep("lote");
    }
  };

  const handleSelectLote = (loteId: string) => {
    setSelectedLoteId(loteId);
    if (selectedTipo?.nivel === "ambiente") {
      const loteAmbientes = ambientes.filter((a) => a.lote_id === loteId);
      if (loteAmbientes.length > 0) {
        setStep("ambiente");
      } else {
        // Sin ambientes: crear a nivel lote
        onAdd(selectedTipo!.id, loteId, null);
        handleClose();
      }
    } else {
      // Tarea nivel lote
      onAdd(selectedTipo!.id, loteId, null);
      handleClose();
    }
  };

  const handleSelectAmbiente = (ambienteId: string) => {
    onAdd(selectedTipo!.id, selectedLoteId, ambienteId);
    handleClose();
  };

  const filteredAmbientes = selectedLoteId
    ? ambientes.filter((a) => a.lote_id === selectedLoteId)
    : [];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>
              {step === "tipo" && "Agregar Tarea"}
              {step === "lote" && `${selectedTipo?.nombre} — Elegir lote`}
              {step === "ambiente" && "Elegir ambiente"}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.closeBtn}>Cancelar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.sheetBody}>
            {step === "tipo" &&
              tareaTipos.map((tipo) => (
                <TouchableOpacity
                  key={tipo.id}
                  style={styles.optionRow}
                  onPress={() => handleSelectTipo(tipo)}
                >
                  <Text style={styles.optionText}>{tipo.nombre}</Text>
                  <Text style={styles.optionLevel}>
                    {tipo.nivel === "lote" ? "Por lote" : tipo.nivel === "ambiente" ? "Por ambiente" : "Libre"}
                  </Text>
                </TouchableOpacity>
              ))}

            {step === "lote" &&
              lotes.map((lote) => (
                <TouchableOpacity
                  key={lote.id}
                  style={styles.optionRow}
                  onPress={() => handleSelectLote(lote.id)}
                >
                  <Text style={styles.optionText}>{lote.nombre_lote}</Text>
                  {lote.has != null && (
                    <Text style={styles.optionLevel}>{lote.has} ha</Text>
                  )}
                </TouchableOpacity>
              ))}

            {step === "ambiente" &&
              filteredAmbientes.map((amb) => (
                <TouchableOpacity
                  key={amb.id}
                  style={styles.optionRow}
                  onPress={() => handleSelectAmbiente(amb.id)}
                >
                  <Text style={styles.optionText}>{amb.nombre}</Text>
                  {amb.has != null && (
                    <Text style={styles.optionLevel}>{amb.has} ha</Text>
                  )}
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: neutral.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "60%",
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: neutral.borderSubtle,
  },
  sheetTitle: { fontSize: 16, fontWeight: "700", color: brand.text },
  closeBtn: { fontSize: 14, color: brand.primary, fontWeight: "600" },
  sheetBody: { padding: 8 },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    marginHorizontal: 8,
    marginVertical: 3,
    backgroundColor: neutral.surface,
    borderRadius: 8,
    borderCurve: "continuous",
  },
  optionText: { fontSize: 15, fontWeight: "500", color: brand.text },
  optionLevel: { fontSize: 12, color: neutral.textMuted },
});
