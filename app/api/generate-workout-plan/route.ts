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

    // 1. Fetch EXERCISE NAMES from our new route
    const exerciseRes = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/exercises`
    );

    const validNames: string[] = exerciseRes.data.exercises;

    if (!validNames.length) {
      throw new Error("Exercise list is empty");
    }

    // 2. Gemini Setup
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You generate a 3-day Push Pull Legs workout plan.

STRICT RULES:
1. ONLY choose exercise names from this list:
${JSON.stringify(validNames)}
2. Minimum **5 exercises per day**.
3. NO duplicates across days.
4. Correct muscle rules:
   - PUSH: chest, shoulders, triceps
   - PULL: back, biceps, rear delts
   - LEGS: quads, hams, glutes, calves
5. Match EXACT exercise names.
6. Return PURE JSON ONLY.

Format:
{
 "workoutDays": [
   {
     "day": "Day 1 - Push",
     "exercises": [
       { "name": "barbell bench press", "sets": 4, "reps": "8-12" }
     ]
   }
 ]
}

User details:
${JSON.stringify(body)}
`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    const match = rawText.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Invalid JSON from model");

    const json = JSON.parse(match[0]);

    // 3. Validate names
    json.workoutDays = json.workoutDays.map((day: any) => ({
      ...day,
      exercises: day.exercises.map((ex: any) => ({
        ...ex,
        name: validNames.includes(ex.name) ? ex.name : "INVALID_EXERCISE",
      })),
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
