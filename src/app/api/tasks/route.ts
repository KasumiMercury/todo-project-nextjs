import { type NextRequest, NextResponse } from "next/server";
import { taskCreateTask, taskGetAllTasks } from "@/client/task/task/task";
import { taskCreateTaskBody } from "@/client/task/task/task.zod";
import { buildValidationMessage, getToken } from "@/utils";

export async function POST(request: NextRequest) {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { success, data, error } = taskCreateTaskBody.safeParse(body);

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

    const response = await taskCreateTask(data, {
      headers: { Authorization: `Bearer ${token}` },
    });

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

export async function GET() {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await taskGetAllTasks({
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (e) {
    console.error("Error creating task:", e);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
