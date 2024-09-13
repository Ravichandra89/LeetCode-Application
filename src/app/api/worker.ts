import prisma from "@/prisma";
import { createClient } from "redis";
import Queue from "bull";

// Redis Queue Clients
const redisClient = createClient();
const pubClient = createClient();

// Create a bull queue 
