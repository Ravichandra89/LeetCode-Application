// Extract particular problem details by problem ID
import prisma from "@/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Take problem from url
    const url = new URL(request.url);
    const problemId = url.pathname.split("/").pop();

    if (!problemId) {
      return NextResponse.json(
        {
          success: false,
          message: "Problem ID is required",
        },
        { status: 404 }
      );
    }

    // Fetch the problem
    const response = await prisma.problem.findUnique({
      where: { id: problemId },
      include: {
        tag: true,
        examples: true,
      },
    });

    if (!response) {
      return NextResponse.json(
        {
          success: false,
          message: "Problem not found while Fetching!!",
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
          tags: response.tag,
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
