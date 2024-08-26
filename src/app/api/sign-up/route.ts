import prisma from "@/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { SendVerification } from "@/helpers/SendVerification";

const saltRounds = 10;

export async function POST(request: Request) {
  try {
    // Getting data from request body
    const { username, email, password, confirmPassword } = await request.json();

    // Check if username is already taken
    const userExistingByUsername = await prisma.user.findFirst({
      where: {
        username,
        isVerified: true,
      },
    });

    if (userExistingByUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    // Check if a user already exists with the given email
    const userExistByEmail = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date(Date.now() + 3600000);

    if (userExistByEmail) {
      if (userExistByEmail.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      } else {
        // User exists with email but is not verified, so update the password and verify code
        const hashPassword = await bcrypt.hash(password, saltRounds);
        await prisma.user.update({
          where: { email },
          data: {
            password: hashPassword,
            verifyCode,
            verifyCodeExpiry: expiryDate.toISOString(),
          },
        });
      }
    } else {
      // Create a new user
      const hashPassword = await bcrypt.hash(password, saltRounds);
      await prisma.user.create({
        data: {
          username,
          email,
          password: hashPassword,
          confirmPassword: hashPassword,
          verifyCode,
          verifyCodeExpiry: expiryDate.toISOString(),
          isVerified: false,
        },
      });
    }

    // Send verification email or other follow-up actions
    const mailResponse = await SendVerification(email, username, verifyCode);

    if (!mailResponse) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send verification email",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
}
