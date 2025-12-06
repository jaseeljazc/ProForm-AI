

// app/workout-plan/exercise/[name]/page.tsx
import { BackButton } from "@/components/BackButton";
import { deslugify } from "@/lib/utils";

async function getExerciseDetails(name: string) {
  try {
    // Don't encode again - name is already encoded by Next.js router
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/exercises/${name}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.success ? data.exercise : null;
  } catch (error) {
    console.error("Error fetching exercise:", error);
    return null;
  }
}

export default async function ExercisePage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const exerciseName = deslugify(name);

  const exercise = await getExerciseDetails(name);

  if (!exercise) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-background">
        <div className="text-center space-y-6 glass-card p-10 rounded-2xl max-w-md border border-border">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-destructive to-destructive/60 flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold gradient-text font-display">
            Exercise Not Found
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Could not find details for "{exerciseName}"
          </p>

          <BackButton/>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background ">
      <div className="max-w-7xl mx-auto p-6 py-8 ">
        {/* Header Section */}
        <div className="mb-5">
         <BackButton/>
          <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text leading-tight tracking-tight">
            {exercise.name}
          </h1>
          <div className="h-1 w-24 bg-gradient-primary rounded-full mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Media */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images Gallery */}
            {exercise.images && exercise.images.length > 0 && (
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  Demonstration
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {exercise.images.map((img: any, i: number) => (
                    <div
                      key={i}
                      className="rounded-xl overflow-hidden border border-border hover:border-accent transition-colors duration-300"
                    >
                      <img
                        src={img.image}
                        alt={`${exercise.name} - position ${i + 1}`}
                        className="w-full h-auto"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Section */}
            {exercise.videos?.[0] && (
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    Video Demonstration
                  </h2>
                </div>
                <div className="rounded-xl overflow-hidden border border-border">
                  <div className="aspect-video bg-background">
                    <video
                      controls
                      muted
                      preload="auto"
                      className="w-full h-full"
                    >
                      <source src={exercise.videos[0].video} type="video/mp4" />
                    </video>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions Section */}
            {exercise.description && (
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    Instructions
                  </h2>
                </div>
                <div
                  className="prose prose-invert prose-lg max-w-none text-foreground 
                    [&>p]:text-muted-foreground [&>p]:leading-relaxed [&>p]:mb-4
                    [&>ul]:text-muted-foreground [&>ul]:space-y-2 [&>ul]:ml-6
                    [&>ol]:text-muted-foreground [&>ol]:space-y-2 [&>ol]:ml-6
                    [&>li]:text-muted-foreground [&>li]:leading-relaxed
                    [&>li]:pl-2 [&>li::marker]:text-accent
                    [&>strong]:text-accent [&>strong]:font-semibold
                    [&>h3]:text-foreground [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mt-6 [&>h3]:mb-3"
                  dangerouslySetInnerHTML={{ __html: exercise.description }}
                />
              </div>
            )}
          </div>

          {/* Right Column - Details Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-6 border border-border sticky top-18">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-display font-bold text-foreground">
                  Details
                </h2>
              </div>

              <div className="space-y-6">
                {/* Category */}
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-2">Category</p>
                  <span className="inline-block px-4 py-2 bg-gradient-primary text-white rounded-lg font-semibold text-sm uppercase tracking-wide">
                    {exercise.category}
                  </span>
                </div>

                {/* Equipment */}
                {exercise.equipment && exercise.equipment.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      <strong className="text-accent font-semibold">Equipment</strong>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {exercise.equipment.map((eq: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-muted text-muted-foreground rounded-lg text-sm font-medium border border-border"
                        >
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Primary Muscles */}
                {exercise.muscles && exercise.muscles.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <strong className="text-primary font-semibold">Primary Muscles</strong>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {exercise.muscles.map((muscle: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-primary/20 text-primary rounded-lg text-sm font-semibold border border-primary/30"
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Secondary Muscles */}
                {exercise.musclesSecondary && exercise.musclesSecondary.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                      <strong className="text-accent font-semibold">Secondary Muscles</strong>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {exercise.musclesSecondary.map((muscle: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium border border-border"
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}