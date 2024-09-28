import prisma from "@/prisma";
import { NextResponse } from "next/server";
import AWS from "aws-sdk";

// AWS configurations
const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

// Function to upload Image and return Url
const uploadToS3 = async (file: Express.Multer.File): Promise<string> => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `achievements/${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const response = await s3.upload(params).promise();
  return response.Location;
};

// Creating Achivements POST request
export async function POST(request: Request) {
  try {
    const { title, description, userId } = await request.json();
    const file = await request.body.get("image");

    // Validation
    if (!title || !description || !userId || !file) {
      return NextResponse.json(
        {
          sucess: false,
          message: "All fields are required.",
        },
        { status: 404 }
      );
    }

    const badgeUrl = await uploadToS3(file);
    const achievement = await prisma.achievement.create({
      data: {
        title,
        description,
        badgeUrl,
        userId,
      },
    });

    if (!achievement) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create achievement",
        },
        { status: 400 }
      );
    }

    // Send Successfully Creation response
    return NextResponse.json(
      {
        success: true,
        message: "Achievement created successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while creating achivement", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error while creating achivement",
      },
      { status: 500 }
    );
  }
}
