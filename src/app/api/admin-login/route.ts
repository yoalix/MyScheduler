import { authorize } from "@/lib/auth/google-auth";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const client = await authorize();
  if (client) {
    redirect("/");
  }
  return NextResponse.error();
}