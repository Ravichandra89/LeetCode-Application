// Extract particular problem details by problem ID
import prisma from "@/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { id: problemId } = await request.json();

    // Fetch the problem
    const response = await prisma.problem.findUnique({
      where: { id: problemId },
      include: {
        examples: true,
        tags: true,
      },
    });

    if (!response) {
      return NextResponse.json(
        {
          success: false,
          message: "Problem not found",
        },
        { status: 404 }
      );
    }

    // Return the problem Details
    return NextResponse.json(
      {
        success: true,
        data: {
          title: response.title,
          description: response.description,
          difficulty: response.difficulty,
          tags: response.tags,
          examples: response.examples.map((exp) => ({
            input: exp.input,
            output: exp.output,
          })),
        },
        message: "Problem Fetched Succesfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Fetching Problem with problemId", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error while Fetching problem by ID",
      },
      { status: 500 }
    );
  }
}
