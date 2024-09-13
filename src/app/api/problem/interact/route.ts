import prisma from "@/prisma";
import { NextResponse } from "next/server";

// Like & Dislike problem route
export async function POST(request: Request) {
  try {
    // Gather the data for Action (Like / Dislike)
    const { problemId, action } = await request.json();

    if (!problemId || !action || !["like", "dislike"].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Input",
        },
        { status: 400 }
      );
    }

    const updateData =
      action === "like"
        ? { likes: { increment: 1 } } 
        : { dislikes: { increment: 1 } };

    // Updating the problem
    const response = await prisma.problem.update({
      where: { id: problemId },
      data: updateData,
    });

    return NextResponse.json(
      {
        success: true,
        message: `${action.charAt(0).toUpperCase() + action.slice(1)} recorded`,
        problem: response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while like/dislike the problem", error);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to like / dislike problem",
      },
      { status: 500 }
    );
  }
}
