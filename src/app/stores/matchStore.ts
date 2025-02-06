import { create } from "zustand";

// Tipo para el partido
interface Match {
  homeTeam: string;
  awayTeam: string;
  date: Date;
  time: string;
  location: string;
}

// Store de Zustand
interface MatchStore {
  matches: Match[];
  addMatch: (match: Match) => void;
}

export const useMatchStore = create<MatchStore>((set) => ({
  matches: [],
  addMatch: (match) => set((state) => ({ matches: [...state.matches, match] })),
}));