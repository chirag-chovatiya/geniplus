import { NextResponse } from "next/server";
import sendResponse from "@/utils/response";
import { authenticateToken } from "@/middlewares/auth";
import {
  checkExistingAttendance,
  createAttendance,
  getAllAttendance,
  updateAttendance,
} from "@/models/studentAttendance/studentAttendanceModel";

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
      "Forbidden: Only teachers can create a "
    );
  }

  try {
    const teacherId = authResponse?.user?.id;
    const data = await request.json();
    data.teacherId = teacherId;

    const existingAttendance = await checkExistingAttendance(data.studentId);

    if (existingAttendance) {
      const updatedAttendance = await updateAttendance(
        existingAttendance.id,
        data.status
      );
      return sendResponse(
        NextResponse,
        200,
        "Attendance updated successfully.",
        updatedAttendance
      );
    }
    const newAddition = await createAttendance(data);
    return sendResponse(
      NextResponse,
      201,
      "Student attendance created successfully",
      newAddition
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
    const page = parseInt(request.nextUrl.searchParams.get("page")) ?? 1;
    const pageSize =
      parseInt(request.nextUrl.searchParams.get("pageSize")) ?? 10;
    const status = request.nextUrl.searchParams.get("status");
    const level = request.nextUrl.searchParams.get("level");
    const createdAt = request.nextUrl.searchParams.get("createdAt");
    const studentName = request.nextUrl.searchParams.get("studentName");
    const teacherName = request.nextUrl.searchParams.get("teacherName");

    const teacherId = userType === "Teacher" ? userId : null;


    const allTest = await getAllAttendance(
      userType,
      teacherId,
      page,
      pageSize,
      status,
      level,
      createdAt,
      studentName,
      teacherName
    );
    if (allTest) {
      return sendResponse(
        NextResponse,
        200,
        "All Attendance are available",
        allTest
      );
    } else {
      return sendResponse(NextResponse, 404, "No Attendance available");
    }
  } catch (error) {
    console.log("Error in GET handler:", error);
    return sendResponse(NextResponse, 500, "Internal server error", {
      error: error.message,
    });
  }
}
