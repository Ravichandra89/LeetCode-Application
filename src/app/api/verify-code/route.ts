import prisma from "@/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, code } = await request.json();
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 400 }
      );
    }

    // Check if the verification code is valid
    const isValidCode = user.verifyCode === code;
    const isNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isNotExpired && isValidCode) {
      // Update User verification Status
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        { status: 200 }
      );
    } else if (!isNotExpired) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Verification code has expired. Please sign up again to get a new code.",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect verification code!",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying code:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error verifying code!",
      },
      { status: 500 }
    );
  }
}
