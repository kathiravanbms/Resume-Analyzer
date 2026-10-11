import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AnalysisRecord, Settings } from "../lib/types";
import {
  loadHistory,
  loadLast,
  loadSettings,
  saveHistory,
  saveLast,
  saveSettings,
} from "../lib/storage";

interface AppState {
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  isConfigured: boolean;
  current: AnalysisRecord | null;
  setCurrent: (record: AnalysisRecord | null) => void;
  history: AnalysisRecord[];
  addRecord: (record: AnalysisRecord) => void;
  removeRecord: (id: string) => void;
  clearHistory: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => loadSettings());
  const [current, setCurrentState] = useState<AnalysisRecord | null>(null);
  const [history, setHistory] = useState<AnalysisRecord[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
    setCurrentState(loadLast());
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      return next;
    });
  }, []);

  const setCurrent = useCallback((record: AnalysisRecord | null) => {
    setCurrentState(record);
    saveLast(record);
  }, []);

  const addRecord = useCallback((record: AnalysisRecord) => {
    setHistory((prev) => {
      const next = [record, ...prev.filter((r) => r.id !== record.id)].slice(
        0,
        50,
      );
      saveHistory(next);
      return next;
    });
  }, []);

  const removeRecord = useCallback((id: string) => {
    setHistory((prev) => {
      const next = prev.filter((r) => r.id !== id);
      saveHistory(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  const value = useMemo<AppState>(
    () => ({
      settings,
      updateSettings,
      isConfigured: Boolean(settings.apiKey.trim() && settings.model.trim()),
      current,
      setCurrent,
      history,
      addRecord,
      removeRecord,
      clearHistory,
    }),
    [
      settings,
      updateSettings,
      current,
      setCurrent,
      history,
      addRecord,
      removeRecord,
      clearHistory,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
