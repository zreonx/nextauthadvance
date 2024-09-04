import prisma from "@/lib/prisma";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcrypt";
import NextAuth from "next-auth/next";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials, req) {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.username,
          },
        });

        if (!user) throw new Error("Username or password is not correct");

        if (!credentials?.password)
          throw new Error("Please provide your password");
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect)
          throw new Error("Username or password is not correct");

        const { password, ...userWithoutPassword } = user;

        return userWithoutPassword;
      },
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
