// app/workout-plan/exercise/[name]/page.tsx
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
        <div className="text-center space-y-6 glass-card p-8 rounded-xl max-w-md">
          <h1 className="text-4xl font-bold gradient-text font-display">
            Exercise Not Found
          </h1>
          <p className="text-muted-foreground text-lg">
            Could not find details for "{exerciseName}"
          </p>

          <a
            href="/workout-plan"
            className="inline-block px-8 py-3 bg-gradient-primary text-primary-foreground font-semibold rounded-lg hover-lift transition-all duration-300"
          >
            Back to Workout Plan
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient effect */}
      <div className="fixed inset-0 bg-gradient-hero pointer-events-none" />
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial pointer-events-none" />

      <div className="relative z-10 p-6 max-w-5xl mx-auto space-y-10 py-12">
        {/* Header */}
        <div className="space-y-6">
          <a
            href="/workout-plan"
            className="inline-flex items-center gap-2 text-accent hover:text-primary transition-colors duration-300 font-medium group"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            Back to Workout Plan
          </a>
          <h1 className="text-5xl md:text-6xl font-display gradient-text leading-tight">
            {exercise.name}
          </h1>
        </div>

        {/* Images */}
        {exercise.images && exercise.images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exercise.images.map((img: any, i: number) => (
              <div
                key={i}
                className="glass-card rounded-xl overflow-hidden hover-lift border border-border"
              >
                <img
                  src={img.image}
                  alt={`${exercise.name} - position ${i + 1}`}
                  className="w-full h-auto"
                />
              </div>
            ))}
          </div>
        )}

        {/* Videos */}
        {exercise.videos?.[0] && (
          <div className="space-y-4">
            <h2 className="text-3xl font-display gradient-text">
              Video Demonstration
            </h2>

            <div className="glass-card rounded-xl overflow-hidden border border-border hover-lift">
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

        {/* Details */}
        <div className="glass-card p-8 rounded-xl space-y-4 border border-border">
          <h2 className="text-2xl font-display gradient-text mb-6">
            Exercise Details
          </h2>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium border border-border">
                {exercise.category}
              </span>
            </div>

            {exercise.equipment && exercise.equipment.length > 0 && (
              <div className="space-y-2">
                <strong className="text-accent font-semibold text-lg">Equipment:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {exercise.equipment.map((eq: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-muted text-muted-foreground rounded-md text-sm border border-border"
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {exercise.muscles && exercise.muscles.length > 0 && (
              <div className="space-y-2">
                <strong className="text-accent font-semibold text-lg">Primary Muscles:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {exercise.muscles.map((muscle: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-primary/20 text-primary-foreground rounded-md text-sm border border-primary/30"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {exercise.musclesSecondary && exercise.musclesSecondary.length > 0 && (
              <div className="space-y-2">
                <strong className="text-accent font-semibold text-lg">Secondary Muscles:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {exercise.musclesSecondary.map((muscle: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm border border-border"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description/Instructions */}
        {exercise.description && (
          <div className="glass-card p-8 rounded-xl space-y-4 border border-border">
            <h2 className="text-3xl font-display gradient-text">
              Instructions
            </h2>
            <div
              className="prose prose-invert prose-lg max-w-none text-foreground [&>p]:text-muted-foreground [&>ul]:text-muted-foreground [&>ol]:text-muted-foreground [&>li]:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: exercise.description }}
            />
          </div>
        )}
      </div>
    </div>
  );
}