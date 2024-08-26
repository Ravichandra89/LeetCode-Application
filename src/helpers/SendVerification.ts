import VerificationEmail from "../../Email/EmailVerification";
import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";

export async function SendVerification(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "dev@ravichandra.com",
      to: email,
      subject: "LeetCode Application Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return {
      success: false,
      message: "Verification Email Send Successfully!",
    };
  } catch (error) {
    console.error("Error Sending Verification Code", error);
    return {
      success: false,
      message: "Failed to Send Verification Mail",
    };
  }
}
