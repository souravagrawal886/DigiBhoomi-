import { useSyncExternalStore } from "react";
import {
  initialNotifications,
  mockRecords,
  type AppNotification,
  type LandRecord,
} from "@/data/mockData";

export interface FieldEdit {
  field: string;
  original: string;
  updated: string;
  actor: string;
}

export interface SessionUser {
  name: string;
  role: string;
  office: string;
  email: string;
}

export interface AppState {
  user: SessionUser | null;
  records: LandRecord[];
  notifications: AppNotification[];
  edits: Record<string, FieldEdit[]>;
  activeRecordId: string | null;
  language: "en" | "hi";
}

const initialState: AppState = {
  user: null,
  records: mockRecords,
  notifications: initialNotifications,
  edits: {},
  activeRecordId: null,
  language: "en",
};

let state: AppState = initialState;
const listeners = new Set<() => void>();

function set(patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) {
  const next = typeof patch === "function" ? patch(state) : patch;
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

export const store = {
  getState: () => state,
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  login(user: SessionUser) {
    set({ user });
  },
  logout() {
    set({ user: null });
  },
  setLanguage(language: "en" | "hi") {
    set({ language });
  },
  setActiveRecord(id: string | null) {
    set({ activeRecordId: id });
  },
  updateRecord(id: string, patch: Partial<LandRecord>) {
    set((s) => ({
      records: s.records.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));
  },
  recordEdit(id: string, edit: FieldEdit) {
    set((s) => {
      const existing = s.edits[id] ?? [];
      const others = existing.filter((e) => e.field !== edit.field);
      return { edits: { ...s.edits, [id]: [...others, edit] } };
    });
  },
  appendAudit(id: string, label: string, actor: string, detail?: string) {
    set((s) => ({
      records: s.records.map((r) =>
        r.id === id
          ? {
              ...r,
              audit: [
                ...r.audit,
                {
                  label,
                  actor,
                  detail,
                  timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
                },
              ],
            }
          : r,
      ),
    }));
  },
  addRecord(record: LandRecord) {
    set((s) => ({ records: [record, ...s.records] }));
  },
  notify(n: Omit<AppNotification, "id" | "read" | "time">) {
    set((s) => ({
      notifications: [
        { ...n, id: `n${Date.now()}`, read: false, time: "just now" },
        ...s.notifications,
      ],
    }));
  },
  markAllRead() {
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
  },
};

export function useAppStore<T>(selector: (s: AppState) => T): T {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(initialState),
  );
}
