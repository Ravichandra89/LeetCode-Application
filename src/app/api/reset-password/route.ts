import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { SendVerification } from "@/helpers/SendVerification";

export default async function POST(request: Request) {
  // Taking Email in Input
  const { email } = await request.json();

  try {
    // Found User with email
    const user = await prisma.user.findFirst({
      where: {
        email,
        isVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not Exist with this email or not verified",
        },
        { status: 400 }
      );
    }

    // If User Exist when
    // Generate the Verification Code
    let code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date(Date.now() + 3600000);

    await prisma.user.update({
      where: { email },
      data: {
        verifyCode: code,
        verifyCodeExpiry: expiryDate.toISOString(),
      },
    });

    // Sending Code to Email
    const mailResponse = await SendVerification(email, user.username, code);
    if (!mailResponse) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send Verification - Code",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Verification Code send Successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Sending Verification Code", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error Sending Verification Code",
      },
      { status: 500 }
    );
  }
}
