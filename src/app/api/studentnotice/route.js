import { NextResponse } from "next/server";
import sendResponse from "@/utils/response";
import { authenticateToken } from "@/middlewares/auth";
import {
  createStudentNote,
  findNoticeByStudentLevel,
  getAllStudentNote,
} from "@/models/notice/studentNoticeModel";

export async function POST(request) {
  const authResponse = await authenticateToken(request);
  if (!authResponse.user) {
    return sendResponse(
      NextResponse,
      authResponse.status || 401,
      authResponse.message || "Unauthorized"
    );
  }

  if (authResponse.user.user_type !== "Teacher") {
    return sendResponse(
      NextResponse,
      403,
      "Forbidden: Only Teacher can create"
    );
  }

  try {
    const teacherId = authResponse?.user?.id;
    const data = await request.json();
    data.teacherId = teacherId;

    const existingLesson = await findNoticeByStudentLevel(data.studentLevel);

    if (existingLesson && existingLesson.teacherId === teacherId) {
      return sendResponse(
        NextResponse,
        400,
        `Previous lesson for student level ${data.studentLevel} was inactive. Creating new lesson.`
      );
    }

    const newAdv = await createStudentNote(data);
    return sendResponse(
      NextResponse,
      201,
      "Student Notice created successfully",
      newAdv
    );
  } catch (error) {
    console.error(error);
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
    const level = authResponse?.user?.level;
    const teacherId =
      userType === "Teacher" ? userId : authResponse?.user?.teacherId;
    const page = parseInt(request.nextUrl.searchParams.get("page")) ?? 1;
    const pageSize =
      parseInt(request.nextUrl.searchParams.get("pageSize")) ?? 10;
    const teacherName = request.nextUrl.searchParams.get("teacherName");


    const allAdv = await getAllStudentNote(
      userType,
      teacherId,
      level,
      page,
      pageSize,
      teacherName
    );

    if (allAdv) {
      return sendResponse(
        NextResponse,
        200,
        "All Student Notice are available",
        allAdv
      );
    } else {
      return sendResponse(NextResponse, 404, "No Student Notice available");
    }
  } catch (error) {
    console.log(error);
    return sendResponse(NextResponse, 500, "Internal server error", {
      error: error.message,
    });
  }
}
