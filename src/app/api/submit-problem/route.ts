import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { createClient } from "redis";

// Initialize Redis Client
const redisClient = createClient({
  url: "redis://127.0.0.1:6379",
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export async function POST(request: Request) {
  try {
    // Connect to Redis
    await redisClient.connect();

    const { problemId, userId, code, language, input, output } =
      await request.json();

    // Validate required fields
    if (!problemId || !userId || !code || !language) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill all the required fields",
        },
        { status: 400 }
      );
    }

    // Push the submission to the Redis queue (list)
    const response = await redisClient.lPush(
      "problems",
      JSON.stringify({ problemId, userId, code, language, input, output })
    );

    if (!response) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to push submission to Redis queue",
        },
        { status: 400 }
      );
    }

    // Send a success response
    return NextResponse.json(
      {
        success: true,
        message: "Submission received successfully",
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
  } finally {
    // Disconnect from Redis
    await redisClient.disconnect();
  }
}
