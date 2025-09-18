import NextAuth, { Session } from "next-auth";
import { getServerSession } from "next-auth";
import { authConfig } from "@/infrastructure/auth/auth-config";

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };

export function auth(): Promise<Session | null> {
  return getServerSession(authConfig);
}
