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
import Workouts from "@/components/Workouts";

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
    gender: "male",
    level: "beginner",
    goal: "muscle-gain",
    days: "5",
    split: "push-pull-legs",
  });
  const [loading, setLoading] = useState(false);

  const workoutPlan = useWorkoutStore((state) => state.workoutPlan);
  const setWorkoutPlan = useWorkoutStore((state) => state.setWorkoutPlan);
  const setStoreFormData = useWorkoutStore((state) => state.setFormData);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("🚀 Sending request with data:", formData);

      const res = await fetch("/api/generate-workout-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("📡 Response status:", res.status);

      let data;
      try {
        // CRITICAL FIX: Attempt to parse JSON
        data = await res.json();
        console.log("📦 Response data:", data);
      } catch (jsonError) {
        // If res.json() fails, it means the server didn't send JSON (e.g., crashed)
        const errorText = await res.text();
        console.error("❌ Failed to parse JSON. Raw response:", errorText);
        throw new Error(
          `Server returned a non-JSON error (Status: ${res.status}).`
        );
      }

      // Ensure data is an object before reading properties (Defense)
      if (!data || typeof data !== "object") {
        throw new Error(`Invalid response format received from server.`);
      }

      if (!res.ok) {
        // Now we safely access properties from the parsed 'data' object
        const errorMessage =
          data.error || data.details || "Failed to generate workout plan";
        console.error("❌ Server error:", errorMessage);

        throw new Error(errorMessage);
      }

      // Validate the success response structure
      if (!data.workoutDays || !Array.isArray(data.workoutDays)) {
        console.error("❌ Invalid response structure:", data);
        throw new Error("Invalid workout plan format received");
      }

      console.log("✅ Workout plan received:", data.workoutDays.length, "days");
      setWorkoutPlan(data.workoutDays);
      setStoreFormData(formData); // 👈 Save formData to Zustand store

      toast({
        title: "Workout Plan Generated!",
        description: "Your personalized workout plan is ready.",
      });
    } catch (error: any) {
      console.error("❌ Error details:", error);

      toast({
        title: "Error",
        description:
          error.message || "Failed to generate workout plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold mb-2">
              AI Workout
              <span className="gradient-text"> Planner</span>
            </h1>
            <p className="text-muted-foreground">
              Get a customized workout routine based on your goals
            </p>
          </div>
          <div className="flex justify-center px-0">
            <Card className="glass-card p-6 mb-8 md:min-w-xl">
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
                        <SelectItem value="intermediate">
                          Intermediate
                        </SelectItem>
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
                        <SelectItem value="bro-split">Bro Split</SelectItem>
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
          </div>

          <Workouts handleSubmit={handleSubmit} loading={loading} />
        </div>
      </main>
    </div>
  );
};

export default WorkoutPlan;