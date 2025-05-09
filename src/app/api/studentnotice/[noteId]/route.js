import { NextResponse } from "next/server";
import sendResponse from "@/utils/response";
import { authenticateToken } from "@/middlewares/auth";
import { deleteNoticeById, getStudentNoteById, updateNoticeById} from "@/models/notice/studentNoticeModel";

export async function GET(request, { params }) {
  try {
    const { noteId } = params;
    const noteResult = await getStudentNoteById(noteId);
    if (noteResult) {
      return sendResponse(
        NextResponse,
        200,
        "Student Notice are available",
        noteResult
      );
    } else {
      return sendResponse(
        NextResponse,
        404,
        "No Student Notice found with the provided ID"
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
    const { noteId } = params;
    const newData = await request.json();

    const userData = {
      studentLevel: newData.studentLevel,
      description: newData.description,
      status: newData.status,
    };
    const userResult = await updateNoticeById(
      noteId,
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
        "Notice Updated Successfull",
        newData
      );
    } else {
      return sendResponse(
        NextResponse,
        404,
        "No Notice found with the provided ID"
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
    const { noteId } = params;

    const result = await deleteNoticeById(noteId, teacherId, userType);

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

