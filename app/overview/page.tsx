'use client'


import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar, UtensilsCrossed, Dumbbell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Overview = () => {
  const [mealPlans, setMealPlans] = useState<any[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<any[]>([]);
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

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">
              Weekly
              <span className="gradient-text"> Overview</span>
            </h1>
            <p className="text-muted-foreground">
              View and manage your saved plans
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Meal Plans */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <UtensilsCrossed className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">Meal Plans</h2>
              </div>
              
              {mealPlans.length === 0 ? (
                <Card className="glass-card p-8 text-center">
                  <p className="text-muted-foreground">No saved meal plans yet</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {mealPlans.map((plan, index) => (
                    <Card key={index} className="glass-card p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(plan.date).toLocaleDateString()}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMealPlan(index)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Calories:</span>
                          <div className="font-semibold">{plan.totalCalories}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Protein:</span>
                          <div className="font-semibold">{plan.totalProtein}g</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Workout Plans */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Dumbbell className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">Workout Plans</h2>
              </div>
              
              {workoutPlans.length === 0 ? (
                <Card className="glass-card p-8 text-center">
                  <p className="text-muted-foreground">No saved workout plans yet</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {workoutPlans.map((plan, index) => (
                    <Card key={index} className="glass-card p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(plan.date).toLocaleDateString()}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteWorkoutPlan(index)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Days:</span>
                        <div className="font-semibold">{plan.workoutDays?.length || 0} day split</div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Overview;
