import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind classes intelligently,
 * avoiding conflicts (e.g., px-4 and px-6).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
