import { NextResponse } from "next/server";
import Queue from "bull";

// Redis Queue Client
const submissionQueue = new Queue("problem-submission", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});

submissionQueue.on("error", (err) => {
  console.error("Redis Queue Error:", err);
});

export async function POST(request: Request) {
  try {
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

    // Push the data into the queue
    await submissionQueue.add({
      problemId,
      userId,
      code,
      language,
      input,
      output,
    });

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
  }
}
