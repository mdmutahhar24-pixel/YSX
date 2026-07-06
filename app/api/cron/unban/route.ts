import { unbanExpiredUsers } from "@/scripts/unbanUser";
import { NextResponse } from "next/server";

export async function GET() {
  await unbanExpiredUsers();
  return NextResponse.json({ ok: true });
}