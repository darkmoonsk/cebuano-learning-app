import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/presentation/providers/session-provider";
import { auth } from "@/auth";
import { SiteHeader } from "@/presentation/components/site-header";
import type { Session } from "next-auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bisaya Learning",
  description:
    "Learn Cebuano vocabulary with adaptive spaced repetition and progress tracking.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = (await auth()) as Session | null;

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}
        suppressHydrationWarning
      >
        <SessionProvider session={session}>
          <SiteHeader session={session} />
          <main className="relative">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
