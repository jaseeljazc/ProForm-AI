"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles, Save, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Link from "next/link";
import { useWorkoutStore } from "@/store/workoutStore";

interface WorkoutDay {
  day: string;
  exercises: Array<{
    name: string;
    sets: number;
    reps: string;
    notes?: string;
  }>;
}

const WorkoutPlan = () => {
  const [formData, setFormData] = useState({
    gender: "",
    level: "",
    goal: "",
    days: "",
    split: "",
  });
  const [loading, setLoading] = useState(false);


const workoutPlan = useWorkoutStore((state) => state.workoutPlan);
const setWorkoutPlan = useWorkoutStore((state) => state.setWorkoutPlan);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke(
        "generate-workout-plan",
        {
          body: formData,
        }
      );

      if (error) throw error;

      setWorkoutPlan(data.workoutDays);
      toast({
        title: "Workout Plan Generated!",
        description: "Your personalized workout plan is ready.",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to generate workout plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const savePlan = () => {
    if (workoutPlan) {
      const savedPlans = JSON.parse(
        localStorage.getItem("workoutPlans") || "[]"
      );
      savedPlans.push({
        workoutDays: workoutPlan,
        date: new Date().toISOString(),
      });
      localStorage.setItem("workoutPlans", JSON.stringify(savedPlans));
      toast({
        title: "Saved!",
        description: "Workout plan saved to your weekly overview.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">
              AI Workout
              <span className="gradient-text"> Planner</span>
            </h1>
            <p className="text-muted-foreground">
              Get a customized workout routine based on your goals
            </p>
          </div>

          <Card className="glass-card p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, gender: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="level">Fitness Level</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, level: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="goal">Goal</Label>
                  <Select
                    value={formData.goal}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, goal: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                      <SelectItem value="weight-loss">Weight Loss</SelectItem>
                      <SelectItem value="strength">Strength</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="days">Days Per Week</Label>
                  <Select
                    value={formData.days}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, days: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Days</SelectItem>
                      <SelectItem value="4">4 Days</SelectItem>
                      <SelectItem value="5">5 Days</SelectItem>
                      <SelectItem value="6">6 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="split">Body Focus</Label>
                  <Select
                    value={formData.split}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, split: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select split" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-body">Full Body</SelectItem>
                      <SelectItem value="upper-lower">
                        Upper/Lower Split
                      </SelectItem>
                      <SelectItem value="push-pull-legs">
                        Push/Pull/Legs
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Workout Plan
                  </>
                )}
              </Button>
            </form>
          </Card>

          {workoutPlan && (
            <div className="space-y-6 animate-fade-in">
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

              {workoutPlan.map((day, index) => (
                <Card key={index} className="glass-card p-6">
                  <h3 className="text-xl font-bold mb-4">{day.day}</h3>

                  <div className="space-y-4">
                    {day.exercises.map((exercise, idx) => (
                      <Link
                        href={`workout-plan/exercise/${encodeURIComponent(exercise.name)}`}
                        key={idx}
                        className="block"
                      >
                        <div className="p-4 rounded-lg bg-secondary/50 border border-border/50 hover:bg-secondary/70 transition">
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
                      </Link>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

    </div>
  );
};

export default WorkoutPlan;
