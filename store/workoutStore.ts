import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  notes?: string;
}

interface WorkoutDay {
  day: string;
  exercises: Exercise[];
}

interface WorkoutStore {
  workoutPlan: WorkoutDay[] | null;
  setWorkoutPlan: (plan: WorkoutDay[] | null) => void;
  clearWorkoutPlan: () => void;
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set) => ({
      workoutPlan: null,
      setWorkoutPlan: (plan) => set({ workoutPlan: plan }),
      clearWorkoutPlan: () => set({ workoutPlan: null }),
    }),
    {
      name: "workout-plan-storage", // key for localStorage
    }
  )
);
