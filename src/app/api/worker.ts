import prisma from "@/prisma";
import { createClient } from "redis";

// Redis & Pub Client
const redisClient = createClient({ url: "redis://127.0.0.1:6379" });
const pubClient = createClient({ url: "redis://127.0.0.1:6379" });

const startWorker = async () => {
    try {
        await redisClient.connect();
        await pubClient.connect();

        console.log("Worker Connected to Redis");

        // Infinite Run function to take the tasks
        try {
            while(true){
                const task = await redisClient.brPop("problems", 0);
                if(task){
                    // TODO: Send Task to MicroService Using REST API
                }
            }
        } catch (error) {
            console.error("Error While Poping Task", error);
        }
    } catch (error) {
        console.error("Error in Redis Connection", error);
    } finally{
        await redisClient.disconnect();
        await pubClient.disconnect();
    };
};

// Execute startWroker function
startWorker();

