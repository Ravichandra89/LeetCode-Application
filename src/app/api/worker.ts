import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { createClient } from "redis";
import axios from "axios";

// Create  redis Client
const redisClient = createClient();
const pubClient = createClient();

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

// Start the worker Node
const workerNode = async () => {
  try {
    // Connect to Redis
    await redisClient.connect();
    await pubClient.connect();

    console.log("Redis & Pub Clients are Connected");

    while (true) {
      // Get the Task from redis queue
      const task = await redisClient.brPop("problem", 0);
      if (task) {
        const taskData = JSON.parse(task.element);
        const { language, code, inputs, problemId, userId } = taskData;

        // Language Validation
        if (!microServiceUrl[language]) {
          console.error("Language is Not supported");
          continue;
        }

        console.log(
          `Processing code for ${language} and problemid ${problemId}, for User : ${userId}`
        );

        // Send task to appropriate MicroService
        const response = await sendTaskToMicroService(language, code, inputs);

        if (!response) {
          console.error("Failed to send task to microservice");
        }

        // Publish response to redis publish
        await pubClient.publish(
          "result",
          JSON.stringify({ problemId, userId, response })
        );

        // Send result to Client via Websocket
      }
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
