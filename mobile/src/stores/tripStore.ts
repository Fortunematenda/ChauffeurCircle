import { create } from "zustand";

type TripState = {
  activeTripId: string | null;
  setActiveTripId: (tripId: string) => void;
  clearActiveTripId: () => void;
};

export const useTripStore = create<TripState>((set) => ({
  activeTripId: null,
  setActiveTripId: (tripId) => set({ activeTripId: tripId }),
  clearActiveTripId: () => set({ activeTripId: null }),
}));
