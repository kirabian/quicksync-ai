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
    CredentialsProvider({
      id: "telegram",
      name: "Telegram",
      credentials: {
        id: { label: "id", type: "text" },
        first_name: { label: "first_name", type: "text" },
        last_name: { label: "last_name", type: "text" },
        username: { label: "username", type: "text" },
        photo_url: { label: "photo_url", type: "text" },
        auth_date: { label: "auth_date", type: "text" },
        hash: { label: "hash", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.hash) return null;

        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (!botToken) {
          console.error("TELEGRAM_BOT_TOKEN is not set");
          return null;
        }

        const { hash, ...data } = credentials;
        
        // Filter out null/undefined and sort keys
        const dataCheckArr = Object.keys(data)
          .filter(key => data[key as keyof typeof data] !== undefined && data[key as keyof typeof data] !== null)
          .sort()
          .map((key) => `${key}=${data[key as keyof typeof data]}`);
        
        const dataCheckString = dataCheckArr.join("\n");

        const secretKey = createHash("sha256").update(botToken).digest();
        const hmac = createHmac("sha256", secretKey)
          .update(dataCheckString)
          .digest("hex");

        if (hmac !== hash) {
          console.error("Telegram hash verification failed");
          return null;
        }

        // Check if auth_date is within last 24 hours to prevent replay attacks
        const authDate = parseInt(credentials.auth_date);
        const now = Math.floor(Date.now() / 1000);
        if (now - authDate > 86400) {
          console.error("Telegram auth_date is too old");
          return null;
        }

        return {
          id: credentials.id,
          name: credentials.username || credentials.first_name,
          image: credentials.photo_url,
          email: `${credentials.id}@telegram.user`, // Fake email for next-auth compatibility
        };
      },
    }),
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
