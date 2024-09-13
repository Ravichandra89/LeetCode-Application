import prisma from "@/prisma";
import { NextResponse } from "next/server";

// Fetch the all problemssrc/app/api/problems/route.ts

export async function GET(request: Request) {
  try {
    // Find all problems
    const response = await prisma.problem.findMany({
      include: {
        examples: true,
        tag: true, 
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
      data: response.map((problem) => ({
        title: problem.title,
        difficulty: problem.difficulty,
        tag: problem.tag?.name, 
        examples: problem.examples,
      })),
      message: "All Problems Fetched Successfully!",
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
