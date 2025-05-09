import { NextResponse } from "next/server";
import sendResponse from "@/utils/response";
import { authenticateToken } from "@/middlewares/auth";
import { deleteLessonById, getLessonById, updateLessonById } from "@/models/studentLesson/studentLessonModel";

export async function GET(request, { params }) {
  try {
    const { lessonId } = params;
    const reportResult = await getLessonById(lessonId);
    if (reportResult) {
      return sendResponse(
        NextResponse,
        200,
        "Lesson are available",
        reportResult
      );
    } else {
      return sendResponse(
        NextResponse,
        404,
        "No Lesson found with the provided ID"
      );
    }
  } catch (error) {
    console.error(error);
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
    const teacherId = authResponse?.user?.id;
    const { lessonId } = params;
    const newData = await request.json();

    const userData = {
      studentLevel: newData.studentLevel,
      description: newData.description,
      status: newData.status,
      excelLink: newData.excelLink,
      linkStatus: newData.linkStatus
    };
    const userResult = await updateLessonById(
      lessonId,
      teacherId,
      userType,
      userData
    );

    if (userResult?.error) {
      return sendResponse(
        NextResponse,
        400,
        userResult.error 
      );
    }

    if (userResult) {
      return sendResponse(
        NextResponse,
        200,
        "Lesson Updated Successfull",
        newData
      );
    } else {
      return sendResponse(
        NextResponse,
        404,
        "No Lesson found with the provided ID"
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
    const teacherId = authResponse?.user?.id;
    const { lessonId } = params;

    const result = await deleteLessonById(lessonId, teacherId, userType);

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
