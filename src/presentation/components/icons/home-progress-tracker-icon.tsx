import type { JSX } from "react";

/**
 * Renders the progress tracker icon used on the home page.
 */
export function HomeProgressTrackerIcon(): JSX.Element {
  return (
    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 19h16M7 16V9M12 16V5M17 16v-7"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
