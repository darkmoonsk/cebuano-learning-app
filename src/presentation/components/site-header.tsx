"use client";

import Link from "next/link";
import { Session } from "next-auth";
import { SignOutButton } from "@/presentation/components/sign-out-button";
import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
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

  if (!isMounted) {
    return (
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link href="/">
              <Image src="/logo.png" alt="Logo" width={64} height={64} />
            </Link>
            <nav className="hidden gap-8 text-sm font-medium text-[#03045e] lg:flex">
              <Link className="hover:text-[#0077b6] transition-colors" href="/">
                Home
              </Link>
              <Link
                className="hover:text-[#0077b6] transition-colors"
                href="/dashboard"
              >
                Dashboard
              </Link>
              <Link
                className="hover:text-[#0077b6] transition-colors"
                href="/progress"
              >
                Progress
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-[#03045e]">
              <ShoppingCart />
              <span>Cart (0)</span>
            </div>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="hidden text-sm text-[#03045e] sm:inline">
                  {session?.user?.name ?? session?.user?.email}
                </span>
                <SignOutButton />
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm text-[#03045e] hover:text-[#0077b6] transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-[#03045e] border border-[#03045e] rounded-lg hover:bg-[#03045e] hover:text-white transition-colors"
                >
                  Create free account
                </Link>
              </div>
            )}
            <button className="cursor-pointer lg:hidden p-2 text-[#03045e] hover:text-[#0077b6] transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/">
            <Image src="/logo.png" alt="Logo" width={64} height={64} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden gap-8 text-sm font-medium text-[#03045e] lg:flex">
            <Link className="hover:text-[#0077b6] transition-colors" href="/">
              Home
            </Link>
            <Link
              className="hover:text-[#0077b6] transition-colors"
              href="/dashboard"
            >
              Dashboard
            </Link>
            <Link
              className="hover:text-[#0077b6] transition-colors"
              href="/progress"
            >
              Progress
            </Link>
            <Link
              className="hover:text-[#0077b6] transition-colors"
              href="/dashboard/settings"
            >
              Settings
            </Link>
          </nav>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          {/* <div className="hidden sm:flex items-center gap-2 text-sm text-[#03045e]">
            <ShoppingCart />
            <span>Cart (0)</span>
          </div> */}

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-[#03045e] sm:inline">
                {session?.user?.name ?? session?.user?.email}
              </span>
              <SignOutButton />
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm text-[#03045e] hover:text-[#0077b6] transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium text-[#03045e] border border-[#03045e] rounded-lg hover:bg-[#03045e] hover:text-white transition-colors"
              >
                Create free account
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="cursor-pointer lg:hidden p-2 text-[#03045e] hover:text-[#0077b6] transition-colors"
          >
            <svg
              className="w-6 h-6"
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

      {/* Mobile menu */}
      {isMounted && isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077b6] focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Mobile navigation */}
            <nav className="space-y-2">
              <Link
                href="/"
                className="block px-3 py-2 text-sm font-medium text-[#03045e] hover:text-[#0077b6] hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Courses
              </Link>
              <Link
                href="/dashboard"
                className="block px-3 py-2 text-sm font-medium text-[#03045e] hover:text-[#0077b6] hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/progress"
                className="block px-3 py-2 text-sm font-medium text-[#03045e] hover:text-[#0077b6] hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Progress
              </Link>
            </nav>

            {/* Mobile auth */}
            {!isAuthenticated && (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link
                  href="/login"
                  className="block px-3 py-2 text-sm text-[#03045e] hover:text-[#0077b6] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 text-sm font-medium text-[#03045e] border border-[#03045e] rounded-lg hover:bg-[#03045e] hover:text-white transition-colors text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Create free account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
