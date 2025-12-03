import { getExerciseByName } from "@/lib/excerciseDB";
import { deslugify } from "@/lib/utils";

export default async function ExercisePage({ params }: any) {
  const { name } = await params; // ✅ FIX
  const exerciseName = deslugify(name); 
  // console.log(exerciseName) 
  const data = await getExerciseByName(exerciseName);

  if (!data || data.length === 0) {
    return (
      <div className="p-6 text-red-500 text-xl font-semibold h-screen">
        Exercise not found.
      </div>
    );
  }

  const exercise = data[0];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold">{exercise.name}</h1>

      {/* GIF */}
      {/* <img
        src={exercise.gifUrl}
        alt={exercise.name}
        className="rounded-xl w-full max-w-lg shadow-lg"
      /> */}

      <div className="space-y-2 text-lg">
        <p><strong>Body Part:</strong> {exercise.bodyPart}</p>
        <p><strong>Equipment:</strong> {exercise.equipment}</p>
        <p><strong>Target Muscle:</strong> {exercise.target}</p>
        <p><strong>Secondary Muscles:</strong> {exercise.secondaryMuscles?.join(", ")}</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">Instructions</h2>
        <ul className="list-disc ml-6 space-y-1">
          {exercise.instructions?.map((step: string, i: number) => (
            <li key={i}>{step}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
