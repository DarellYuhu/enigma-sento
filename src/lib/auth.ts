import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { SentoClient } from "./sento-client";

type SignInResponse = {
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      displayName: string;
      role: string;
    };
  };
};

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    id?: string;
    displayName: string;
    role: string;
    token: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const {
            data: { data },
          } = await SentoClient.post<SignInResponse>(
            "/auth/sign-in",
            credentials,
            {
              baseURL: process.env.NEXT_PUBLIC_BASE_URL_API_AUTH,
            }
          );
          const user = { ...data.user, token: data.token };
          return user;
        } catch (_error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // @ts-ignore
      session.user = token.user;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
});
