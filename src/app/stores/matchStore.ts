import { create } from "zustand";

// Tipo para el partido
import type { Match } from "@/lib/types";

// Store de Zustand
interface MatchStore {
  matches: Match[];
  addMatch: (match: Match) => void;
}

export const useMatchStore = create<MatchStore>((set) => ({
  matches: [],
  addMatch: (match) => set((state) => ({ matches: [...state.matches, match] })),
}));