import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    username?: string;
    message?: string;
    success?: boolean;
    email?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
  }
  interface Session {
    user: {
      _id?: string;
      username?: string;
      email?: string;
      isVerified?: boolean;
      isAcceptingMessage?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface Jwt {
    _id?: string;
    username?: string;
    email?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
  }
}
