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

interface FormData {
  gender: string;
  level: string;
  goal: string;
  days: string;
  split: string;
}

interface WorkoutStore {
  workoutPlan: WorkoutDay[] | null;
  formData: FormData | null;
  setWorkoutPlan: (plan: WorkoutDay[] | null) => void;
  setFormData: (data: FormData | null) => void;
  clearWorkoutPlan: () => void;
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set) => ({
      workoutPlan: null,
      formData: null,
      setWorkoutPlan: (plan) => set({ workoutPlan: plan }),
      setFormData: (data) => set({ formData: data }),
      clearWorkoutPlan: () => set({ workoutPlan: null, formData: null }),
    }),
    {
      name: "workout-plan-storage", // key for localStorage
    }
  )
);