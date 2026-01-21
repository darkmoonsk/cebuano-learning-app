import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/presentation/components/site-header";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { HomeCommunityForumIcon } from "@/presentation/components/icons/home-community-forum-icon";
import { HomeDailyLessonIcon } from "@/presentation/components/icons/home-daily-lesson-icon";
import { HomeFlashcardsIcon } from "@/presentation/components/icons/home-flashcards-icon";
import { HomePhrasebookIcon } from "@/presentation/components/icons/home-phrasebook-icon";
import { HomeProgressTrackerIcon } from "@/presentation/components/icons/home-progress-tracker-icon";
import { HomeMeshBackground } from "@/presentation/components/home-mesh-background";

interface FeatureCard {
  readonly title: string;
  readonly description: string;
  readonly cta: string;
  readonly href: string;
  readonly icon: React.ReactNode;
}

interface QuickAction {
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly icon: React.ReactNode;
}

const primaryFeatures: FeatureCard[] = [
  {
    title: "FLASHCARDS",
    description: "Expand vocabulary with interactive digital flashcards.",
    cta: "STUDY FLASHCARDS",
    href: "/dashboard/flashcards",
    icon: <HomeFlashcardsIcon />,
  },
  {
    title: "PHRASEBOOK",
    description: "Learn conversational phrases for real-life situations.",
    cta: "EXPLORE PHRASES",
    href: "/dashboard/phrases",
    icon: <HomePhrasebookIcon />,
  },
];

const quickActions: QuickAction[] = [
  {
    title: "DAILY LESSON",
    description: "New words & phrases daily.",
    href: "/dashboard",
    icon: <HomeDailyLessonIcon />,
  },
  {
    title: "PROGRESS TRACKER",
    description: "Monitor with learning journey.",
    href: "/progress",
    icon: <HomeProgressTrackerIcon />,
  },
  {
    title: "COMMUNITY FORUM",
    description: "Connect with fellow learners.",
    href: "#",
    icon: <HomeCommunityForumIcon />,
  },
];

export default async function Home() {
  const session = (await auth()) as Session | null;
  
  return (
    

    <main className="relative min-h-screen bg-gradient-to-b from-[#0b1c48] via-[#102a63] to-[#0b1c48] text-white overflow-hidden">
      <HomeMeshBackground className="pointer-events-none absolute inset-0" />
      <SiteHeader session={session} />
      <div className="absolute inset-0 opacity-60">
        <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#5fb6ff] blur-[120px]" />
        <div className="absolute bottom-[-120px] right-[-80px] h-80 w-80 rounded-full bg-[#5fffd6] blur-[140px]" />
        <div className="absolute inset-x-0 bottom-0 h-96 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08)_0,_rgba(255,255,255,0)_60%)]" />
      </div>
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-8">
        <section className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-8 backdrop-blur lg:p-12">
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-5">
              <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
                MABUYAY! Sugdan Ta Pagtoun og Cebuano
              </h1>
              <p className="text-base text-white/80 sm:text-lg">
                Your journey to fluency starts here.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl border border-[#f6c445] bg-[#f6c445] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-[#0b1c48] transition hover:bg-[#ffd36d]"
              >
                Start Learning Now
              </Link>
            </div>
            <div className="hidden lg:block" />
          </div>
          <div className="pointer-events-none absolute bottom-0 right-0 z-10 translate-x-6 translate-y-6">
            <div className="absolute -inset-6 rounded-full bg-white/10 blur-2xl" />
            <Image
              src="/pet.png"
              alt="Cebuano Learner pet"
              width={380}
              height={380}
              className="relative drop-shadow-2xl"
            />
          </div>
        </section>
        <section className="grid gap-6 lg:grid-cols-2">
          {primaryFeatures.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  {feature.icon}
                </div>
                <div className="flex items-center gap-3 text-white/30">
                  <div className="h-2 w-2 rounded-full bg-white/30" />
                  <div className="h-2 w-2 rounded-full bg-white/30" />
                  <div className="h-2 w-2 rounded-full bg-white/30" />
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <h2 className="text-lg font-semibold">{feature.title}</h2>
                <p className="text-sm text-white/75">{feature.description}</p>
                <Link
                  href={feature.href}
                  className="inline-flex items-center justify-center rounded-xl bg-[#2c6bed] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[#3c7df3]"
                >
                  {feature.cta}
                </Link>
              </div>
            </div>
          ))}
        </section>
        <section className="grid gap-6 md:grid-cols-3">
          {quickActions.map((action) => (
            <div
              key={action.title}
              className="rounded-3xl border border-white/15 bg-white/10 px-6 py-5 text-center backdrop-blur"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#2c6bed]">
                {action.icon}
              </div>
              <h3 className="mt-4 text-sm font-semibold">{action.title}</h3>
              <p className="mt-2 text-xs text-white/70">{action.description}</p>
              <Link
                href={action.href}
                className="mt-4 inline-flex rounded-full bg-[#2c6bed] px-4 py-1 text-xs font-semibold text-white"
              >
                GO
              </Link>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
