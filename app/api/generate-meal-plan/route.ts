// app/api/generate-meal-plan/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

interface MealPlanCache {
  data: any;
  fetchedAt: string;
  params: string;
}

let cachedMealPlan: MealPlanCache | null = null;

export async function POST(req: Request) {
  const url = new URL(req.url);
  const debug = url.searchParams.get('debug') === 'true';
  
  try {
    const body = await req.json();
    const { age, weight, height, goal, diet } = body;
    
    console.log("[/api/generate-meal-plan] Request body:", { age, weight, height, goal, diet });
    
    // Validate required fields
    if (!age || !weight || !height || !goal || !diet) {
      console.error("[/api/generate-meal-plan] Missing required fields");
      throw new Error("Missing required parameters: age, weight, height, goal, diet are all required");
    }

    // Create cache key from parameters
    const cacheKey = JSON.stringify({ age, weight, height, goal, diet });

    // Return cached data if available (unless debug mode)
    if (cachedMealPlan && cachedMealPlan.params === cacheKey && !debug) {
      console.log("[/api/generate-meal-plan] Returning cached meal plan");
      return NextResponse.json({
        ...cachedMealPlan.data,
        source: "cache",
        fetchedAt: cachedMealPlan.fetchedAt,
      }, { 
        status: 200, 
        headers: corsHeaders 
      });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      console.error("[/api/generate-meal-plan] GEMINI_API_KEY is not configured");
      throw new Error("GEMINI_API_KEY is not configured in environment variables");
    }

    console.log(`[/api/generate-meal-plan] Generating ${diet} meal plan for ${goal} goal`);

    // Gemini Setup
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are a professional nutritionist AI. Generate a complete daily meal plan with exact macros.

User Profile:
- Age: ${age} years
- Weight: ${weight} kg
- Height: ${height} cm
- Goal: ${goal}
- Diet Type: ${diet}

STRICT RULES:
1. Create a detailed ${diet} meal plan with simple, realistic recipes.

2. Include exact macros (calories, protein, carbs, fat) for each meal.

3. Ensure meals are:
   - Practical and easy to prepare
   - Nutritionally balanced
   - Aligned with the ${goal} goal
   - Following ${diet} diet restrictions

4. Adjust portions based on user's metrics and goal:
   - Weight loss: Caloric deficit
   - Muscle gain: Caloric surplus with high protein
   - Maintenance: Balanced macros
   - Endurance: Higher carbs

5. Return PURE JSON ONLY (no markdown, no comments, no explanation).

Format:
{
  "breakfast": {
    "meal": "detailed meal description with ingredients and portions",
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number
  },
  "lunch": {
    "meal": "detailed meal description with ingredients and portions",
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number
  },
  "dinner": {
    "meal": "detailed meal description with ingredients and portions",
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number
  },
  "snacks": {
    "meal": "detailed snack description with ingredients and portions",
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number
  },
  "totalCalories": number,
  "totalProtein": number,
  "totalCarbs": number,
  "totalFat": number
}
`;

    console.log("[/api/generate-meal-plan] Sending request to Gemini...");

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    console.log("[/api/generate-meal-plan] Received response from Gemini");
    console.log("[/api/generate-meal-plan] Raw response preview:", rawText.substring(0, 100));

    // Extract JSON from response (handle markdown code blocks)
    const match = rawText.match(/\{[\s\S]*\}/);
    if (!match) {
      console.error("[/api/generate-meal-plan] No JSON found in response:", rawText.substring(0, 200));
      throw new Error("Invalid response from AI model - no JSON found");
    }

    const mealPlan = JSON.parse(match[0]);

    // Validate the meal plan structure
    const requiredFields = ['breakfast', 'lunch', 'dinner', 'snacks', 'totalCalories', 'totalProtein', 'totalCarbs', 'totalFat'];
    const missingFields = requiredFields.filter(field => !(field in mealPlan));
    
    if (missingFields.length > 0) {
      console.error("[/api/generate-meal-plan] Missing required fields:", missingFields);
      throw new Error(`Invalid meal plan structure. Missing fields: ${missingFields.join(', ')}`);
    }

    // Validate each meal has required properties
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];
    for (const mealType of mealTypes) {
      const meal = mealPlan[mealType];
      if (!meal.meal || typeof meal.calories !== 'number' || 
          typeof meal.protein !== 'number' || typeof meal.carbs !== 'number' || 
          typeof meal.fat !== 'number') {
        console.error(`[/api/generate-meal-plan] Invalid ${mealType} structure:`, meal);
        throw new Error(`Invalid ${mealType} structure in meal plan`);
      }
    }

    // Cache the result (unless debug mode)
    if (!debug) {
      cachedMealPlan = {
        data: mealPlan,
        fetchedAt: new Date().toISOString(),
        params: cacheKey,
      };
      console.log("[/api/generate-meal-plan] Meal plan cached successfully");
    }

    console.log("[/api/generate-meal-plan] ✅ Successfully generated meal plan");

    return NextResponse.json({
      ...mealPlan,
      source: debug ? "gemini-debug" : "gemini",
      fetchedAt: new Date().toISOString(),
    }, { 
      status: 200, 
      headers: corsHeaders 
    });

  } catch (err: any) {
    console.error("❌ Meal plan generation error:", err.message);
    console.error("❌ Full error:", err);
    
    return NextResponse.json(
      { 
        error: err.message || "Failed to generate meal plan",
        success: false 
      },
      { status: 500, headers: corsHeaders }
    );
  }
}