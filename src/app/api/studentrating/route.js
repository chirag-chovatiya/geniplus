import { NextResponse } from "next/server";
import sendResponse from "@/utils/response";
import { authenticateToken } from "@/middlewares/auth";
import { createStudenRating, getAllStudenRating } from "@/models/studentRating/studentRatingModel";

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
      "Forbidden: Only teachers can create a rating"
    );
  }
  try {
    const teacherId = authResponse?.user?.id;
    const data = await request.json();
    data.teacherId = teacherId;

    const newLesson = await createStudenRating(data);
    return sendResponse(
      NextResponse,
      201,
      "Student rating created successfully",
      newLesson
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
    const teacherId =
      userType === "Teacher" ? userId : authResponse?.user?.teacherId;
    const page = parseInt(request.nextUrl.searchParams.get("page")) ?? 1;
    const pageSize =
      parseInt(request.nextUrl.searchParams.get("pageSize")) ?? 10;
    const teacherName = request.nextUrl.searchParams.get("teacherName");
    const studentName = request.nextUrl.searchParams.get("studentName");
    const studentLevel = request.nextUrl.searchParams.get("studentLevel");

    const allAdv = await getAllStudenRating(
      userType,
      userId,
      teacherId,
      page,
      pageSize,
      teacherName,
      studentName,
      studentLevel
    );

    if (allAdv) {
      return sendResponse(
        NextResponse,
        200,
        "All Rating are available",
        allAdv
      );
    } else {
      return sendResponse(NextResponse, 404, "No Rating available");
    }
  } catch (error) {
    console.log(error);
    return sendResponse(NextResponse, 500, "Internal server error", {
      error: error.message,
    });
  }
}
