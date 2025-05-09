import { NextResponse } from "next/server";
import sendResponse from "@/utils/response";
import { deleteImageById, getImageById } from "@/models/homeWorkImg/imageModel";
import { authenticateToken } from "@/middlewares/auth";

export async function GET(request, { params }) {
  try {
    const { imageId } = params;
    const imageResult = await getImageById(imageId);
    if (imageResult) {
      return sendResponse(
        NextResponse,
        200,
        "Image are available",
        imageResult
      );
    } else {
      return sendResponse(
        NextResponse,
        404,
        "No Image found with the provided ID"
      );
    }
  } catch (error) {
    console.error(error);
    return sendResponse(NextResponse, 500, "Internal server error");
  }
}
export async function DELETE(request, { params }) {
  const authResponse = await authenticateToken(request);
  if (!authResponse.user) {
    return sendResponse(
      NextResponse,
      authResponse.status || 401,
      authResponse.message || "Unauthorized"
    );
  }
  try {
    const userType = authResponse?.user?.user_type;
    const userId = authResponse?.user?.id;
    const { imageId } = params;
    if (!imageId) {
      return sendResponse(NextResponse, 400, "No image ID(s) provided");
    }
    const imageIds = imageId.includes(",")
      ? imageId.split(",").map((id) => id.trim())
      : imageId;
    const result = await deleteImageById(imageIds, userId, userType);

    if (result.success) {
      return sendResponse(NextResponse, 200, result.message);
    } else {
      return sendResponse(NextResponse, 404, result.message);
    }
  } catch (error) {
    console.error(error);
    return sendResponse(NextResponse, 500, "Internal server error");
  }
}
