import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User.model";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Define the expected structure of the user

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      type: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await userModel.findOne({
            $or: [
              { email: credentials?.identifier },
              { username: credentials?.identifier },
            ],
          });

          if (!user) throw new Error("no user found with this identifier");
          if (!user?.isVerified) {
            throw new Error("please verify your account before login ");
          }
          console.log("user", user);
          const isMatchedPass = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log("isMatched", isMatchedPass);
          if (isMatchedPass) return user;
          console.log("isMatched 2", isMatchedPass);
          throw new Error("Incorrect password");
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("An unknown error occurred");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      token._id = user?._id;
      token.username = user?.username;
      token.email = user?.email;
      token.isVerified = user?.isVerified;
      token.isAcceptingMessage = user?.isAcceptingMessage;
      return token;
    },
    async session({ session, user }) {
      session.user._id = user?._id;
      session.user.username = user?.username;
      session.user.email = user?.email;
      session.user.isVerified = user?.isVerified;
      session.user.isAcceptingMessage = user?.isAcceptingMessage;
      return session;
    },
  },
  pages: { signIn: "sign-in" },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
