// app/api/exercises/[name]/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import { log } from "console";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> } // ✅ Mark as Promise
) {
  try {
    const { name } = await params; // ✅ Await params
    const exerciseName = decodeURIComponent(name).toLowerCase().trim();
    
    console.log(`[/api/exercises/${name}] Searching for: "${exerciseName}"`);

    // Search through all exercises to find matches
    let url: string | null = "https://wger.de/api/v2/exerciseinfo/?limit=200";
    let foundExercise: any = null;
    let pageCount = 0;
    const maxPages = 50;

    while (url && pageCount < maxPages && !foundExercise) {
      pageCount++;
      
      const res:any = await axios.get(url, {
        timeout: 15000,
        headers: { 'Accept': 'application/json' }
      });

      const data = res.data;

      if (!data || !Array.isArray(data.results)) {
        throw new Error("Unexpected wger response shape");
      }

      // Search for matching exercise
      for (const item of data.results) {
        if (item.translations && Array.isArray(item.translations)) {
          const englishTranslation = item.translations.find(
            (t: any) => t.language === 2 && t.name
          );

          if (englishTranslation) {
            const apiName = englishTranslation.name.toLowerCase().trim();
                        console.log("Video:",item.videos);

            if (apiName === exerciseName) {
              foundExercise = {
                id: item.id,
                name: englishTranslation.name,
                description: englishTranslation.description || "No description available",
                category: item.category?.name || "Unknown",
                muscles: item.muscles?.map((m: any) => m.name_en || m.name) || [],
                musclesSecondary: item.muscles_secondary?.map((m: any) => m.name_en || m.name) || [],
                equipment: item.equipment?.map((e: any) => e.name) || [],
                images: item.images || [],
                videos: item.videos || [],
              };
              break;
            }

            
            
          }
        }
      }

      url = foundExercise ? null : (data.next || null);
    }

    if (!foundExercise) {
      return NextResponse.json(
        { success: false, error: "Exercise not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      exercise: foundExercise,
    });

  } catch (err: any) {
    console.error("[/api/exercises/[name]] error:", err?.message);
    return NextResponse.json(
      { success: false, error: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}