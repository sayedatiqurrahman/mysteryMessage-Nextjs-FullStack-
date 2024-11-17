import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User.model";
import { usernameValidation } from "@/schemas/signUpSchema";
import { ApiError } from "@/utils/ApiError";
import CusApiResponse from "@/utils/ApiResponse";
import { MethodCheck } from "@/utils/MethodCheck";
import { z } from "zod";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  MethodCheck(request, "GET");
  await dbConnect();
  try {
    const { searchParams } = new URL(request?.url);
    const searchParam = {
      username: searchParams.get("username"),
    };
    const validatedUsername = usernameQuerySchema.safeParse(searchParam);

    if (!validatedUsername.success) {
      const usernameErrors =
        validatedUsername.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length < 0
              ? usernameErrors?.join(", ")
              : "invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = validatedUsername.data;
    const existingVerifiedUser = await userModel.findOne({
      username: username,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "username is already taken",
        },
        {
          status: 400,
        }
      );
    }

    return Response.json(new CusApiResponse(200, {}, "username is unique"), {
      status: 200,
    });
  } catch (error) {
    console.error("error while checking unique username : ", error);
    return Response.json(
      new ApiError(500, "error while checking unique username"),
      { status: 500 }
    );
  }
}
