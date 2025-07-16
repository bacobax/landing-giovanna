import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials ?? {};

        // ✅ Your one allowed user
        const validUsername = "admin";
        const validPassword = "mypassword";

        if (username === validUsername && password === validPassword) {
          return { id: "1", name: "Admin" };
        }

        // ❌ Invalid login
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "secret",
};