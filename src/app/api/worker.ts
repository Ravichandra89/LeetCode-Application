import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { createClient } from "redis";
import WebSocket, { WebSocketServer } from "ws";
import axios from "axios";

// Create  redis Client
const redisClient = createClient({ url: "redis://127.0.0.1:6379" });
const pubClient = createClient({ url: "redis://127.0.0.1:6379" });

// Web Socket Connection
const wss = new WebSocket.Server({ port: 8084 });
const clients: { [problemId: string]: WebSocket } = {};

// Connection Handler for Web Socket
wss.on("connection", (ws) => {
  ws.on("message", (message: string) => {
    const { problemId } = JSON.parse(message);
    if (problemId) {
      clients[problemId] = ws;
      console.log(`Client connected for problemId: ${problemId}`);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Language Urls
const microServiceUrl: { [key: string]: string } = {
  cpp: "http://cpp-runtime-service:8000/execute",
  python: "http://python-runtime-service:8081/execute",
  java: "http://java-runtime-service:8082/execute",
};

// Function to send task to appropriate runtime Servers
const sendTaskToMicroService = async (
  language: string,
  code: string,
  inputs: string[]
) => {
  const url = microServiceUrl[language];
  if (!url) {
    return { error: "Language not supported" };
  }

  try {
    const response = await axios.post(url, { code, inputs });
    return response.data;
  } catch (error) {
    console.error(`Error while executing code for ${language}`);
    return {
      success: false,
      output: `Error while execuring code for ${language}`,
    };
  }
};

// Check the runtime given code and actual Code
const checkRuntimeCodeWithActual = async (
  problemId: string,
  response: string
) => {
  try {
    // Match the Outputs
    // 1. Fetch the problem from dataBase using prisma

    const problem = await prisma.submission.findUnique({
      where: { id: problemId },
      include: { totalCasesPass: true },
    });

    if (!problem || !problem.totalCasesPass) {
      console.error("Error Fetching Problem for Validation");
      return {
        status: "Error",
        message: "Error Fetching Problem for Validation",
      };
    }

    const expectedOutputs = problem.totalCasesPass.map((it) => it.output);
    const generatedOutputs = response.output.split("\n").filter(Boolean);

    // Compare the Expected and Generated Output
    if (generatedOutputs.length != expectedOutputs.length) {
      return {
        status: "Error",
        message: "Output length mismatch!",
      };
    }

    // checking each output
    for (let i = 0; i < expectedOutputs.length; i++) {
      if (generatedOutputs[i].trim() != expectedOutputs[i].trim()) {
        return {
          status: "Wrong Submission",
          message: "Incorrect Output",
        };
      }
    }

    // If all cases are matched than
    return {
      success: "Accepted",
      message: "All Test Cases Passed",
    };
  } catch (error) {
    console.error("Error Checking output with actual problem output", error);
    return { status: "Error", message: "Error During Output Validation" };
  }
};

// Start the worker Node
const workerNode = async () => {
  try {
    // Connect to Redis
    await redisClient.connect();
    await pubClient.connect();

    console.log("Redis & Pub Clients are Connected");

    while (true) {
      try {
        // Connect the redis and pub client
        await redisClient.connect();
        await pubClient.connect();

        console.log("Redis and pub Clients are Connected!");

        const task = await redisClient.brPop("problems", 0);

        if (task) {
          const taskData = JSON.parse(task.element);
          const { language, code, inputs, problemId, userId } = taskData;

          // language Validation
          if (!microServiceUrl[language]) {
            console.error("Language Not Supported");
            continue;
          }

          console.log(
            `Processing code for ${language} and problemid ${problemId}, for User : ${userId}`
          );

          const ExecutionResponse = await sendTaskToMicroService(
            language,
            code,
            inputs
          );
          if (!ExecutionResponse) {
            console.error("Error in Execution Response");
            continue;
          }

          const CheckingResponse = await checkRuntimeCodeWithActual(
            problemId,
            ExecutionResponse
          );

          await pubClient.publish(
            "result",
            JSON.stringify({ problemId, userId, CheckingResponse })
          );

          // Send result to Client via WebSocket
          const clientSocket = clients[problemId];
          if (clientSocket && clientSocket.readyState === WebSocket.OPEN) {
            clientSocket.send(
              JSON.stringify({ status: CheckingResponse.status })
            );
          } else {
            console.log(
              `Client socket for problemId ${problemId} not connected`
            );
          }
        }
      } catch (error) {}
    }
  } catch (error) {
    console.error("Error in Redis Connection", error);
  } finally {
    await redisClient.disconnect();
    await pubClient.disconnect();
  }
};

// Start worker Node
workerNode();
