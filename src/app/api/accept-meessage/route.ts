import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User.model";
import { ApiError } from "@/utils/ApiError";
import CusApiResponse from "@/utils/ApiResponse";
import { MethodCheck } from "@/utils/MethodCheck";
import { UserDestructionFromSession } from "@/utils/userDestructFromSession";

export async function POST(request: Request) {
  MethodCheck(request, "POST");
  await dbConnect();
  const result = await UserDestructionFromSession();

  if ("success" in result && !result.success) {
    return Response.json(new ApiError(401, "", result.message), {
      status: 401,
    });
  }
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      result?._id,
      {
        isAcceptingMessage: acceptMessages,
      },
      { new: true }
    );

    if (!updatedUser)
      return Response.json(
        new CusApiResponse(
          401,
          [],
          "failed to update user status to accept messages"
        ),
        { status: 401 }
      );

    return Response.json(
      new CusApiResponse(
        200,
        updatedUser,
        "user status to accept messages updated successfully !!!!"
      ),
      { status: 200 }
    );
  } catch (error) {
    throw Response.json(
      { success: false, message: "", error },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  // Connect to the database
  MethodCheck(request, "GET");
  await dbConnect();
  const user = await UserDestructionFromSession();

  if ("success" in user && !user.success) {
    return Response.json(new ApiError(401, "", user.message), {
      status: 401,
    });
  }

  try {
    // Retrieve the user from the database using the ID
    const foundUser = await userModel.findById(user._id);

    if (!foundUser) {
      // User not found
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Return the user's message acceptance status
    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage,
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
