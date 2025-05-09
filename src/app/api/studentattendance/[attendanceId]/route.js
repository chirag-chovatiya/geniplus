import { NextResponse } from "next/server";
import sendResponse from "@/utils/response";
import {
  deleteAttendanceById,
  getAttendanceById,
} from "@/models/studentAttendance/studentAttendanceModel";
import { authenticateToken } from "@/middlewares/auth";

export async function GET(request, { params }) {
  try {
    const { attendanceId } = params;
    const reportResult = await getAttendanceById(attendanceId);
    if (reportResult) {
      return sendResponse(
        NextResponse,
        200,
        "Attendance are available",
        reportResult
      );
    } else {
      return sendResponse(
        NextResponse,
        404,
        "No Attendance found with the provided ID"
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
    const teacherId = authResponse?.user?.id;
    const { attendanceId } = params;

    const result = await deleteAttendanceById(attendanceId, teacherId, userType);

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
