import { getAllTeacherUser } from "@/models/users/userModel";
import dotenv from "dotenv";
import sendResponse from "@/utils/response";
import { NextResponse } from "next/server";
import { authenticateToken } from "@/middlewares/auth";
dotenv.config();

export async function GET(request) {
  const authResponse = await authenticateToken(request);

  if (!authResponse.user) {
    return sendResponse(
      NextResponse,
      401,
      authResponse.message || "Unauthorized"
    );
  }

  if (authResponse.user.user_type !== "Admin") {
    return sendResponse(
      NextResponse,
      403,
      "Forbidden: Only Admin can See TeacherList."
    );
  }
  try {
    const page = parseInt(request.nextUrl.searchParams.get("page")) ?? 1;
    const pageSize =
      parseInt(request.nextUrl.searchParams.get("pageSize")) ?? 10;
    const searchQuery = request.nextUrl.searchParams.get("searchQuery");

    const allUser = await getAllTeacherUser(page, pageSize, searchQuery);
    if (allUser) {
      return sendResponse(
        NextResponse,
        200,
        "All Teacher User are available",
        allUser
      );
    } else {
      return sendResponse(NextResponse, 404, "No Teacher User available");
    }
  } catch (error) {
    return sendResponse(NextResponse, 500, "Internal server error", {
      error: error.message,
    });
  }
}
