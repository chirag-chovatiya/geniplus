import { NextResponse } from "next/server";
import sendResponse from "@/utils/response";
import { authenticateToken } from "@/middlewares/auth";
import {
  deleteTeacherAdvertiseById,
  getTeacherAdvertiseById,
  updateTeacherAdvertiseById,
} from "@/models/teacherAdv/studentAdvModel";
import { uploadFilesToFTP } from "@/helper/multer.service";

export async function GET(request, { params }) {
  try {
    const { tAdvId } = params;
    const advResult = await getTeacherAdvertiseById(tAdvId);
    if (advResult) {
      return sendResponse(
        NextResponse,
        200,
        "Student Advertisement are available",
        advResult
      );
    } else {
      return sendResponse(
        NextResponse,
        404,
        "No Student Advertisement found with the provided ID"
      );
    }
  } catch (error) {
    console.log(error);
    return sendResponse(NextResponse, 500, "Internal server error");
  }
}

export async function POST(request, { params }) {
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
    const { tAdvId } = params;
    const formData = await request.formData();
    const description = formData.get("description") || null;
    const files = formData.getAll("files") || null;
    const status = formData.get("status") || null;

    let imgUrl = null
    
    if (files.length) {
      const folderName = "advertisement";
      const uploadResult = await uploadFilesToFTP(files, folderName);

      if (!uploadResult.success) {
        return sendResponse(NextResponse, 500, "File upload failed.");
      }

      imgUrl = uploadResult?.urls.join(", ");
    }
    const userData = {};
    userData.description = description || null;
    userData.imgUrl = imgUrl;
    userData.status = status;

    const userResult = await updateTeacherAdvertiseById(
      tAdvId,
      userId,
      userType,
      userData
    );

    if (userResult?.error) {
      return sendResponse(NextResponse, 400, userResult.error);
    }

    if (userResult) {
      return sendResponse(
        NextResponse,
        200,
        "Advertisement Updated Successfully",
        {
          description: userResult.description,
          imgUrl: userResult.imgUrl,
          status: userResult.status,
        }
      );
    } else {
      return sendResponse(
        NextResponse,
        404,
        "No Advertisement found with the provided ID"
      );
    }
  } catch (error) {
    console.log(error);
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
    const { tAdvId } = params;

    if (!tAdvId) {
      return sendResponse(NextResponse, 400, "No advertisement ID(s) provided");
    }
    const tAdvIds = tAdvId.includes(",")
      ? tAdvId.split(",").map((id) => id.trim())
      : tAdvId;

    const result = await deleteTeacherAdvertiseById(tAdvIds, userId, userType);

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
