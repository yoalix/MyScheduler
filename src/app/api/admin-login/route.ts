import { createAuthLink } from "@/lib/auth/google-auth";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const url = await createAuthLink();
  if (url) {
    return redirect(url);
  }
  return NextResponse.error();
}
