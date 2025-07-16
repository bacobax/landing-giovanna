"use server";
import { signIn } from "next-auth/react";

export async function loginUser(formData: FormData) {
  const username = formData.get("username")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  console.log({username, password});
  if (!username || !password) {
    return { error: "Username and password are required." };
  }

  // Use NextAuth signIn with credentials provider
  const res = await signIn("credentials", {
    username,
    password,
    redirect: false,
  });

  if (res?.error) {
    return { error: res.error };
  }
  if (res?.ok) {
    return { success: true, username };
  }
  return { error: "Unknown error." };
}