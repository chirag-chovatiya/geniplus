import { NextResponse } from "next/server";
import { connectDb } from "@/config/database";
import sendResponse from "@/utils/response";
import { getStudentsByTeacherId } from "@/models/users/userModel";
connectDb();

export async function GET(request, { params }) {
  try {
    const { teacherId } = params;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page")) || 1;
    const pageSize = parseInt(url.searchParams.get("pageSize")) || 10;
    const searchQuery = request.nextUrl.searchParams.get("searchQuery");
    const level = request.nextUrl.searchParams.get("level");

    if (!teacherId) {
      return sendResponse(NextResponse, 400, "Teacher ID is required");
    }

    const studentResult = await getStudentsByTeacherId(
      teacherId,
      page,
      pageSize,
      searchQuery,
      level
    );

    if (studentResult.students.length > 0) {
      return sendResponse(NextResponse, 200, "Students found", studentResult);
    } else {
      return sendResponse(
        NextResponse,
        404,
        "No students found for this teacher"
      );
    }
  } catch (error) {
    console.error(error);
    return sendResponse(NextResponse, 500, "Internal server error");
  }
}
