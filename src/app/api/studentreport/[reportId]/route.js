import { NextResponse } from "next/server";
import sendResponse from "@/utils/response";
import { deleteReportById, getReportById, updateReportById } from "@/models/studentReport/studentReportModel";
import { authenticateToken } from "@/middlewares/auth";

export async function GET(request, { params }) {
  try {
    const { reportId } = params;
    const reportResult = await getReportById(reportId);
    if (reportResult) {
      return sendResponse(NextResponse, 200, "Report are available", reportResult);
    } else {
      return sendResponse(
        NextResponse,
        404,
        "No Report found with the provided ID"
      );
    }
  } catch (error) {
    console.error(error);
    return sendResponse(NextResponse, 500, "Internal server error");
  }
}
export async function POST(request, { params }) {
  try {
    const { reportId } = params;
    const newdata = await request.json();

    const testResult = await updateReportById(reportId, newdata);
    if (testResult) {
      return sendResponse(
        NextResponse,
        200,
        "Report Updated Successfull",
        newdata
      );
    } else {
      return sendResponse(
        NextResponse,
        404,
        "No Report found with the provided ID"
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
    const userId = authResponse?.user?.id;
    const { reportId } = params;
    if (!reportId) {
      return sendResponse(NextResponse, 400, "No report ID(s) provided");
    }

     const reportIds = reportId.includes(",") ? reportId.split(",").map(id => id.trim()) : reportId;
        const result = await deleteReportById(reportIds, userId, userType);

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
