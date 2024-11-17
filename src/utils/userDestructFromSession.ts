import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";

export async function UserDestructionFromSession(): Promise<User> {
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !user) {
    user.message = "Not Authenticated";
    user.success = false;
  }

  return user;
}
