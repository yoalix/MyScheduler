import { getAndStoreTokens } from "@/lib/auth/google-auth";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url);
  if (searchParams.has("error")) {
    return NextResponse.json(
      { error: searchParams.get("error") },
      { status: 400 }
    );
  }
  if (!searchParams.has("code")) {
    return NextResponse.json(
      { error: "No authentication code provided." },
      { status: 400 }
    );
  }

  const tokens = await getAndStoreTokens(searchParams.get("code")!);
  redirect("/");
}
