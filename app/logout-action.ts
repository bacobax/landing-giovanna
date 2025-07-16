"use server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";

export async function logoutUser() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "Unauthorized" };
  }
  await signOut();

  return { success: true };
}