import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { comment } from "postcss";

// GET : To fetch the problem comments.
// POST : For Creating new Problem comments

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const problemId = searchParams.get("problemId");

    if (!problemId) {
      return NextResponse.json(
        {
          success: false,
          message: "Problem ID is required",
        },
        { status: 404 }
      );
    }

    // Fetching the comments from DataBase
    const CommentResponse = await prisma.comment.findMany({
      where: {
        problemId,
      },
      include: { user: true },
    });

    if (!CommentResponse) {
      return NextResponse.json(
        {
          success: false,
          message: "No comments found",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        comments: CommentResponse,
        message: "Comments Fetched Successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error While Fecthing problemId Comments", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error While Fecthing problem Comments",
      },
      { status: 500 }
    );
  }
}

// 2. POST Request Implementation

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const problemId = searchParams.get("problemId");

    const { content, userId } = await request.json();

    if (!problemId || !userId) {
      return NextResponse.json(
        {
          success: false,
          message: "ProblemId and UserId are required",
        },
        { status: 404 }
      );
    }

    // Making problem According to { UserId, problemId };
    const response = await prisma.comment.create({
      data: {
        content,
        userId,
        problemId,
      },
    });

    if (!response) {
      return NextResponse.json(
        {
          success: false,
          message: "Comment Not Created",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Comment Created Successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error While Making Comment", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error While Making Comment",
      },
      { status: 500 }
    );
  }
}





