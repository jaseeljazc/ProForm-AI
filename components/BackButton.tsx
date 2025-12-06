"use client";
import { useRouter } from "next/navigation";

export function BackButton({ label = "Back" }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex mb-5 items-center gap-2 text-accent hover:text-primary transition-all duration-300 font-medium group"
    >
      <span className="transition-transform duration-300 group-hover:-translate-x-2 text-xl">←</span>
      {label}
    </button>
  );
}
