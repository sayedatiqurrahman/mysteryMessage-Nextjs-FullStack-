import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verficationEmail";
import { ApiResponse } from "@/Types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const emailResponse = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystery message | Verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    console.log("emailResponse", emailResponse);
    return { success: true, message: "success fully send the gmail" };
  } catch (error) {
    console.error("error sending verification email", error);
    return { success: false, message: "Failed to send verification email" };
  }
}
