import prisma from "@/prisma";
import next from "next";
import { NextResponse } from "next/server";

// PATCH Comment Request
// DELETE comment Request

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");

    const { content } = await request.json();

    if (!commentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Comment ID is required",
        },
        { status: 404 }
      );
    }

    // Updating the problem
    const response = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content,
      },
    });

    if (!response) {
      return NextResponse.json(
        {
          success: false,
          message: "Comment not found",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Comment updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error While Updating Comment", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error While Updating Comment",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {}
