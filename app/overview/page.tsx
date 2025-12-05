"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Calendar,
  UtensilsCrossed,
  Dumbbell,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Overview = () => {
  const [mealPlans, setMealPlans] = useState<any[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<any[]>([]);
  const [expandedWorkout, setExpandedWorkout] = useState<number | null>(null);
  const [expandedMeal, setExpandedMeal] = useState<number | null>(null);
  const [navLoading, setNavLoading] = useState<string | null>(null);
  const [deleteWorkoutId, setDeleteWorkoutId] = useState<number | null>(null);
  const [deleteMealId, setDeleteMealId] = useState<number | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = () => {
    const meals = JSON.parse(localStorage.getItem("mealPlans") || "[]");
    const workouts = JSON.parse(localStorage.getItem("workoutPlans") || "[]");
    setMealPlans(meals);
    setWorkoutPlans(workouts);
  };

  const handleNavigate = async (href: string, exerciseName: string) => {
    setNavLoading(exerciseName);
    await new Promise((res) => setTimeout(res, 100));
    window.location.href = href;
  };

  const deleteMealPlan = (index: number) => {
    const updated = mealPlans.filter((_, i) => i !== index);
    localStorage.setItem("mealPlans", JSON.stringify(updated));
    setMealPlans(updated);
    setDeleteMealId(null);
    toast({ title: "Deleted", description: "Meal plan removed." });
  };

  const deleteWorkoutPlan = (index: number) => {
    const updated = workoutPlans.filter((_, i) => i !== index);
    localStorage.setItem("workoutPlans", JSON.stringify(updated));
    setWorkoutPlans(updated);
    setDeleteWorkoutId(null);
    toast({ title: "Deleted", description: "Workout plan removed." });
  };

  const toggleWorkoutExpand = (index: number) => {
    setExpandedWorkout(expandedWorkout === index ? null : index);
  };

  const toggleMealExpand = (index: number) => {
    setExpandedMeal(expandedMeal === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-10 text-center space-y-3">
          <h1 className="text-5xl font-bold tracking-tight">
            Weekly
            <span className="gradient-text"> Overview</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            View and manage your saved plans
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Meal Plans */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <UtensilsCrossed className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Meal Plans</h2>
              <span className="ml-auto text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                {mealPlans.length} saved
              </span>
            </div>

            {mealPlans.length === 0 ? (
              <Card className="glass-card p-12 text-center">
                <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground text-lg">
                  No saved meal plans yet
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Create your first meal plan to see it here
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {mealPlans.map((plan, index) => (
                  <Card
                    key={index}
                    className="glass-card overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">
                            {new Date(plan.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleMealExpand(index)}
                            className="hover:bg-secondary"
                          >
                            {expandedMeal === index ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteMealId(index)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                          <span className="text-xs text-muted-foreground">
                            Total Calories
                          </span>
                          <div className="text-xl font-bold mt-1">
                            {plan.totalCalories}
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                          <span className="text-xs text-muted-foreground">
                            Total Protein
                          </span>
                          <div className="text-xl font-bold mt-1">
                            {plan.totalProtein}g
                          </div>
                        </div>
                      </div>

                      {plan.formData && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {plan.formData.goal?.replace('-', ' ') || "N/A"}
                          </span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {plan.formData.diet || "N/A"}
                          </span>
                        </div>
                      )}

                      {expandedMeal === index && plan.mealDays && (
                        <div className="mt-4 pt-4 border-t border-border/50 space-y-4">
                          {plan.mealDays.map((meal: any, mealIdx: number) => (
                            <div key={mealIdx} className="space-y-2">
                              <h4 className="font-semibold text-sm text-primary">
                                {meal.name}
                              </h4>
                              <p className="text-sm text-muted-foreground pl-3 mb-2">
                                {meal.meal}
                              </p>
                              <div className="grid grid-cols-4 gap-2 pl-3">
                                <div className="text-xs">
                                  <span className="text-muted-foreground">Cal:</span>
                                  <div className="font-semibold">{meal.calories}</div>
                                </div>
                                <div className="text-xs">
                                  <span className="text-muted-foreground">P:</span>
                                  <div className="font-semibold">{meal.protein}g</div>
                                </div>
                                <div className="text-xs">
                                  <span className="text-muted-foreground">C:</span>
                                  <div className="font-semibold">{meal.carbs}g</div>
                                </div>
                                <div className="text-xs">
                                  <span className="text-muted-foreground">F:</span>
                                  <div className="font-semibold">{meal.fat}g</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Workout Plans */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Dumbbell className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Workout Plans</h2>
              <span className="ml-auto text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                {workoutPlans.length} saved
              </span>
            </div>

            {workoutPlans.length === 0 ? (
              <Card className="glass-card p-12 text-center">
                <Dumbbell className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground text-lg">
                  No saved workout plans yet
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Create your first workout plan to see it here
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {workoutPlans.map((plan, index) => (
                  <Card
                    key={index}
                    className="glass-card overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">
                            {new Date(plan.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleWorkoutExpand(index)}
                            className="hover:bg-secondary"
                          >
                            {expandedWorkout === index ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteWorkoutId(index)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                          <span className="text-xs text-muted-foreground">
                            Training Days
                          </span>
                          <div className="text-xl font-bold mt-1">
                            {plan.workoutDays?.length || 0}
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                          <span className="text-xs text-muted-foreground">
                            Total Exercises
                          </span>
                          <div className="text-xl font-bold mt-1">
                            {plan.workoutDays?.reduce(
                              (acc: number, day: any) =>
                                acc + (day.exercises?.length || 0),
                              0
                            ) || 0}
                          </div>
                        </div>
                          {plan.formData && (
                       <div className="flex flex-wrap gap-2 mt-4">
  {/* Goal */}
  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
    {plan.formData.goal?.replace('-', ' ') || "N/A"}
  </span>

  {/* Split Type */}
  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
    {plan.formData.split?.replace('-', ' ') || "N/A"}
  </span>
</div>

                      )}
                      </div>

                      {plan.formData && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {plan.formData.level || "N/A"}
                          </span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {plan.formData.goal || "N/A"}
                          </span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {plan.formData.split || "N/A"}
                          </span>
                        </div>
                      )}

                      {expandedWorkout === index && plan.workoutDays && (
                        <div className="mt-4 pt-4 border-t border-border/50 space-y-4">
                          {plan.workoutDays.map((day: any, dayIdx: number) => (
                            <div key={dayIdx} className="space-y-2">
                              <h4 className="font-semibold text-sm text-primary">
                                {day.day}
                              </h4>
                              <div className="space-y-1.5 pl-3">
                                {day.exercises?.map(
                                  (exercise: any, exIdx: number) => (
                                    <div
                                      key={exIdx}
                                      className="text-sm flex justify-between items-start gap-2"
                                    >
                                      <div
                                        className="cursor-pointer hover:text-primary transition-colors flex-1"
                                        onClick={() =>
                                          handleNavigate(
                                            `/workout-plan/exercise/${exercise.name}`,
                                            exercise.name
                                          )
                                        }
                                      >
                                        <span className="text-muted-foreground flex items-center gap-1">
                                          • {exercise.name}
                                          {navLoading === exercise.name && (
                                            <Loader2 className="h-3 w-3 animate-spin inline-block ml-1" />
                                          )}
                                        </span>
                                      </div>
                                      <span className="text-xs text-muted-foreground/70 whitespace-nowrap">
                                        {exercise.sets}×{exercise.reps}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          ))}
                          
                          {plan.formData && (
                            <div className="pt-3 border-t border-border/50">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Split Type:</span>
                                <span className="text-xs bg-secondary/50 text-foreground px-3 py-1 rounded-full border border-border/50 font-medium">
                                  {plan.formData.split || "N/A"}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Workout Confirmation Popup */}
      {deleteWorkoutId !== null && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setDeleteWorkoutId(null)}
        >
          <div 
            className="bg-background rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Delete Workout Plan?</h2>
                <p className="text-muted-foreground">
                  This action cannot be undone. This will permanently delete the saved workout plan.
                </p>
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setDeleteWorkoutId(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => deleteWorkoutPlan(deleteWorkoutId)}
                  className="flex-1 bg-destructive text-white hover:bg-destructive/90"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Meal Confirmation Popup */}
      {deleteMealId !== null && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setDeleteMealId(null)}
        >
          <div 
            className="bg-background rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Delete Meal Plan?</h2>
                <p className="text-muted-foreground">
                  This action cannot be undone. This will permanently delete the saved meal plan.
                </p>
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setDeleteMealId(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => deleteMealPlan(deleteMealId)}
                  className="flex-1 bg-destructive text-white hover:bg-destructive/90"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;