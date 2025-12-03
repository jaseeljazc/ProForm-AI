import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const exerciseDbRes = await fetch("https://exercisedb/api/exercises"); 
const exerciseDb = await exerciseDbRes.json();

const exerciseNames = exerciseDb.map((e: any) => e.name.toLowerCase());
const compressedList = exerciseNames.join(" | ");

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { gender, level, goal, days, split } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are a professional fitness trainer AI. Generate a complete workout plan.
Return ONLY valid JSON in this exact format (no markdown, no backticks):
{
  "workoutDays": [
    {
      "day": "Day 1: Chest & Triceps",
      "exercises": [
        {"name": "Bench Press", "sets": 4, "reps": "8-10", "notes": "Focus on form"},
        {"name": "Dumbbell Flyes", "sets": 3, "reps": "10-12"}
      ]
    }
  ]
}`;

    const userPrompt = `Create a ${days}-day ${split} workout plan for:
- Gender: ${gender}
- Level: ${level}
- Goal: ${goal}
Include exercises with sets, reps, and brief notes.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content;
    
    // Clean up markdown code blocks if present
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const workoutPlan = JSON.parse(content);

    return new Response(JSON.stringify(workoutPlan), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-workout-plan:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});


import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ✅ Correct ExerciseDB fetch using RapidAPI
const exerciseDBRes = await fetch("https://exercisedb.p.rapidapi.com/exercises", {
  method: "GET",
  headers: {
    "x-rapidapi-key": "d5f9c1ffb3msh0bd048781ec1452p17c2ddjsna5fcc8cafffe",
    "x-rapidapi-host": "exercisedb.p.rapidapi.com",
  },
});

const exerciseDb = await exerciseDBRes.json();
const exerciseNames = exerciseDb.map((e: any) => e.name.toLowerCase());
const compressedList = exerciseNames.join(" | ");

// ✅ Log the final exercise list in console
console.log("Compressed Exercise List:", compressedList);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { gender, level, goal, days, split } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a professional fitness trainer AI.
Generate a complete workout plan.

IMPORTANT RULES:
1. You MUST ONLY pick exercise names from the allowed exercise list provided.
2. DO NOT invent or guess new exercise names.
3. If you cannot find a matching exercise, choose the closest correct one from the list.
4. Return ONLY valid JSON in this exact structure (no markdown, no backticks):

{
  "workoutDays": [
    {
      "day": "Day 1: Chest & Triceps",
      "exercises": [
        {"name": "bench press", "sets": 4, "reps": "8-10", "notes": "Focus on form"},
        {"name": "dumbbell flyes", "sets": 3, "reps": "10-12"}
      ]
    }
  ]
}`;

    const userPrompt = `Create a ${days}-day ${split} workout plan for:
- Gender: ${gender}
- Level: ${level}
- Goal: ${goal}

Allowed exercises (use ONLY from this list):
${compressedList}

Choose the most suitable exercises from this exact list. DO NOT output any exercise outside this list.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    let content = (await response.json()).choices[0].message.content;

    content = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const workoutPlan = JSON.parse(content);

    return new Response(JSON.stringify(workoutPlan), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in generate-workout-plan:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});


