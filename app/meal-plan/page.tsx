'use client'


import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, Save, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MealPlanData {
  breakfast: { meal: string; calories: number; protein: number; carbs: number; fat: number };
  lunch: { meal: string; calories: number; protein: number; carbs: number; fat: number };
  dinner: { meal: string; calories: number; protein: number; carbs: number; fat: number };
  snacks: { meal: string; calories: number; protein: number; carbs: number; fat: number };
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

const MealPlan = () => {
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    goal: "",
    diet: ""
  });
  const [loading, setLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState<MealPlanData | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
        body: formData
      });

      if (error) throw error;

      setMealPlan(data);
      toast({
        title: "Meal Plan Generated!",
        description: "Your personalized meal plan is ready."
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to generate meal plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const savePlan = () => {
    if (mealPlan) {
      const savedPlans = JSON.parse(localStorage.getItem('mealPlans') || '[]');
      savedPlans.push({ ...mealPlan, date: new Date().toISOString() });
      localStorage.setItem('mealPlans', JSON.stringify(savedPlans));
      toast({
        title: "Saved!",
        description: "Meal plan saved to your weekly overview."
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">
              AI Meal Plan
              <span className="gradient-text"> Generator</span>
            </h1>
            <p className="text-muted-foreground">
              Get a personalized meal plan tailored to your goals
            </p>
          </div>

          <Card className="glass-card p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="175"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="goal">Fitness Goal</Label>
                  <Select value={formData.goal} onValueChange={(value:string) => setFormData({ ...formData, goal: value })}>
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
                  <Label htmlFor="diet">Dietary Preference</Label>
                  <Select value={formData.diet} onValueChange={(value:string) => setFormData({ ...formData, diet: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select diet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
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
                    Generate Meal Plan
                  </>
                )}
              </Button>
            </form>
          </Card>

          {mealPlan && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-end gap-4">
                <Button onClick={() => handleSubmit(new Event('submit') as any)} variant="outline" disabled={loading}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate
                </Button>
                <Button onClick={savePlan} className="bg-gradient-primary hover:opacity-90">
                  <Save className="mr-2 h-4 w-4" />
                  Save Plan
                </Button>
              </div>

              <Card className="glass-card p-6">
                <h3 className="text-xl font-bold mb-4">Daily Totals</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="text-2xl font-bold gradient-text">{mealPlan.totalCalories}</div>
                    <div className="text-sm text-muted-foreground">Calories</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="text-2xl font-bold gradient-text">{mealPlan.totalProtein}g</div>
                    <div className="text-sm text-muted-foreground">Protein</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="text-2xl font-bold gradient-text">{mealPlan.totalCarbs}g</div>
                    <div className="text-sm text-muted-foreground">Carbs</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="text-2xl font-bold gradient-text">{mealPlan.totalFat}g</div>
                    <div className="text-sm text-muted-foreground">Fat</div>
                  </div>
                </div>
              </Card>

              {Object.entries(mealPlan).filter(([key]) => !key.startsWith('total')).map(([mealType, meal]: [string, any]) => (
                <Card key={mealType} className="glass-card p-6">
                  <h3 className="text-lg font-bold mb-3 capitalize">{mealType}</h3>
                  <p className="text-muted-foreground mb-4">{meal.meal}</p>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Calories:</span>
                      <div className="font-semibold">{meal.calories}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Protein:</span>
                      <div className="font-semibold">{meal.protein}g</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Carbs:</span>
                      <div className="font-semibold">{meal.carbs}g</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Fat:</span>
                      <div className="font-semibold">{meal.fat}g</div>
                    </div>
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

export default MealPlan;
