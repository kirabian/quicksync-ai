import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import CredentialsProvider from "next-auth/providers/credentials";
import { createHash, createHmac } from "crypto";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_ID || "",
      clientSecret: process.env.TWITTER_SECRET || "",
      version: "2.0",
    }),
    {
      id: "telegram",
      name: "Telegram",
      type: "oauth",
      wellKnown: "https://oauth.telegram.org/.well-known/openid-configuration",
      authorization: { params: { scope: "openid profile" } },
      idToken: true,
      clientId: process.env.TELEGRAM_CLIENT_ID,
      clientSecret: process.env.TELEGRAM_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.nickname || profile.given_name,
          image: profile.picture,
          email: `${profile.sub}@telegram.user`,
        };
      },
    },
  ],
  callbacks: {
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
};
