import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User.model";
import { ApiError } from "@/utils/ApiError";
import { MethodCheck } from "@/utils/MethodCheck";
import { UserDestructionFromSession } from "@/utils/userDestructFromSession";
import mongoose from "mongoose";

export async function GET(request: Request) {
  // Connect to the database
  MethodCheck(request, "GET");
  await dbConnect();
  const user = await UserDestructionFromSession();

  if ("success" in user && !user.success) {
    return Response.json(new ApiError(401, "", "Not Authenticated"), {
      status: 401,
    });
  }

  const _id = new mongoose.Types.ObjectId(user?._id);
  try {
    // Retrieve the user from the database using the ID
    const user = await userModel.aggregate([
      { $match: { _id } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user?.length == 0) {
      return Response.json(
        {
          success: false,
          messages: "no messages found",
        },
        { status: 404 }
      );
    }

    // Return the user's message acceptance status
    return Response.json(
      {
        success: true,
        messages: user[0]?.messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving message acceptance status:", error);
    return Response.json(
      { success: false, message: "Error retrieving message acceptance status" },
      { status: 500 }
    );
  }
}
