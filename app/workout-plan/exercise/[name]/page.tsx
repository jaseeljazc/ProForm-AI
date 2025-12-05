// app/workout-plan/exercise/[name]/page.tsx
import { deslugify } from "@/lib/utils";
import { ArrowLeft, Dumbbell, Target, Wrench } from "lucide-react";

async function getExerciseDetails(name: string) {
  try {
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-6">
        <div className="text-center space-y-6 glass-card p-12 rounded-xl max-w-md shadow-lg">
          <Dumbbell className="h-16 w-16 mx-auto text-muted-foreground/50" />
          <h1 className="text-4xl font-bold">
            <span className="gradient-text">Exercise Not Found</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Could not find details for "{exerciseName}"
          </p>

          <a
            href="/workout-plan"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-300 shadow-md"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Workout Plan
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back Button */}
        <a
          href="/workout-plan"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200 mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">Back to Workout Plan</span>
        </a>

        {/* Header */}
        <div className="mb-8 space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span className="text-white">{exercise.name}</span>
          </h1>
          <div className="flex items-center gap-2">
            <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {exercise.category}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Images & Video */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            {exercise.images && exercise.images.length > 0 && (
              <div className="glass-card p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  Form Reference
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {exercise.images.map((img: any, i: number) => (
                    <div
                      key={i}
                      className="rounded-lg overflow-hidden border border-border/50 bg-secondary/20 hover:shadow-lg transition-shadow"
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

            {/* Video */}
            {exercise.videos?.[0] && (
              <div className="glass-card p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold mb-4">Video Demonstration</h2>
                <div className="rounded-lg overflow-hidden border border-border/50 bg-secondary/20">
                  <div className="aspect-video">
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

            {/* Instructions */}
            {exercise.description && (
              <div className="glass-card p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold mb-4">Instructions</h2>
                <div
                  className="prose prose-sm max-w-none text-muted-foreground [&>p]:mb-3 [&>p]:leading-relaxed [&>ul]:ml-4 [&>ul]:space-y-2 [&>ol]:ml-4 [&>ol]:space-y-2 [&>li]:text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: exercise.description }}
                />
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Equipment */}
            {exercise.equipment && exercise.equipment.length > 0 && (
              <div className="glass-card p-6 rounded-xl shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Wrench className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Equipment</h3>
                </div>
                <div className="space-y-2">
                  {exercise.equipment.map((eq: string, i: number) => (
                    <div
                      key={i}
                      className="px-3 py-2 bg-secondary/50 rounded-lg border border-border/50 text-sm"
                    >
                      {eq}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Primary Muscles */}
            {exercise.muscles && exercise.muscles.length > 0 && (
              <div className="glass-card p-6 rounded-xl shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Primary Muscles</h3>
                </div>
                <div className="space-y-2">
                  {exercise.muscles.map((muscle: string, i: number) => (
                    <div
                      key={i}
                      className="px-3 py-2 bg-primary/10 text-primary rounded-lg border border-primary/20 text-sm font-medium"
                    >
                      {muscle}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Secondary Muscles */}
            {exercise.musclesSecondary && exercise.musclesSecondary.length > 0 && (
              <div className="glass-card p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-bold mb-3 text-muted-foreground">
                  Secondary Muscles
                </h3>
                <div className="space-y-2">
                  {exercise.musclesSecondary.map((muscle: string, i: number) => (
                    <div
                      key={i}
                      className="px-3 py-2 bg-secondary/50 rounded-lg border border-border/50 text-sm"
                    >
                      {muscle}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}