// app/api/exercises/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

let cachedExerciseNames: string[] | null = null;
let cacheFetchedAt: string | null = null;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const debug = searchParams.get('debug') === 'true';
  
  try {
    // Return cached data if available (unless debug mode)
    if (cachedExerciseNames && !debug) {
      return NextResponse.json({
        success: true,
        source: "cache",
        fetchedAt: cacheFetchedAt,
        count: cachedExerciseNames.length,
        exercises: cachedExerciseNames,
      });
    }

    const allNamesSet = new Set<string>();
    let url: string | null = "https://wger.de/api/v2/exerciseinfo/?limit=200";
    let pageCount = 0;
    const maxPages = 50;

    while (url && pageCount < maxPages) {
      pageCount++;
      console.log(`[/api/exercises] Fetching page ${pageCount}: ${url}`);

      const res:any= await axios.get(url, { 
        timeout: 15000,
        headers: {
          'Accept': 'application/json',
        }
      });
      
      const data = res.data;

      if (!data || !Array.isArray(data.results)) {
        console.error("[/api/exercises] Unexpected response shape:", data);
        throw new Error("Unexpected wger response shape");
      }

      console.log(`[/api/exercises] Page ${pageCount}: Processing ${data.results.length} exercises`);

      // Process each exercise
      data.results.forEach((item: any) => {
        // The name is inside the translations array
        if (item.translations && Array.isArray(item.translations)) {
          item.translations.forEach((translation: any) => {
            // language: 2 is English
            if (translation.language === 2 && translation.name) {
              const name = translation.name.trim();
              if (name) {
                // Convert to title case for better readability
                const titleCase = name
                  .split(' ')
                  .map((word:any) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                  .join(' ');
                allNamesSet.add(titleCase);
              }
            }
          });
        }
      });

      console.log(`[/api/exercises] Page ${pageCount}: Total unique exercises: ${allNamesSet.size}`);

      // Handle pagination
      if (data.next) {
        url = data.next.startsWith('http') ? data.next : `https://wger.de${data.next}`;
      } else {
        url = null;
      }
    }

    if (pageCount >= maxPages) {
      console.warn(`[/api/exercises] Reached max pages limit (${maxPages})`);
    }

    // Convert to sorted array
    const allNames = Array.from(allNamesSet).sort((a, b) => 
      a.localeCompare(b, 'en', { sensitivity: 'base' })
    );
    
    if (!debug) {
      cachedExerciseNames = allNames;
      cacheFetchedAt = new Date().toISOString();
    }

    console.log(`[/api/exercises] Successfully fetched ${allNames.length} unique exercises from ${pageCount} pages`);

    return NextResponse.json({
      success: true,
      source: debug ? "wger-debug" : "wger",
      fetchedAt: new Date().toISOString(),
      count: allNames.length,
      exercises: allNames,
      pagesProcessed: pageCount,
    });
  } catch (err: any) {
    console.error("[/api/exercises] error:", err?.message ?? err);
    if (err?.response) {
      console.error("[/api/exercises] API response error:", {
        status: err.response.status,
        statusText: err.response.statusText,
        data: err.response.data,
      });
    }
    return NextResponse.json(
      { 
        success: false, 
        error: String(err?.message ?? err),
        details: err?.response?.data || null,
      },
      { status: 500 }
    );
  }
}