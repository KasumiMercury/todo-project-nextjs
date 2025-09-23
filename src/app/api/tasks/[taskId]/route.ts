import { type NextRequest, NextResponse } from "next/server";
import {
  taskDeleteTask,
  taskGetTask,
  taskUpdateTask,
} from "@/client/task/task/task";
import { taskUpdateTaskBody } from "@/client/task/task/task.zod";
import { buildValidationMessage, getToken } from "@/utils";

export async function GET(context: { params: Promise<{ taskId: string }> }) {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;

    const response = await taskGetTask(params.taskId, {
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

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ taskId: string }> },
) {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const params = await context.params;
    const { success, data, error } = taskUpdateTaskBody.safeParse(body);

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

    const response = await taskUpdateTask(params.taskId, data, {
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

export async function DELETE(context: { params: Promise<{ taskId: string }> }) {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;

    const response = await taskDeleteTask(params.taskId, {
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
