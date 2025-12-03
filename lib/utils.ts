import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// export function deslugify(text: string) {
//   return text.replace(/-/g, " ").trim();
// }
export function deslugify(text: string) {
  if (!text) return "";
  return text.split("-").join(" ").trim().toLowerCase();
}

