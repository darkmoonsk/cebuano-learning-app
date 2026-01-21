/**
 * Renders the flashcards feature icon used on the home page.
 */
export function HomeFlashcardsIcon(): JSX.Element {
  return (
    <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24">
      <path
        d="M7 4h9a2 2 0 0 1 2 2v9"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="3"
        y="8"
        width="12"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth={2}
      />
    </svg>
  );
}
