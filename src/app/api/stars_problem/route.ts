import prisma from "@/prisma";
import { NextResponse } from "next/server";

// Problem (Star / Unstar ) Handler
export async function POST(request: Request) {
  try {
    const { userId, problemId } = await request.json();

    if (!userId || !problemId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Request",
        },
        { status: 404 }
      );
    }

    const existStars = await prisma.starProblem.findFirst({
      where: { userId, problemId },
    });

    if (existStars) {
      return NextResponse.json(
        {
          success: false,
          message: "You have already star this problem",
        },
        { status: 400 }
      );
    }

    const starResponse = await prisma.starProblem.create({
      data: {
        userId,
        problemId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Problem Starred Successfully",
        starResponse,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Invalid Request",
    });
  }
}

// Fetch the Star Problems
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 }
      );
    }

    // Start fetching all problems
    const staredProblem = await prisma.starProblem.findMany({
      where: { id: userId },
      include: {
        problem: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Stared Problems Fetch Successfully!",
    });
  } catch (error) {
    console.error("Error while Fetching Star problems", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error while Fetching stars problems",
      },
      { status: 500 }
    );
  }
}
