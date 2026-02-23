import { useState, useEffect, useCallback, useRef } from "react";
import NetInfo from "@react-native-community/netinfo";
import { syncPendingItems, SyncResult } from "@/db/sync";
import { getPendingSyncCount, getPendingByEstablecimiento } from "@/db/operations";

interface EstabPending {
  id_establecimiento: string;
  count: number;
}

export function useOfflineSync() {
  const [pendingCount, setPendingCount] = useState(0);
  const [pendingByEstab, setPendingByEstab] = useState<EstabPending[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refreshCount = useCallback(async () => {
    const [count, byEstab] = await Promise.all([
      getPendingSyncCount(),
      getPendingByEstablecimiento(),
    ]);
    setPendingCount(count);
    setPendingByEstab(byEstab);
  }, []);

  const doSync = useCallback(async (idEstablecimiento?: string): Promise<SyncResult | undefined> => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const result = await syncPendingItems(idEstablecimiento);
      await refreshCount();
      return result;
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, refreshCount]);

  // Monitorear conectividad
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  // Auto-sync cuando se detecta conexión
  useEffect(() => {
    if (isConnected && pendingCount > 0 && !isSyncing) {
      doSync();
    }
  }, [isConnected]);

  // Retry periódico: cada 60s revisa si hay items listos para reintentar
  useEffect(() => {
    if (retryTimerRef.current) {
      clearInterval(retryTimerRef.current);
    }

    if (isConnected && pendingCount > 0) {
      retryTimerRef.current = setInterval(async () => {
        if (!isSyncing) {
          const count = await getPendingSyncCount();
          if (count > 0) {
            doSync();
          }
        }
      }, 60_000);
    }

    return () => {
      if (retryTimerRef.current) {
        clearInterval(retryTimerRef.current);
      }
    };
  }, [isConnected, pendingCount, isSyncing]);

  // Contar pendientes al montar
  useEffect(() => {
    refreshCount();
  }, [refreshCount]);

  return {
    pendingCount,
    pendingByEstab,
    isSyncing,
    isConnected,
    doSync,
    refreshCount,
  };
}
