import { NextResponse } from "next/server";
import { connectDb } from "@/config/database";
import sendResponse from "@/utils/response";
import bcrypt from "bcrypt";
import {
  deleteUserById,
  getUserByIdWithReports,
  updateUserById,
} from "@/models/users/userModel";
import { authenticateToken } from "@/middlewares/auth";
connectDb();

export async function GET(request, { params }) {
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
    const { userId } = params;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page")) || 1;
    const pageSize = parseInt(url.searchParams.get("pageSize")) || 10;
    const createdAt = request.nextUrl.searchParams.get("createdAt");
    const hwStatus = url.searchParams.get("hwStatus");

    if (!userId) {
      return sendResponse(NextResponse, 400, "Bad Request: Missing student ID");
    }

    const userResult = await getUserByIdWithReports(
      userId,
      teacherId,
      userType,
      page,
      pageSize,
      createdAt,
      hwStatus
    );

    if (!userResult) {
      return sendResponse(
        NextResponse,
        403,
        "Unauthorized: This student is not associated with you"
      );
    } else {
      return sendResponse(
        NextResponse,
        200,
        "Student data fetched successfully",
        userResult
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
    const teacherId = authResponse?.user?.id;
    const { userId } = params;
    const newData = await request.json();

    const userData = {
      name: newData.name,
      phone_number: newData.phone_number,
      level: newData.level,
      user_type: newData.user_type,
      images: newData.images,
      status: newData.status,
      teacher_permission: newData.teacher_permission,
    };

    if (newData.password) {
      const hashedPassword = await bcrypt.hash(newData.password, 10);
      userData.password = hashedPassword;
    }
    const userResult = await updateUserById(
      userId,
      teacherId,
      userType,
      userData
    );

    if (userResult) {
      return sendResponse(
        NextResponse,
        200,
        "User Updated Successfull",
        newData
      );
    } else {
      return sendResponse(
        NextResponse,
        404,
        "No User found with the provided ID"
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
    const { userId } = params;
    const deleteUser = await deleteUserById(userId, teacherId, userType);
    if (!deleteUser) {
      return sendResponse(
        NextResponse,
        404,
        "No User found with the provided ID"
      );
    } else {
      return sendResponse(NextResponse, 200, "User Deleted successfully");
    }
  } catch (error) {
    console.error(error);
    return sendResponse(NextResponse, 500, "Internal server error");
  }
}
