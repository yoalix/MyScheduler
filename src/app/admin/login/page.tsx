import { authorize } from "@/lib/auth/google-auth";
import React from "react";

export default async function Login() {
  await authorize();
  return <div>Login</div>;
}
