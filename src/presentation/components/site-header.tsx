"use client";

import Link from "next/link";
import { Session } from "next-auth";
import { SignOutButton } from "@/presentation/components/sign-out-button";
import { useEffect, useState } from "react";
import Image from "next/image";

interface SiteHeaderProps {
  session: Session | null;
}

export function SiteHeader({ session }: SiteHeaderProps) {
  const isAuthenticated = Boolean(session?.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="sticky mt-4 top-0 z-50 w-full">
      <div className="mx-auto w-full max-w-6xl px-4 pt-0">
        <div className="flex items-center justify-between rounded-full border border-white/15 bg-white/10 px-6 py-3 text-white backdrop-blur">
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="Cebuano Learner">
              <Image src="/logo.png" alt="Logo" width={80} height={80} />
            </Link>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-white/80 lg:flex">
            <Link className="text-white" href="/">
              Home
            </Link>
            <Link className="hover:text-white" href="/dashboard">
              Dashboard
            </Link>
            {isAuthenticated && (
              <>
                <Link className="hover:text-white" href="/progress">
                  Progress
                </Link>
                <Link className="hover:text-white" href="/dashboard/settings">
                  Settings
                </Link>
              </>
            )}
          </nav>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="hidden text-sm text-white/80 sm:inline">
                  {session?.user?.name ?? session?.user?.email}
                </span>
                <SignOutButton />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden text-xs font-semibold uppercase tracking-wide text-white/80 sm:inline"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-[#f6c445] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#0b1c48] shadow-lg shadow-[#f6c445]/30 transition hover:bg-[#ffd36d]"
                >
                  Create free account
                </Link>
              </>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="cursor-pointer rounded-full p-2 text-white/80 transition hover:text-white lg:hidden"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
        {isMounted && isMobileMenuOpen && (
          <div className="mt-4 rounded-3xl border border-white/15 bg-[#0b1c48]/80 px-4 py-4 text-white backdrop-blur lg:hidden">
            <nav className="space-y-2 text-sm">
              <Link
                href="/"
                className="block rounded-lg px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className="block rounded-lg px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    href="/progress"
                    className="block rounded-lg px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Progress
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="block rounded-lg px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                </>
              )}
            </nav>
            {!isAuthenticated && (
              <div className="mt-4 border-t border-white/10 pt-4">
                <Link
                  href="/login"
                  className="block rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="mt-2 block rounded-full bg-[#f6c445] px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-[#0b1c48]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Create free account
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
