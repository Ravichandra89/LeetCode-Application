import prisma from "@/prisma";
import { NextResponse } from "next/server";
import s3 from "../aws";
import { v4 as uuidv4 } from "uuid";

const BucketName = process.env.BUCKET_NAME;

export async function POST(request: Request) {
  try {
    const { userId, username, name, image } = await request.json();

    // Find the User by UserId
    const userFind = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userFind) {
      return NextResponse.json(
        {
          sucess: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // If an Image given
    let imageUrl = userFind.imageUrl;
    if (image) {
      const buffer = Buffer.from(
        image.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      const fileExtension = image.split(";")[0].split("/")[1];
      const imageName = `${uuidv4()}.${fileExtension}`;
      const s3Params = {
        Bucket: BucketName,
        Key: `profile-images/${imageName}`,
        Body: buffer,
        ContentEncoding: "base64",
        ContentType: `image/${fileExtension}`,
      };

      const s3Response = await s3.upload(s3Params).promise();
      imageUrl = s3Response.Location;
    }

    // Update the UserData
    const userUpdated = await prisma.user.update({
        where: { id: userId },
        data: {
            username,
            imageUrl,
        }
    });

    return NextResponse.json({
        sucess: true,
        message: "User updated successfully",
    }, {status : 200});
  } catch (error) {
    console.error("Error While UPdating User Profile", error);
    return NextResponse.json(
      {
        sucess: false,
        message: "Error While UPdating User Profile",
      },
      { status: 500 }
    );
  }
}
