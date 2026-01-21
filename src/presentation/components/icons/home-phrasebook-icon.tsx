import type { JSX } from "react";

/**
 * Renders the phrasebook feature icon used on the home page.
 */
export function HomePhrasebookIcon(): JSX.Element {
  return (
    <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24">
      <path
        d="M7 8h10M7 12h6M21 12a8 8 0 1 1-4-6.32V3l-3 3"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
