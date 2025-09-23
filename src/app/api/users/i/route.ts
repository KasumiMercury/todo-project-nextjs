import { NextResponse } from "next/server";
import { getI } from "@/client/user/user/user";
import { getToken } from "@/utils";

export async function GET() {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await getI({
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
