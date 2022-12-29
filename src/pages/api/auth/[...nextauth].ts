import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../../lib/prisma";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const res = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });
        const user = await res.json();
        console.log("USER", user);
        if (res.ok && user) {
          console.log(user.name, "INSIDE IF");
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          console.log("error");
          // If you return null then an error will be displayed advising the user to check their details.
          return null;
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    GitHubProvider({
      clientId: <string>process.env.GITHUB_ID,
      clientSecret: <string>process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: <string>process.env.GOOGLE_CLIENT_ID,
      clientSecret: <string>process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        console.log("inside jwt callback", "TOKEN:", token, "USER:", user);
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.uid;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.SECRET,
});
