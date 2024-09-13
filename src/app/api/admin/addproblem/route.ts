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
    console.log({ title, description, difficulty, tags, examples });

    // Create the problem
    const newProblem = await prisma.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples: {
          create: examples.map((it: { input: string; output: string }) => ({
            input: JSON.stringify(it.input),
            output: JSON.stringify(it.output),
          })),
        },
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
