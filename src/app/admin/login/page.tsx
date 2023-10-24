import { authorize } from "@/lib/auth/google-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function Login() {
  const client = await authorize();
  if (client) {
    redirect("/");
    return null;
  }
  return <div>Login</div>;
}
