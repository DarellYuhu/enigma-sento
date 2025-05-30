import { create } from "zustand";

type States = {
  mapFonts: Map<string, string>;
};

type Actions = {
  setMapFonts: (mapFonts: Map<string, string>) => void;
};

export const useFontMap = create<States & Actions>((set) => ({
  mapFonts: new Map(),
  setMapFonts: (mapFonts: Map<string, string>) => set({ mapFonts }),
}));
