import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { createClient } from "redis";

//  Initilize Redis Client
const redisClient = createClient({
  url: "redis://127.0.0.1:6379",
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export async function POST(request: Request) {
  try {
    // Gather the data
    const { problemId, userId, code, language, input, output } =
      await request.json();

    // Validation on data
    if (!problemId || !userId || !code || !language) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are Required",
        },
        { status: 404 }
      );
    }

    // push the submission on Redis Queue
    const response = await redisClient.lPush(
      "problem-submission",
      JSON.stringify({
        problemId,
        userId,
        code,
        language,
        input,
        output,
      })
    );

    if (!response) {
      return NextResponse.json(
        {
          success: false,
          message: "Queue Push Operation not working!!",
        },
        { status: 400 }
      );
    }

    // Send a success response
    return NextResponse.json(
      {
        success: true,
        message: "Submission recived succesfully",
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
