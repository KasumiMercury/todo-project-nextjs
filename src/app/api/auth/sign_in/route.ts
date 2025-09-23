import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/app/lib/auth/constants";
import { signInJson } from "@/client/user/user/user";
import { signInJsonBody } from "@/client/user/user/user.zod";
import { buildValidationMessage } from "@/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { success, data, error } = signInJsonBody.safeParse(body);

    if (!success) {
      const errors = buildValidationMessage(error);
      return NextResponse.json(
        {
          message: "Validation failed",
          errors,
        },
        { status: 400 },
      );
    }

    const response = await signInJson(data);

    if (response.status === 200) {
      (await cookies()).set(AUTH_COOKIE_NAME, response.data.token);
      return NextResponse.json({ status: 200 });
    }
    return NextResponse.json(response.data, { status: response.status });
  } catch (e) {
    if (e instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Invalid JSON format" },
        { status: 400 },
      );
    }

    console.error("Error creating task:", e);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
