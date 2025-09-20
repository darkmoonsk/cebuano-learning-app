import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toAudioSlug(word: string) {
  return word
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\/\\]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-._]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getAudioUrlFor(word: string) {
  return `/audio/words/${toAudioSlug(word)}.mp3`;
}
