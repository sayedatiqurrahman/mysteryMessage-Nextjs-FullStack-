"use client";
import { Button } from "@react-email/components";
import { Link } from "lucide-react";
import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import * as React from "react";

export const Navbar = () => {
  const { data: session } = useSession();

  const user: User = session?.user as User;
  React.useEffect(() => {
    console.log("session", session);
    console.log("user", user);
  }, [session, user]);
  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          True Feedback
        </a>
        {session ? (
          <>
            <span className="mr-4">Welcome, {user.username || user.email}</span>
            <Button
              onClick={() => signOut()}
              className="w-full md:w-auto bg-slate-100 text-black px-4 py-1 border-2 rounded-md border-slate-100"
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full md:w-auto bg-slate-100 text-black px-4 py-1 border-2 rounded-md border-slate-100">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};
