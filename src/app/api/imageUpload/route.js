import { NextResponse } from "next/server";
import { createImage, getAllImage } from "@/models/homeWorkImg/imageModel";
import sendResponse from "@/utils/response";
import { authenticateToken } from "@/middlewares/auth";
import { uploadFilesToFTP } from "@/helper/multer.service";


export const POST = async (request) => {
  const authResponse = await authenticateToken(request);
  
  if (!authResponse.user) {
    return sendResponse(
      NextResponse,
      authResponse.status || 401,
      authResponse.message || "Unauthorized"
    );
  }

  try {
    const studentId = authResponse.user.id;
    const teacherId = authResponse.user.teacherId;
    const formData = await request.formData();
    const files = formData.getAll("files");
    const studentLevel = formData.get("studentLevel");
    const folderName = "studentlesson"; 

    if (!files.length) {
      return sendResponse(NextResponse, 400, "No files received.");
    }

    if (!studentLevel) {
      return sendResponse(NextResponse, 400, "Student Level is required.");
    }

    const uploadResult = await uploadFilesToFTP(files, folderName);

    if (!uploadResult.success) {
      return sendResponse(NextResponse, 500, "Upload Failed");
    }

    const createdImages = [];

    for (const fileUrl of uploadResult.urls) {
      const newImage = await createImage({
        studentId,
        studentLevel,
        teacherId,
        imgUrl: fileUrl,
      });
      createdImages.push(newImage);
    }

    return sendResponse(
      NextResponse,
      201,
      "Images uploaded and saved successfully",
      createdImages
    );

  } catch (error) {
    console.error("Error occurred:", error);
    return sendResponse(NextResponse, 500, "Image Upload Failed");
  }
};

export async function GET(request) {
  const authResponse = await authenticateToken(request);
  if (!authResponse.user) {
    return sendResponse(
      NextResponse,
      authResponse.status || 401,
      authResponse.message || "Unauthorized"
    );
  }
  try {
    const userId = authResponse?.user?.id;
    const userType = authResponse?.user?.user_type;
    const page = parseInt(request.nextUrl.searchParams.get("page")) ?? 1;
    const pageSize =
      parseInt(request.nextUrl.searchParams.get("pageSize")) ?? 10;
    const level = request.nextUrl.searchParams.get("level");
    const createdAt = request.nextUrl.searchParams.get("createdAt");
    const studentName = request.nextUrl.searchParams.get("studentName");
    
    const teacherId = userType === "Teacher" ? userId : null;

    const allReport = await getAllImage(
      userType,
      teacherId,
      page,
      pageSize,
      level,
      createdAt,
      studentName,
    );

    if (allReport) {
      return sendResponse(
        NextResponse,
        200,
        "All Report are available",
        allReport
      );
    } else {
      return sendResponse(NextResponse, 404, "No Report available");
    }
  } catch (error) {
    console.log(error);
    return sendResponse(NextResponse, 500, "Internal server error", {
      error: error.message,
    });
  }
}
