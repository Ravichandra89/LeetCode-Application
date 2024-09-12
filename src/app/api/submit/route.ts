import prisma from "@/prisma";
import { NextResponse } from "next/server";

// TODO: Re - Complete this Route & Also build the ProblemSubmission part 

export async function POST(request: Request) {
  try {
    // Gather the Data
    const { userId, problemId, code } = await request.json();

    // Submission Record
    const newSubmission = await prisma.submission.create({
      data: {
        userId,
        problemId,
        code,
        status: SubmissionProblemProcessing(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Submission Created",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error While Problem Submission", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error While Problem Submission",
      },
      { status: 500 }
    );
  }
}

const SubmissionProblemProcessing = async () => {};
