import prisma from "@/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Find the all problems Request
    const response = await prisma.problem.findMany({
      include: {
        examples: true,
        tags: true,
      },
    });

    if (!response) {
      return NextResponse.json(
        {
          message: "No problems found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Error Fetching All Problems", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error Fetching All Problems",
      },
      { status: 500 }
    );
  }
}
