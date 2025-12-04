import { NextResponse } from "next/server";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { gender, level, goal, days, split } = body;

    // Validate required fields
    if (!days || !split) {
      throw new Error("Days and split type are required");
    }

    // 1. Fetch EXERCISE NAMES from our new route
    const exerciseRes = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/exercises`
    );

    const validNames: string[] = exerciseRes.data.exercises;

    if (!validNames.length) {
      throw new Error("Exercise list is empty");
    }

    // 2. Define split configurations
    const splitConfig: Record<string, string[]> = {
      "push-pull-legs": ["Push", "Pull", "Legs"],
      "upper-lower": ["Upper", "Lower"],
      "full-body": ["Full Body"],
      "bro-split": ["Chest", "Back", "Shoulders", "Legs", "Arms"],
    };

    // Get the day types for the selected split
    const dayTypes = splitConfig[split.toLowerCase()] || ["Full Body"];
    
    // Create day labels based on the number of days requested
    const numDays = parseInt(days);
    let dayLabels: string[] = [];
    
    if (numDays <= dayTypes.length) {
      // If requesting fewer days than the split has, just take the first N days
      dayLabels = dayTypes.slice(0, numDays);
    } else {
      // If requesting more days, cycle through the split
      for (let i = 0; i < numDays; i++) {
        dayLabels.push(dayTypes[i % dayTypes.length]);
      }
    }

    // 3. Gemini Setup
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You generate a ${numDays}-day ${split} workout plan.

DAYS TO GENERATE:
${dayLabels.map((day, i) => `Day ${i + 1} - ${day}`).join("\n")}

STRICT RULES:
1. ONLY choose exercise names from this list (use EXACT names):
${JSON.stringify(validNames)}

2. Minimum **5 exercises per day**.

3. NO duplicates across days.

4. Muscle group rules:
   - PUSH: chest, shoulders, triceps
   - PULL: back, biceps, rear delts, traps
   - LEGS: quads, hamstrings, glutes, calves
   - UPPER: chest, back, shoulders, biceps, triceps
   - LOWER: quads, hamstrings, glutes, calves
   - FULL BODY: balanced mix of chest, shoulders, triceps, back, biceps, rear delts, traps, quads, hamstrings, glutes, calves
   - CHEST: chest exercises (flat, incline, decline, flyes)
   - BACK: lat pulldowns, rows, deadlifts, pullups
   - SHOULDERS: overhead press, lateral raises, rear delts etc
   - ARMS: biceps curls, triceps extensions etc

5. Match EXACT exercise names from the provided list (case-sensitive).

6. Adjust difficulty based on level: "${level}"
   - beginner: Focus on compound movements, 3-4 sets
   - intermediate: Mix of compound and isolation, 4-6 sets
   - advanced: Include advanced techniques, 5-7 sets

7. Tailor for goal: "${goal}"
   - strength: Lower reps (3-6), longer rest
   - muscle-gain: Moderate reps (8-12)
   - endurance: Higher reps (12-15+)
   - fat-loss: Circuit-style, supersets

8. Return PURE JSON ONLY (no markdown, no code blocks, no explanations).

Format:
{
  "workoutDays": [
    {
      "day": "Day 1 - Push",
      "exercises": [
        { "name": "barbell bench press", "sets": 4, "reps": "8-12" },
        { "name": "overhead press", "sets": 3, "reps": "10-12" }
      ]
    }
  ]
}

User Profile:
- Gender: ${gender}
- Level: ${level}
- Goal: ${goal}
- Days per week: ${days}
- Split type: ${split}
`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    // Extract JSON from response
    const match = rawText.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Invalid JSON from model");

    const json = JSON.parse(match[0]);

    // 4. Validate exercise names and mark invalid ones
    json.workoutDays = json.workoutDays.map((day: any) => ({
      ...day,
      exercises: day.exercises.map((ex: any) => ({
        ...ex,
        name: validNames.includes(ex.name) ? ex.name : "INVALID_EXERCISE",
      })),
    }));

    // Optional: Filter out invalid exercises
    json.workoutDays = json.workoutDays.map((day: any) => ({
      ...day,
      exercises: day.exercises.filter((ex: any) => ex.name !== "INVALID_EXERCISE"),
    }));

    return NextResponse.json(json, { status: 200, headers: corsHeaders });
  } catch (err: any) {
    console.error("❌ Workout plan error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500, headers: corsHeaders }
    );
  }
}