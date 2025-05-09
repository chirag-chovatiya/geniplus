import { NextResponse } from "next/server";
import sendResponse from "@/utils/response";
import {
  createTest,
  findTeacherTestByUserId,
  getAllTest,
} from "@/models/addition/studentAdditionModel";
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

  if (authResponse.user.user_type !== "Teacher") {
    return sendResponse(
      NextResponse,
      403,
      "Forbidden: Only teachers can create a test"
    );
  }

  try {
    const teacher_id = authResponse?.user?.id;
    const data = await request.json();
    const { level, status } = data;

    const existingTest = await findTeacherTestByUserId(teacher_id, level, true);

    if (existingTest && status === true) {
      return sendResponse(
        NextResponse,
        400,
        "A test with this level already exists with active status"
      );
    }

    const newData = {
      ...data,
      teacher_id,
    };

    const newAddition = await createTest(newData);

    return sendResponse(
      NextResponse,
      201,
      "Test created successfully",
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
    const teacherId = authResponse?.user?.teacherId || null;
    const level = authResponse?.user?.level;
    const page = parseInt(request.nextUrl.searchParams.get("page")) ?? 1;
    const pageSize =
      parseInt(request.nextUrl.searchParams.get("pageSize")) ?? 10;
    const teacherName = request.nextUrl.searchParams.get("teacherName") || "";

    const allTest = await getAllTest(
      page,
      pageSize,
      userType,
      userId,
      teacherId,
      teacherName,
      level
    );
    if (allTest) {
      return sendResponse(NextResponse, 200, "All Test are available", allTest);
    } else {
      return sendResponse(NextResponse, 404, "No Test available");
    }
  } catch (error) {
    console.log("Error in GET handler:", error);
    return sendResponse(NextResponse, 500, "Internal server error", {
      error: error.message,
    });
  }
}
