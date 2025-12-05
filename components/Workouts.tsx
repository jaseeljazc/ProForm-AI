import Link from 'next/link';
import React, { useState } from 'react';
import { Card } from './ui/card';
import { useWorkoutStore } from '@/store/workoutStore';
import { Button } from './ui/button';
import { RefreshCw, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type WorkoutsProps = {
  handleSubmit: (e: React.FormEvent) => void | Promise<void>;
  loading: boolean;
};

const Workouts: React.FC<WorkoutsProps> = ({ handleSubmit, loading }) => {
  const workoutPlan = useWorkoutStore((state) => state.workoutPlan);

  const [navLoading, setNavLoading] = useState(false);

  const savePlan = () => {
    if (workoutPlan) {
      const savedPlans = JSON.parse(localStorage.getItem("workoutPlans") || "[]");
      savedPlans.push({
        workoutDays: workoutPlan,
        date: new Date().toISOString(),
      });
      localStorage.setItem("workoutPlans", JSON.stringify(savedPlans));

      toast("Saved!", {
        description: "Workout plan saved to your weekly overview.",
      });
    }
  };

  const handleNavigate = async (href: string) => {
    setNavLoading(true);
    await new Promise((res) => setTimeout(res, 400)); // small delay for smooth feel
    window.location.href = href;
  };

  return (
    <div className="relative">

      {/* 🔥 FULL SCREEN LOADING OVERLAY */}
      {navLoading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <Loader2 className="h-12 w-12 text-white animate-spin" />
        </div>
      )}

      {workoutPlan && (
        <div className="space-y-6 animate-fade-in">

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-4">
            <Button
              onClick={() => handleSubmit(new Event("submit") as any)}
              variant="outline"
              disabled={loading}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </Button>

            <Button
              onClick={savePlan}
              className="bg-gradient-primary hover:opacity-90"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Plan
            </Button>
          </div>

          {/* WORKOUT DAYS */}
          {workoutPlan.map((day, index) => (
            <Card key={index} className="glass-card p-6">
              <h3 className="text-xl font-bold mb-4">{day.day}</h3>

              <div className="space-y-4">
                {day.exercises.map((exercise, idx) => (
                  <div
                    key={idx}
                    onClick={() =>
                      handleNavigate(`/workout-plan/exercise/${exercise.name}`)
                    }
                    className="cursor-pointer p-4 rounded-lg bg-secondary/50 border border-border/50 hover:bg-secondary/70 transition mb-5"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{exercise.name}</h4>
                      <span className="text-sm text-muted-foreground">
                        {exercise.sets} × {exercise.reps}
                      </span>
                    </div>

                    {exercise.notes && (
                      <p className="text-sm text-muted-foreground">
                        {exercise.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Workouts;
