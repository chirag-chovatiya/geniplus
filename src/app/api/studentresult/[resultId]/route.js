import { NextResponse } from "next/server";
import sendResponse from "@/utils/response";
import { authenticateToken } from "@/middlewares/auth";
import { deleteResultById, getResultById, updateResultById } from "@/models/studentResult/studentResultModel";

export async function GET(request, { params }) {
  try {
    const { resultId } = params;
    const noteResult = await getResultById(resultId);
    if (noteResult) {
      return sendResponse(
        NextResponse,
        200,
        "Student Result are available",
        noteResult
      );
    } else {
      return sendResponse(
        NextResponse,
        404,
        "No Student Result found with the provided ID"
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
    const { resultId } = params;
    const newData = await request.json();

    const userData = {
      studentName: newData.studentName,
      studentLevel: newData.studentLevel,
      totalMarks: newData.totalMarks,
    };
    const userResult = await updateResultById(
      resultId,
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
        "Result Updated Successfull",
        newData
      );
    } else {
      return sendResponse(
        NextResponse,
        404,
        "No Result found with the provided ID"
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
    const { resultId } = params;

    const result = await deleteResultById(resultId, teacherId, userType);

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

