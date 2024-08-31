import prisma from "@/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const saltRounds = 10;

export default async function POST(request: Request) {
  try {
    // Check Password Matched or not
    const { email, newPassword, confirmPassword, verifyCode } =
      await request.json();

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Passwords do not match.",
        },
        { status: 400 }
      );
    }

    // Find the user with the given data
    const user = await prisma.user.findFirst({
      where: {
        email,
        verifyCode,
        verifyCodeExpiry: {
          gte: new Date().toISOString(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired verification code.",
        },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password 
    await prisma.user.update({
      where: { email },
      data: {
        password: hashPassword,
        confirmPassword: hashPassword,
        verifyCode: undefined,
        verifyCodeExpiry: undefined,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Password updated successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Updating Password", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error updating password",
      },
      { status: 500 }
    );
  }
}
