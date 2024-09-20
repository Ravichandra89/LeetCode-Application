import prisma from "@/prisma";
import { NextResponse } from "next/server";

// GET : Reterive UserBoard data (profile, submission, achivements, rank);
// POST : Create new userBoard Enetery
// PUT : Update existing userBoard Entry
// DELETE : Delete existing userBoard Entry (Optional)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 404 }
      );
    }

    // Fetch user Data
    const userFetched = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        submissions: true,
        achievements: true,
        LeaderBoard: true,
      },
    });

    if (!userFetched) {
      return NextResponse.json(
        {
          success: false,
          message: "User Not Found",
        },
        { status: 404 }
      );
    }

    // Total Submission
    const totalSubmissions = userFetched.submissions.length;
    const successfulSubmissions = userFetched.submissions.filter(
      (submission) => submission.status === "Success"
    ).length;
    const successRate =
      totalSubmissions > 0
        ? (successfulSubmissions / totalSubmissions) * 100
        : 0;

    // Fetch leaderBoard Information
    const leaderBoard = await prisma.userBoard.findUnique({
      where: { id: userId },
    });

    return NextResponse.json(
      {
        userBoardData,
        success: true,
        message: "User Data Fetched Successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error While Fetching UserBoard");
    return NextResponse.json(
      {
        success: false,
        message: "Error While Fecting UserBoard",
      },
      { status: 500 }
    );
  }
}

// 2. POST Request

export async function POST(request: Request) {}

// 3. PUT Request

export async function PUT(request: Request) {}

// 4. DELETE Request (Optional)

export async function DELETE(request: Request) {}
