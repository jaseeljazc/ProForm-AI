import axios from "axios";

const api = axios.create({
  baseURL: "https://exercisedb.p.rapidapi.com",
  headers: {
    "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
    "x-rapidapi-host": process.env.RAPIDAPI_HOST!,
  },
});

// GET API status
export async function getStatus() {
  try {
    const res = await api.get("/status");
    return res.data;
  } catch (err) {
    console.error("ExerciseDB API Error:", err);
    return null;
  }
}

// GET exercise by NAME
export async function getExerciseByName(name: string) {
  try {
    
    console.log("workout name:",name)
    const res = await api.get(`/exercises/name/${name}`);
    return res.data;
   
  } catch (err) {
    console.error("ExerciseDB API Error:", err);
    return null;
  }
}

// GET exercise by ID
export async function getExerciseById(id: string) {
  try {
    const res = await api.get(`/exercises/exercise/${id}`);
    return res.data;
  } catch (err) {
    console.error("ExerciseDB API Error:", err);
    return null;
  }
}
