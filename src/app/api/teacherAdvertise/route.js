import { NextResponse } from "next/server";
import sendResponse from "@/utils/response";
import { authenticateToken } from "@/middlewares/auth";
import {
  createTeacherAdvertise,
  findTeacherAdvertiseByUserId,
  getAllTeacherAdvertise,
} from "@/models/teacherAdv/studentAdvModel";
import { uploadFilesToFTP } from "@/helper/multer.service";

export async function POST(request) {
  const authResponse = await authenticateToken(request);

  if (!authResponse.user) {
    return sendResponse(
      NextResponse,
      401,
      authResponse.message || "Unauthorized"
    );
  }

  if (authResponse.user.user_type !== "Teacher") {
    return sendResponse(
      NextResponse,
      403,
      "Forbidden: Only Teacher can create advertisements."
    );
  }

  try {
    const userId = authResponse.user.id;
    const formData = await request.formData();
    const files = formData.getAll("files");
    const description = formData.get("description");
    const folderName = "advertisement";

    if (!files.length) {
      return sendResponse(NextResponse, 400, "No files received.");
    }

    const existingAdv = await findTeacherAdvertiseByUserId(userId);
    if (existingAdv) {
      return sendResponse(
        NextResponse,
        400,
        "Previous Advertisement was inactive. Create a new one."
      );
    }

    const uploadResult = await uploadFilesToFTP(files, folderName);
    if (!uploadResult.success) {
      return NextResponse.json({ message: "Upload Failed" }, { status: 500 });
    }

    const createdAds = [];

    for (const fileUrl of uploadResult.urls) {
      const newAdv = await createTeacherAdvertise({
        userId,
        description,
        imgUrl: fileUrl,
      });
      createdAds.push(newAdv);
    }

    return sendResponse(
      NextResponse,
      201,
      "Advertisement created successfully",
      createdAds
    );
  } catch (error) {
    console.error("Error:", error);
    return sendResponse(NextResponse, 500, "Internal server error");
  }
}

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
    const teacherId =
      userType === "Teacher" ? userId : authResponse?.user?.teacherId;
    const page = parseInt(request.nextUrl.searchParams.get("page")) ?? 1;
    const pageSize =
      parseInt(request.nextUrl.searchParams.get("pageSize")) ?? 10;
    const teacherName = request.nextUrl.searchParams.get("teacherName");

    const allAdv = await getAllTeacherAdvertise(
      userType,
      userId,
      teacherId,
      page,
      pageSize,
      teacherName
    );

    if (allAdv) {
      return sendResponse(
        NextResponse,
        200,
        "All Advertisement are available",
        allAdv
      );
    } else {
      return sendResponse(NextResponse, 404, "No Advertisement available");
    }
  } catch (error) {
    console.log(error);
    return sendResponse(NextResponse, 500, "Internal server error", {
      error: error.message,
    });
  }
}
