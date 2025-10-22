import Link from "next/link";
import words from "./data/cebuano_words.json";

interface WordRecord {
  rank: number;
  cebuano: string;
  english: string;
  explanation: string;
}

const dataset = words as WordRecord[];
const sampleWords = dataset.slice(0, 6);

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <nav className="text-sm text-[#0077b6]">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span>Courses</span>
            <span className="mx-2">/</span>
            <span className="text-gray-600">Cebuano Learning</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          {/* Left side - Course content */}
          <div className="space-y-8">
            {/* Course Image */}
            <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-[#0077b6] to-[#00b4d8] flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold">Cebuano Learning</h2>
                <p className="text-white/80">Interactive Flashcards</p>
              </div>
            </div>

            {/* Course Title */}
            <div>
              <h1 className="text-4xl font-bold text-[#03045e] mb-4">
                Master Cebuano Vocabulary with Adaptive Flashcards
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Our spaced repetition system personalizes your study sessions so
                you remember faster and retain longer. Track your streak,
                measure your growth, and build confidence speaking Cebuano.
              </p>

              {/* Instructor */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0077b6] rounded-full flex items-center justify-center text-white font-semibold">
                  BS
                </div>
                <div>
                  <p className="text-sm text-gray-600">A course by</p>
                  <p className="font-medium text-[#03045e]">
                    Bisaya Flashcards Team
                  </p>
                </div>
              </div>

              {/* Reviews */}
              <div className="flex items-center gap-2 mb-8">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">1,421 reviews</span>
              </div>
            </div>
          </div>

          {/* Right side - Course details */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              {/* Price */}
              <div className="mb-6">
                <div className="text-3xl font-bold text-[#03045e] mb-2">
                  Free
                </div>
                <p className="text-sm text-gray-600">Start learning today</p>
              </div>

              {/* Course details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#0077b6]/10 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-[#0077b6]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[#03045e]">LESSONS</p>
                    <p className="text-sm text-gray-600">
                      12 interactive sessions
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#0077b6]/10 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-[#0077b6]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[#03045e]">DIFFICULTY</p>
                    <p className="text-sm text-gray-600">
                      Beginner to Intermediate
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600">Students:</p>
                    <p className="font-medium text-[#03045e]">3,215</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Language:</p>
                    <p className="font-medium text-[#03045e]">English</p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <Link
                  href="/register"
                  className="w-full bg-[#0077b6] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#005a8b] transition-colors text-center block"
                >
                  Start Learning Free
                </Link>
                <Link
                  href="/login"
                  className="w-full border border-[#03045e] text-[#03045e] py-3 px-6 rounded-lg font-medium hover:bg-[#03045e] hover:text-white transition-colors text-center block"
                >
                  Sign in to continue
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Table of Contents */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-[#03045e]">
              COURSE TABLE OF CONTENTS
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-[#03045e]">Introduction</h3>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-[#03045e]">
                  Preparing the character
                </h3>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Learn the fundamentals of Cebuano vocabulary and pronunciation.
                This section covers basic greetings, numbers, and essential
                phrases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#03045e] mb-2">
            Preview the flashcards
          </h2>
          <p className="text-gray-600">
            A small sample from the {dataset.length.toLocaleString()} word
            collection.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cebuano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  English
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Explanation
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sampleWords.map((word) => (
                <tr key={word.rank} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#03045e]">
                    {word.rank}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {word.cebuano}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#03045e]">
                    {word.english}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="max-w-xs truncate" title={word.explanation}>
                      {word.explanation}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Call to Action */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="bg-gradient-to-r from-[#0077b6] to-[#00b4d8] rounded-xl p-8 text-white">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">
              Ready to build your Cebuano vocabulary?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Sign up for free and start reviewing flashcards tailored to your
              progress. Your learning history syncs across devices and stays
              private to your account.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="bg-white text-[#0077b6] px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center"
              >
                Get started for free
              </Link>
              <Link
                href="/login"
                className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-[#0077b6] transition-colors text-center"
              >
                Sign in to your account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
