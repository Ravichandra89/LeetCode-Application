import prisma from "@/prisma"; // Make sure you have prisma client set up in this path
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Create a URL object to extract query parameters
    const url = new URL(request.url);
    const problemId = url.searchParams.get("_id"); // Change to _id

    // Check if problemId is provided
    if (!problemId) {
      return NextResponse.json(
        {
          success: false,
          message: "Problem ID is required",
        },
        { status: 400 }
      );
    }

    // Fetch the problem details from the database
    const problem = await prisma.problem.findUnique({
      where: { id: problemId }, // Ensure that Prisma schema uses 'id' field
      include: {
        tag: true,
        examples: true,
      },
    });

    // Check if the problem exists
    if (!problem) {
      return NextResponse.json(
        {
          success: false,
          message: "Problem not found",
        },
        { status: 404 }
      );
    }

    // Return the problem details
    return NextResponse.json(
      {
        success: true,
        data: {
          title: problem.title,
          description: problem.description,
          difficulty: problem.difficulty,
          tags: problem.tag,
          examples: problem.examples.map((exp) => ({
            input: exp.input,
            output: exp.output,
          })),
        },
        message: "Problem fetched successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching problem with problemId", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error while fetching problem by ID",
      },
      { status: 500 }
    );
  }
}
