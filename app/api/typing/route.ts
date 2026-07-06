import { pusherServer } from "@/lib/pusher/server";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  const {
    conversationId,
    userId,
    userName,
    isTyping,
  } = await req.json();

  await pusherServer.trigger(
    `conversation-${conversationId}`,
    "typing",
    {
      userId,
      userName,
      isTyping,
    }
  );

  return NextResponse.json({ success: true });
}