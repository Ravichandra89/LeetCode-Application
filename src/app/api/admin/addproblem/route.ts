import prisma from "@/prisma";
import { NextResponse } from "next/server";
// Logic to add the new problem in the database
/*
 1. title
 2. description
 3. difficulty
 4. tags
 5. test Cases ( with Input & Output)
*/

export async function POST(request: Request) {
  try {
    // Gather Data from Request
    const { title, description, difficulty, tags, examples } =
      await request.json();

    // Create the problem
    const newProblem = await prisma.Problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples: {create: {}}
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Problem Added Successfully!",
        problem: newProblem,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Adding Problem", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error Adding Problem",
      },
      { status: 500 }
    );
  }
}
