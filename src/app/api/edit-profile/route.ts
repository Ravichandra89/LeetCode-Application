import prisma from "@/prisma";
import { NextResponse } from "next/server";
import s3 from "../aws";
import { v4 as uuidv4 } from "uuid";

const BucketName = process.env.BUCKET_NAME;

export async function POST(request : Request){
    try {
        const {userId, username, name, image} = await request.json();

        // Find the User by UserId
        const userFind = await prisma.user.findUnique({
            where: {id : userId},
        });

        if(!userFind){
            return NextResponse.json({
                sucess : false,
                message : "User not found"
            }, {status : 404});
        };

        // Upload the image into the Amazon S3
        


    } catch (error) {
        console.error("Error While UPdating User Profile", error);
        return NextResponse.json({
            success : false,
            message : "Error Updating Profile",
        } {status : 500});
    }
}