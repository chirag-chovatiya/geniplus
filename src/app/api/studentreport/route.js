import { NextResponse } from "next/server";
import sendResponse from "@/utils/response";
import {
  createReport,
  getAllReport,
} from "@/models/studentReport/studentReportModel";
import { authenticateToken } from "@/middlewares/auth";

export async function POST(request) {
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
    const data = await request.json();

    data.studentId = userId;

    data.studentId = userId;
    const newAddition = await createReport(data);

    return sendResponse(
      NextResponse,
      201,
      "Student Report created successfully",
      newAddition
    );
  } catch (error) {
    console.log(error);
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
    const hwStatus = request.nextUrl.searchParams.get("hwStatus");
    const level = request.nextUrl.searchParams.get("level");
    const createdAt = request.nextUrl.searchParams.get("createdAt");
    const studentName = request.nextUrl.searchParams.get("studentName");

    const teacherId = userType === "Teacher" ? userId : null;

    const allReport = await getAllReport(
      userType,
      teacherId,
      page,
      pageSize,
      hwStatus,
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
