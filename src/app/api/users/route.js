import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  createUser,
  getAllUser,
  getUserByEmail,
} from "@/models/users/userModel";
import dotenv from "dotenv";
import sendResponse from "@/utils/response";
import { NextResponse } from "next/server";
import { setCookie } from "cookies-next";
import { authenticateToken } from "@/middlewares/auth";
import { createStudenRating } from "@/models/studentRating/studentRatingModel";
import { createResult } from "@/models/studentResult/studentResultModel";
dotenv.config();

export async function POST(request, response) {
  try {
    const {
      email,
      password,
      name,
      phone_number,
      user_type,
      level,
      images,
      status,
      teacherId,
      teacher_permission,
    } = await request.json();

    if (!email || !password) {
      return sendResponse(NextResponse, 400, "Email and password are required");
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error("JWT_SECRET is not defined in environment variables");
      return sendResponse(
        NextResponse,
        500,
        "Server misconfiguration: JWT secret not found"
      );
    }

    let user = await getUserByEmail(email);

    if (user) {
      if (!user.status) {
        return sendResponse(NextResponse, 403, "Your account is inactive");
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return sendResponse(NextResponse, 400, "Invalid password");
      }

      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          user_type: user.user_type,
          level: user.level,
          teacher_permission: user.teacher_permission || null,
        },
        jwtSecret || "a1sdf25rfdd5g863892fdg25ttf",
        { expiresIn: "7d" }
      );
      setCookie("tkn", token, { expire: new Date() + 9999 });

      return sendResponse(NextResponse, 200, "User logged in successfully", {
        token,
        user,
      });
    } else {
      const authResponse = await authenticateToken(request);
      if (!authResponse.user) {
        return sendResponse(
          NextResponse,
          authResponse.status || 401,
          authResponse.message || "Unauthorized"
        );
      }
      const userId = authResponse?.user?.id;
      const userType = authResponse?.user?.user_type;
      if (!name || !email) {
        return sendResponse(
          NextResponse,
          400,
          "Name and email are required for registration"
        );
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = {
        name,
        email,
        phone_number,
        password: hashPassword,
        user_type,
        level,
        images,
        status,
        teacherId,
        teacher_permission,
      };

      if (userType === "Teacher") {
        newUser.teacherId = userId;
      }

      user = await createUser(newUser);
      if (user.user_type === "Student") {
        const ratingPayload = {
          teacherId: user.teacherId,
          studentName: user.name,
          studentLevel: user.level,
          rating: 0,
        };

        const resultPayload = {
          teacherId: user.teacherId,
          studentName: user.name,
          studentLevel: user.level,
          totalMarks: "0",
          obtainedMarks: "0",
          status: false,
        };

        try {
          await createStudenRating(ratingPayload);
        } catch (ratingError) {
          console.error(
            "Error creating StudentRating for new user:",
            ratingError
          );
        }
        try {
          await createResult(resultPayload);
        } catch (resultError) {
          console.error("Error creating StudentResult for new user:", resultError);
        }
      }
      const token = jwt.sign({ id: user.id }, jwtSecret, {
        expiresIn: "7d",
      });
      setCookie("tkn", token, { expire: new Date() + 9999 });

      return sendResponse(
        NextResponse,
        200,
        "User registered and logged in successfully",
        { token, user }
      );
    }
  } catch (error) {
    console.error("Error during registration/login:", error);
    return sendResponse(NextResponse, 500, "Internal server error", {
      error: error.message,
    });
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
    const teacherId = userType === "Teacher" ? userId : null;
    const page = parseInt(request.nextUrl.searchParams.get("page")) ?? 1;
    const pageSize =
      parseInt(request.nextUrl.searchParams.get("pageSize")) ?? 10;
    const searchQuery = request.nextUrl.searchParams.get("searchQuery");
    const level = request.nextUrl.searchParams.get("level");
    const teacherName = request.nextUrl.searchParams.get("teacherName");

    const allUser = await getAllUser(
      page,
      pageSize,
      searchQuery,
      level,
      userType,
      teacherId,
      teacherName
    );
    if (allUser) {
      return sendResponse(NextResponse, 200, "All User are available", allUser);
    } else {
      return sendResponse(NextResponse, 404, "No User available");
    }
  } catch (error) {
    console.log(error);
    return sendResponse(NextResponse, 500, "Internal server error", {
      error: error.message,
    });
  }
}
