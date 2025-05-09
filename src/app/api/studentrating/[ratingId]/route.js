import { NextResponse } from "next/server";
import sendResponse from "@/utils/response";
import { authenticateToken } from "@/middlewares/auth";
import { deleteRatingById, getStudenRatingById, updateRatingById } from "@/models/studentRating/studentRatingModel";

export async function GET(request, { params }) {
  try {
    const { ratingId } = params;
    const ratingResult = await getStudenRatingById(ratingId);
    if (ratingResult) {
      return sendResponse(
        NextResponse,
        200,
        "Student Rating are available",
        ratingResult
      );
    } else {
      return sendResponse(
        NextResponse,
        404,
        "No Student Rating found with the provided ID"
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
    const { ratingId } = params;
    const newData = await request.json();

    const userData = {
      studentName: newData.studentName,
      studentLevel: newData.studentLevel,
      rating: newData.rating,
    };
    const userResult = await updateRatingById(
      ratingId,
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
        "Rating Updated Successfull",
        newData
      );
    } else {
      return sendResponse(
        NextResponse,
        404,
        "No Rating found with the provided ID"
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
    const userId = authResponse?.user?.id;
    const { ratingId } = params;

    if (!ratingId) {
      return sendResponse(NextResponse, 400, "No rating ID(s) provided");
    }
    const ratingIds = ratingId.includes(",")
      ? ratingId.split(",").map((id) => id.trim())
      : ratingId;

    const result = await deleteRatingById(ratingIds, userId, userType);

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
