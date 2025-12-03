// app/api/generate-workout-plan/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid input. Expected JSON body." },
        { status: 400, headers: corsHeaders }
      );
    }

    // Initialize Gemini (Free-tier compatible model)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash", // FREE VERSION
    });

    const prompt = `
Generate a workout plan in VALID JSON ONLY.
NO extra text. NO markdown. NO explanation.

User details:
${JSON.stringify(body)}

Response format:
{
  "workoutDays": [
    {
      "day": "Day 1 - Chest & Triceps",
      "exercises": [
        { "name": "Bench Press", "sets": 4, "reps": "8-10" },
        { "name": "Push Ups", "sets": 3, "reps": "12-15" }
      ]
    }
  ]
}

Rules:
- Always return workoutDays[] with at least 1 day.
- Exercises must contain: name, sets, reps.
- VALID JSON ONLY.
`;

    const result = await model.generateContent(prompt);
   // Gemini raw text response
const text = result.response.text();

// SAFELY extract JSON even if Gemini adds extra text
function extractJson(str: string) {
  const jsonMatch = str.match(/\{[\s\S]*\}/); // finds first JSON object
  if (!jsonMatch) return null;

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    return null;
  }
}

const parsed = extractJson(text);

if (!parsed) {
  console.error("❌ Gemini returned non-JSON response:", text);
  return NextResponse.json(
    { error: "Gemini returned invalid JSON format." },
    { status: 500, headers: corsHeaders }
  );
}

    return NextResponse.json(parsed, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err: any) {
    console.error("❌ Server error:", err.message);

    return NextResponse.json(
      { error: err.message || "Something went wrong." },
      { status: 500, headers: corsHeaders }
    );
  }
}
