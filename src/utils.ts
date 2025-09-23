import { cookies } from "next/headers";
import type { ZodError } from "zod";
import { AUTH_COOKIE_NAME } from "./app/lib/auth/constants";

export type ZodErrors = Array<{ field: string; message: string }>;
export function buildValidationMessage<T>(error: ZodError<T>): ZodErrors {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}

export async function getToken(): Promise<string | undefined> {
  return (await cookies()).get(AUTH_COOKIE_NAME)?.value;
}
