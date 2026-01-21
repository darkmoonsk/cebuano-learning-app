import { SiteHeader } from "@/presentation/components/site-header";
import { auth } from "@/auth";
import { Session } from "next-auth";

export default async function layout({ children }: { children: React.ReactNode }) {
  const session = (await auth()) as Session | null;

  return (
    <>
      <SiteHeader session={session} />
      {children}
    </>
  );
}