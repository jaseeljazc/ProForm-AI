"use client";

import { useState } from "react";
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
import { Loader2, Sparkles, Save, RefreshCw, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MealPlanData {
  breakfast: {
    meal: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  lunch: {
    meal: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  dinner: {
    meal: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  snacks: {
    meal: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

const MealPlan = () => {
  const [formData, setFormData] = useState({
    age: "20",
    weight: "70",
    height: "170",
    goal: "build-muscle",
    diet: "non-vegetarian",
  });
  const [loading, setLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState<MealPlanData | null>(null);
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const { toast } = useToast();

const handleSubmit = async (e?: any, debug = false) => {
  if (e) e.preventDefault();
  setLoading(true);

  try {
    const url = debug ? "/api/generate-meal-plan?debug=true" : "/api/generate-meal-plan";
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    // Handle rate limit errors
    if (response.status === 429) {
      const retryAfter = data.retryAfter || 60;
      toast({
        title: "Rate Limit Reached",
        description: `Please wait ${retryAfter} seconds and try again.`,
        variant: "destructive",
      });
      return;
    }

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    // Remove metadata fields before setting meal plan
    const { source, fetchedAt, ...mealPlanData } = data;
    
    setMealPlan(mealPlanData);
    
    toast({
      title: "Meal Plan Generated!",
      description: `Your personalized meal plan is ready${source === "cache" ? " (from cache)" : ""}.`,
    });
  } catch (error) {
    console.error("Error generating meal plan:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to generate meal plan. Please try again.",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};
  const savePlan = () => {
    if (mealPlan) {
      const mealDays = Object.entries(mealPlan)
        .filter(([key]) => !key.startsWith("total"))
        .map(([mealType, meal]: [string, any]) => ({
          name: mealType.charAt(0).toUpperCase() + mealType.slice(1),
          meal: meal.meal,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
        }));

      const savedPlans = JSON.parse(localStorage.getItem("mealPlans") || "[]");
      savedPlans.push({
        ...mealPlan,
        mealDays,
        date: new Date().toISOString(),
        formData,
      });
      localStorage.setItem("mealPlans", JSON.stringify(savedPlans));
      setShowSaveAlert(true);
    }
  };

  const closeSaveAlert = () => {
    setShowSaveAlert(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-10 text-center space-y-3">
          <h1 className="text-5xl font-bold tracking-tight">
            AI Meal Plan
            <span className="gradient-text"> Generator</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Get a personalized meal plan tailored to your goals
          </p>
        </div>
        <div className="flex justify-center">
          <Card className="glass-card p-8 mb-8 shadow-md ">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="age"
                    className="text-sm font-medium mb-2 block"
                  >
                    Age
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="weight"
                    className="text-sm font-medium mb-2 block"
                  >
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="height"
                    className="text-sm font-medium mb-2 block"
                  >
                    Height (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="175"
                    value={formData.height}
                    onChange={(e) =>
                      setFormData({ ...formData, height: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="goal"
                    className="text-sm font-medium mb-2 block"
                  >
                    Fitness Goal
                  </Label>
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
                      <SelectItem value="lose-fat">Lose Fat</SelectItem>
                      <SelectItem value="build-muscle">Build Muscle</SelectItem>
                      <SelectItem value="maintain">Maintain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label
                    htmlFor="diet"
                    className="text-sm font-medium mb-2 block"
                  >
                    Dietary Preference
                  </Label>
                  <Select
                    value={formData.diet}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, diet: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select diet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="non-vegetarian">
                        Non-Vegetarian
                      </SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full bg-gradient-primary hover:opacity-90 shadow-md"
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
                    Generate Meal Plan
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {mealPlan && (
          <div className="space-y-6">
            <div className="flex justify-end gap-4">
              <Button
                onClick={handleSubmit}
                variant="outline"
                disabled={loading}
                className="shadow-sm"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
              <Button
                onClick={savePlan}
                className="bg-gradient-primary hover:opacity-90 shadow-md"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Plan
              </Button>
            </div>

            <Card className="glass-card p-6 shadow-md">
              <h3 className="text-2xl font-bold mb-6">Daily Totals</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="text-2xl font-bold gradient-text">
                    {mealPlan.totalCalories}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Calories
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="text-2xl font-bold gradient-text">
                    {mealPlan.totalProtein}g
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Protein
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="text-2xl font-bold gradient-text">
                    {mealPlan.totalCarbs}g
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Carbs
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="text-2xl font-bold gradient-text">
                    {mealPlan.totalFat}g
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Fat</div>
                </div>
              </div>
            </Card>

            {Object.entries(mealPlan)
              .filter(([key]) => !key.startsWith("total"))
              .map(([mealType, meal]: [string, any]) => (
                <Card
                  key={mealType}
                  className="glass-card p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-bold mb-3 capitalize">
                    {mealType}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {meal.meal}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                      <span className="text-xs text-muted-foreground">
                        Calories
                      </span>
                      <div className="font-bold text-lg mt-1">
                        {meal.calories}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                      <span className="text-xs text-muted-foreground">
                        Protein
                      </span>
                      <div className="font-bold text-lg mt-1">
                        {meal.protein}g
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                      <span className="text-xs text-muted-foreground">
                        Carbs
                      </span>
                      <div className="font-bold text-lg mt-1">
                        {meal.carbs}g
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                      <span className="text-xs text-muted-foreground">Fat</span>
                      <div className="font-bold text-lg mt-1">{meal.fat}g</div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        )}
      </main>

      {/* Save Success Alert Popup */}
      {showSaveAlert && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeSaveAlert}
        >
          <div
            className="bg-background rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-green-500/10">
                  <Check className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Plan Saved!</h2>
                  <p className="text-muted-foreground text-sm">
                    Your meal plan has been saved successfully.
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                You can view and manage your saved meal plans in the Weekly
                Overview section.
              </p>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={closeSaveAlert}
                  className="flex-1 bg-gradient-primary hover:opacity-90"
                >
                  Got it
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlan;
