import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { useCases } from "@/infrastructure/container";
import type { JWT } from "next-auth/jwt";
import type { Session, SessionStrategy } from "next-auth";
import type { User } from "next-auth";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authConfig = {
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        try {
          const user = await useCases.authenticateUser().execute(parsed.data);
          return {
            id: user.id,
            email: user.email,
            displayName: user.displayName,
          };
        } catch (error) {
          console.error("Failed to authenticate user", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.name = user.displayName;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string | undefined;
        session.user.email = token.email as string | undefined;
      }
      return session;
    },
  },
  trustHost: true,
};
