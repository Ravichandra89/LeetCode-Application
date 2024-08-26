import React from "react";
import prisma from "@/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
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

    // Check the current password with the stored hashPassword
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Password is incorrect.",
        },
        { status: 400 }
      );
    }

    // If the password is correct, return success
    return NextResponse.json(
      {
        success: true,
        message: "User signed in successfully",
        user: { username: user.username, email: user.email }, 
      },
      { status: 200 } 
    );
  } catch (error) {
    console.error("Error while signing in:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error while signing in",
      },
      { status: 500 }
    );
  }
}
