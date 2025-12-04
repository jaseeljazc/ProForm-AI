'use client'

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar, UtensilsCrossed, Dumbbell, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const Overview = () => {
  const [mealPlans, setMealPlans] = useState<any[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<any[]>([]);
  const [expandedWorkout, setExpandedWorkout] = useState<number | null>(null);
  const [expandedMeal, setExpandedMeal] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = () => {
    const meals = JSON.parse(localStorage.getItem('mealPlans') || '[]');
    const workouts = JSON.parse(localStorage.getItem('workoutPlans') || '[]');
    setMealPlans(meals);
    setWorkoutPlans(workouts);
  };

  const deleteMealPlan = (index: number) => {
    const updated = mealPlans.filter((_, i) => i !== index);
    localStorage.setItem('mealPlans', JSON.stringify(updated));
    setMealPlans(updated);
    toast({ title: "Deleted", description: "Meal plan removed." });
  };

  const deleteWorkoutPlan = (index: number) => {
    const updated = workoutPlans.filter((_, i) => i !== index);
    localStorage.setItem('workoutPlans', JSON.stringify(updated));
    setWorkoutPlans(updated);
    toast({ title: "Deleted", description: "Workout plan removed." });
  };

  const toggleWorkoutExpand = (index: number) => {
    setExpandedWorkout(expandedWorkout === index ? null : index);
  };

  const toggleMealExpand = (index: number) => {
    setExpandedMeal(expandedMeal === index ? null : index);
  };

  const loadWorkoutPlan = (plan: any) => {
    localStorage.setItem('currentWorkoutPlan', JSON.stringify(plan.workoutDays));
    toast({ 
      title: "Plan Loaded", 
      description: "Workout plan has been loaded. Navigate to Workout Plan page to view it." 
    });
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
                <p className="text-muted-foreground text-lg">No saved meal plans yet</p>
                <p className="text-sm text-muted-foreground mt-2">Create your first meal plan to see it here</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {mealPlans.map((plan, index) => (
                  <Card key={index} className="glass-card overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">{new Date(plan.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}</span>
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
                            onClick={() => deleteMealPlan(index)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                          <span className="text-xs text-muted-foreground">Total Calories</span>
                          <div className="text-xl font-bold mt-1">{plan.totalCalories}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                          <span className="text-xs text-muted-foreground">Total Protein</span>
                          <div className="text-xl font-bold mt-1">{plan.totalProtein}g</div>
                        </div>
                      </div>

                      {expandedMeal === index && plan.mealDays && (
                        <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                          <h4 className="font-semibold text-sm mb-2">Meal Details:</h4>
                          {plan.mealDays.slice(0, 2).map((day: any, dayIdx: number) => (
                            <div key={dayIdx} className="text-sm space-y-1">
                              <div className="font-medium text-primary">{day.day}</div>
                              {day.meals?.slice(0, 2).map((meal: any, mealIdx: number) => (
                                <div key={mealIdx} className="text-muted-foreground pl-3">
                                  • {meal.name} - {meal.calories} cal
                                </div>
                              ))}
                            </div>
                          ))}
                          {plan.mealDays.length > 2 && (
                            <p className="text-xs text-muted-foreground italic">
                              +{plan.mealDays.length - 2} more days...
                            </p>
                          )}
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
                <p className="text-muted-foreground text-lg">No saved workout plans yet</p>
                <p className="text-sm text-muted-foreground mt-2">Create your first workout plan to see it here</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {workoutPlans.map((plan, index) => (
                  <Card key={index} className="glass-card overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">{new Date(plan.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}</span>
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
                            onClick={() => deleteMealPlan(index)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                          <span className="text-xs text-muted-foreground">Training Days</span>
                          <div className="text-xl font-bold mt-1">{plan.workoutDays?.length || 0}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                          <span className="text-xs text-muted-foreground">Total Exercises</span>
                          <div className="text-xl font-bold mt-1">
                            {plan.workoutDays?.reduce((acc: number, day: any) => 
                              acc + (day.exercises?.length || 0), 0) || 0}
                          </div>
                        </div>
                      </div>

                      {plan.formData && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {plan.formData.level || 'N/A'}
                          </span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {plan.formData.goal || 'N/A'}
                          </span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {plan.formData.split || 'N/A'}
                          </span>
                        </div>
                      )}

                      {expandedWorkout === index && plan.workoutDays && (
                        <div className="mt-4 pt-4 border-t border-border/50 space-y-4">
                          {plan.workoutDays.map((day: any, dayIdx: number) => (
                            <div key={dayIdx} className="space-y-2">
                              <h4 className="font-semibold text-sm text-primary">{day.day}</h4>
                              <div className="space-y-1.5 pl-3">
                                {day.exercises?.slice(0, 3).map((exercise: any, exIdx: number) => (
                                  <div key={exIdx} className="text-sm flex justify-between items-start gap-2">
                                    <span className="text-muted-foreground flex-1">
                                      • {exercise.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground/70 whitespace-nowrap">
                                      {exercise.sets}×{exercise.reps}
                                    </span>
                                  </div>
                                ))}
                                {day.exercises?.length > 3 && (
                                  <p className="text-xs text-muted-foreground italic pl-2">
                                    +{day.exercises.length - 3} more exercises...
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <Link href="/workout-plan">
                        <Button 
                          onClick={() => loadWorkoutPlan(plan)}
                          className="w-full mt-4 bg-gradient-primary hover:opacity-90"
                          size="sm"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Load & View Plan
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Overview;