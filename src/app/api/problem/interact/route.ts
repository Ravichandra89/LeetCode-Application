import prisma from "@/prisma";
import { NextResponse } from "next/server";

// Like & disLike problem route
export async function POST(request: Request) {
  try {
    // Gather the data Action ( Like / Dislike)
    const { problemId, action } = await request.json();

    if (!problemId || !action || !["like", "dislike"].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Input",
        },
        { status: 404 }
      );

      // Add count of like / dislike action
      const updateData =
        action === "like"
          ? { increment: { likes: 1 } }
          : { increment: { dislikes: 1 } };

      // Updating into problem
      const response = await prisma.problem.update({
        where: { id: problemId },
        data: updateData,
      });

      return NextResponse.json(
        {
          success: true,
          message: `${
            action.charAt(0).toUpperCase() + action.slice(1)
          } recorded`,
          problem: response,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error While Like/disLike the Problem", error);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to like / dislike problem",
      },
      { status: 500 }
    );
  }
}
